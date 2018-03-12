function createError(title, reason){
  const description = reason && `Reason ${reason}`;

  return {
    embed: {
      title,
      color: 12124160,
      description,
    }
  };
}

function createSuccess(ping, region) {
  return {
    embed: {
      title: 'Change Successful',
      color: 47377,
      fields: [
        {
          name: 'Ping',
          value: `${ping}`,
          inline: true
        },
        {
          name: 'Current Region',
          value: region,
          inline: true
        }
      ]
    }
  };
}

function createPending(ping, region){
  return {
    embed: {
      title: 'Changing Region...',
      description: 'Attempting to change the region',
      color: 36025,
      fields: [
        {
          name: 'Current Ping',
          value: `${ping}`,
          inline: true
        },
        {
          name: 'Chosen Region',
          value: region,
          inline: true
        }
      ]
    }
  };
}

function isInGuild(message) {
  return message.guild && message.guild.available;
}

module.exports = async (client, message) => {
  if (!isInGuild(message)) {
    return;
  }

  const regions = await client.fetchVoiceRegions();
  const america = regions.filterArray((r) => /^US/.test(r.name) && r.id !== message.guild.region);
  const sorted = america.sort((a, b) => b.optimal);
  const theChosenOne = sorted[0];

  await message.channel.send(createPending(client.ping, theChosenOne.name));

  try {
    await message.guild.setRegion(theChosenOne.id);
  } catch(e) {
    await message.channel.send(createError('Failed to change region'));
    return;
  }

  await message.channel.send(createSuccess(client.ping, theChosenOne.name));
};
