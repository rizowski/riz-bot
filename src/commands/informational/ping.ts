import { Command } from '../command.d';
import { createRandRange } from '../../utils/math';

const responses = [
  (ping: number) => `My ping to discord is ${ping}/ms.`,
  (ping: number) => `Holy Shit! A whole ${ping}/ms.`,
  (ping: number) => `${ping}/ms`,
  (ping: number) => `${ping / 1000}/sec`,
  (ping: number) => `${ping / (1000 * 60)}/min`,
  (ping: number) => `${ping / (1000 * 60 * 60)}/hr`,
  () => 'PONG/ms!',
];

const cmd: Command = {
  title: 'Get my Ping',
  example: 'your ping',
  description: "Responds with the bot's current ping to discord",
  requirements: {
    basic: true,
  },
  regex: /^(your )?ping/i,
  trigger(content) {
    return cmd.regex.test(content);
  },
  conditions: [],
  action({ client, message }) {
    const [cleanPing] = `${client.ping}`.split('.');
    const rand = createRandRange(0, responses.length - 1);
    const response = responses[rand];

    return message.channel.send(response(Number.parseInt(cleanPing, 10)));
  },
};

export default cmd;
