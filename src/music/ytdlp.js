import { spawn } from 'node:child_process';
import logger from '@local/logger';
import { classify } from './classify.js';

const BIN = process.env.YTDLP_PATH ?? 'yt-dlp';
const PRINT_FORMAT = '%(id)s\t%(title)s\t%(duration)s';

function run(args, { timeoutMs = 30_000 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(BIN, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`yt-dlp timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdout.on('data', (chunk) => (stdout += chunk));
    child.stderr.on('data', (chunk) => (stderr += chunk));
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (code) => {
      clearTimeout(timer);

      if (code === 0) {
        resolve(stdout);
        return;
      }

      reject(new Error(stderr.trim().split('\n').at(-1) || `yt-dlp exited with code ${code}`));
    });
  });
}

function parseTracks(stdout) {
  return stdout
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [id, title, duration] = line.split('\t');

      return {
        id,
        title: title || id,
        duration: Number.parseInt(duration, 10) || 0,
        url: `https://www.youtube.com/watch?v=${id}`,
      };
    });
}

// Resolves a play query (url, playlist url, or search terms) to a list of tracks.
export async function resolveTracks(query) {
  const { type, target } = classify(query);
  const args = ['--no-warnings', '--print', PRINT_FORMAT];

  if (type === 'playlist') {
    args.push('--flat-playlist');
  } else {
    args.push('--no-playlist');
  }

  args.push(target);

  logger.debug({ message: 'Resolving tracks', type, target });
  const stdout = await run(args, { timeoutMs: type === 'playlist' ? 60_000 : 30_000 });

  return parseTracks(stdout);
}

// Spawns yt-dlp streaming bestaudio to stdout. Caller owns the process and
// must kill it when playback is skipped or stopped.
export function streamTrack(track) {
  const child = spawn(
    BIN,
    ['--no-warnings', '--quiet', '--no-playlist', '-f', 'bestaudio/best', '-o', '-', track.url],
    {
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );

  child.stderr.on('data', (chunk) => {
    logger.debug({ message: 'yt-dlp stderr', track: track.id, output: String(chunk).trim() });
  });

  return child;
}
