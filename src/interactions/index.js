const logger = require('@local/logger');
const cmds = require('./all');

exports.run = async (data, client) => {
  logger.info({
    id: data.data.id,
    command: `/${data.data.name} ${data.data.options?.[0].name}`,
  });
  const cmd = cmds.find((cmd) => cmd.trigger(data.data));

  if (!cmd) {
    const options = data.data.options
      ?.map((o) => {
        return ` ${o.name}`;
      })
      .join(' ');

    await data.channel.send(`Command \`/${data.data.name}${options}\` has not been implemented yet.`);
  }

  try {
    await cmd.action(data);
  } catch (error) {
    console.error(error);
  }
};
