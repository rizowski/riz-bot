const { message, client } = require('./discord');
const { Observable } = require('rxjs');

const people = {
  '108352053692125184': 'bacon',
  '108568431053246464': 'zack',
  '189006310501646336': 'jerran',
  '100758264047747072': 'rizowski',
  '65055432095301632': 'aaron'
};

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
          value: ping,
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
          value: ping,
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

function createHelp() {
  return {
    embed: {
      title: 'Help',
      description: 'Any command needs to be prefixed with !',
      fields: [
        {
          name: '!change region',
          value: 'This will change the region of the server.'
        },
        {
          name: '!help',
          value: 'This will show this help.'
        }
      ]
    }
  };
}
function isInGuild(message) {
  return message.guild && message.guild.available;
}

message
  .filter((message) => message.content.startsWith('!'))
  .filter((message) => !!people[message.author.id])
  .throttle(() => Observable.interval(3000))
  .flatMap(async function(message) {
    console.log(`Handling ${message.content} for ${ message.author.username }#${ message.author.discriminator }`);
    const [ base, action ] = message.content.split('!').join('').split(' ');

    try {
      if (base === 'change') {
        if (action === 'region' && isInGuild(message)) {
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
        }
      } else if (base === 'help') {
        await message.channel.send(createHelp());
      }
    } catch(e) {
      console.error('Global Handled', e);
      await message.channel.send(createError(`Failed to !${base} ${action}`));
    }


    return message;
  })
  .subscribe((msg) => {
    const channel = msg.channel.name && ` in ${ msg.channel.name }`;
    console.log(`Responding to ${ msg.author.username }#${ msg.author.discriminator }${channel || ''}`);
  }, (e) => {
    console.error('Unexpected', e);
  }, () => console.log('done'));
