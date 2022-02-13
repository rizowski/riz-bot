const logger = require('@local/logger');
const cmds = require('./all');

exports.run = async (data, client) => {
  logger.info({
    id: data.commandId,
    command: `/${data.commandName} ${data.options?.[0]?.name}`,
  });
  const cmd = cmds.find((cmd) => cmd.trigger(data));

  if (!cmd) {
    // const options = data.options?.map((o) => ` ${o.name}`).join(' ');

    await data.reply(`Command \`/${data.commandName}\` has not been implemented yet.`);
  }

  await data.deferReply();

  try {
    await cmd.action(data, client);
  } catch (error) {
    console.error(error);
  }
};
