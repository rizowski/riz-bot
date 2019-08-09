import { Command } from '../../command.d';
import uptime from './uptime';

const cmd: Command = {
  title: 'Get My Uptime',
  help: {
    examples: ['your uptime'],
    description: "Responds with the admin's uptime. May or may not be depressed",
  },
  requirements: {
    basic: true,
  },
  regex: /^(your )?uptime/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  conditions: [],
  async action({ client, message }) {
    return message.channel.send(uptime(client.uptime));
  },
};

export default cmd;
