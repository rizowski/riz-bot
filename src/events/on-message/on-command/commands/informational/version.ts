import { Command } from '../command.d';
import pkg from '../../../../../../package.json';

const cmd: Command = {
  title: 'Get My Version',
  help: {
    examples: ['your version'],
    description: "I'll spill the beans and give you my version.",
  },
  requirements: {
    basic: true,
  },
  regex: /^(your )?version/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  conditions: [],
  async action({ message }) {
    return message.channel.send(`My current version is: \`v${pkg.version}\``);
  },
};

export default cmd;
