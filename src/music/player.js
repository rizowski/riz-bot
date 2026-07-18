import {
  AudioPlayerStatus,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
} from '@discordjs/voice';
import logger from '@local/logger';
import * as status from '../status/index.js';
import { TrackQueue } from './queue.js';
import { streamTrack } from './ytdlp.js';

const IDLE_DISCONNECT_MS = 5 * 60 * 1000;
const DEFAULT_VOLUME = 50;

const sessions = new Map();

class MusicSession {
  constructor(guildId) {
    this.guildId = guildId;
    this.queue = new TrackQueue();
    this.current = null;
    this.volume = DEFAULT_VOLUME;
    this.connection = null;
    this.process = null;
    this.resource = null;
    this.idleTimer = null;

    this.player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
    });

    this.player.on(AudioPlayerStatus.Idle, () => {
      this.#cleanupTrack();
      this.playNext();
    });

    this.player.on('error', (error) => {
      logger.error({ message: 'Audio player error', guild: this.guildId, err: error });
      this.#cleanupTrack();
      this.playNext();
    });
  }

  async connect(voiceChannel) {
    if (this.connection && this.connection.joinConfig.channelId === voiceChannel.id) {
      return;
    }

    this.connection?.destroy();
    this.channelName = voiceChannel.name;
    this.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    this.connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(this.connection, VoiceConnectionStatus.Signalling, 5000),
          entersState(this.connection, VoiceConnectionStatus.Connecting, 5000),
        ]);
      } catch {
        this.destroy();
      }
    });

    await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
    this.connection.subscribe(this.player);
  }

  enqueue(tracks) {
    this.queue.addAll(tracks);

    if (!this.current) {
      this.playNext();
    }
  }

  playNext() {
    const track = this.queue.next();

    if (!track) {
      this.current = null;
      status.clearPlaying();
      this.#scheduleIdleDisconnect();
      return null;
    }

    this.#clearIdleTimer();
    this.current = track;
    this.process = streamTrack(track);
    this.resource = createAudioResource(this.process.stdout, {
      inputType: StreamType.Arbitrary,
      inlineVolume: true,
    });
    this.resource.volume.setVolume(this.volume / 100);
    this.player.play(this.resource);
    status.setPlaying(this.channelName);
    logger.info({ message: 'Playing', guild: this.guildId, track: track.title });

    return track;
  }

  skip() {
    const skipped = this.current;
    this.player.stop(true);

    return skipped;
  }

  stop() {
    this.queue.clear();
    this.player.stop(true);
    this.destroy();
  }

  pause() {
    return this.player.pause();
  }

  resume() {
    return this.player.unpause();
  }

  setVolume(percent) {
    this.volume = percent;
    this.resource?.volume?.setVolume(percent / 100);
  }

  #cleanupTrack() {
    if (this.process && this.process.exitCode === null) {
      this.process.kill('SIGKILL');
    }

    this.process = null;
    this.resource = null;
    this.current = null;
  }

  #scheduleIdleDisconnect() {
    this.#clearIdleTimer();
    this.idleTimer = setTimeout(() => this.destroy(), IDLE_DISCONNECT_MS);
  }

  #clearIdleTimer() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  destroy() {
    this.#clearIdleTimer();
    this.#cleanupTrack();
    this.queue.clear();

    if (this.connection && this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
      this.connection.destroy();
    }

    this.connection = null;
    sessions.delete(this.guildId);
    status.clearPlaying();
  }
}

export function getSession(guildId) {
  let session = sessions.get(guildId);

  if (!session) {
    session = new MusicSession(guildId);
    sessions.set(guildId, session);
  }

  return session;
}

export function findSession(guildId) {
  return sessions.get(guildId) ?? null;
}
