const logger = require('@local/logger');

function createSuccess(region) {
  const color = region.optimal ? 16312092 : 47377;

  return {
    embed: {
      title: 'Change Successful',
      color,
      fields: [
        {
          name: 'New Region:',
          value: region.name || 'Earth',
          inline: true,
        },
        {
          name: 'VIP?',
          value: region.vip ? 'yes' : 'no',
          inline: true,
        },
        {
          name: 'Optimal',
          value: region.optimal ? 'Ye' : 'nope',
          inline: true,
        },
      ],
    },
  };
}

function getState(oldRegion, newRegion) {
  if (oldRegion.optimal && newRegion.optimal) {
    return 'Leaving optimal for optimal';
  }

  if (oldRegion.optimal && !newRegion.optimal) {
    return 'Leaving optimal for suboptimal';
  }

  if (!oldRegion.optimal && newRegion.optimal) {
    return 'Leaving suboptimal for optimal';
  }

  return 'Leaving crap for crap';
}

function createPending({ theChosenOne, oldRegion = {} }) {
  const defaultLocation = 'Earth';

  return {
    embed: {
      title: 'Changing Region...',
      color: 36025,
      fields: [
        {
          name: 'Moving to...',
          value: `${oldRegion.name || defaultLocation} --> ${theChosenOne.name || defaultLocation}`,
          inline: true,
        },
        {
          name: 'State',
          value: getState(oldRegion, theChosenOne),
          inline: true,
        },
      ],
    },
  };
}

module.exports = {
  trigger(data) {
    return data.name === 'region' && data.options?.[0].name === 'optimize';
  },
  async action({ guild, channel }) {
    const regions = await guild.fetchVoiceRegions();
    const oldRegion = regions.get(guild.region) || {};
    const [[, theChosenOne]] = regions.filter((r) => r.name.startsWith('US') && r.id !== guild.region);

    await channel.send(createPending({ theChosenOne, oldRegion }));

    try {
      await guild.setRegion(theChosenOne.id);
      await channel.send(createSuccess(theChosenOne));
    } catch (error) {
      logger.error(error);

      await channel.send("Well shit... I can't change regions for some reason");
    }
  },
};
