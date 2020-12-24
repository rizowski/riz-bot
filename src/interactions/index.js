const cmds = require('./all');

exports.run = async (data) => {
  const cmd = cmds.find((cmd) => cmd.trigger(data.data));

  console.log(cmd);

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
