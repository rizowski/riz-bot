function defaultArgs(msgOrObj) {
  return typeof msgOrObj === 'object' ? msgOrObj : { title: msgOrObj };
}

class BaseError extends Error {
  constructor(msgOrObj) {
    const { title, reason, command, fields } = defaultArgs(msgOrObj);

    super(`${title} ${reason || ''}`);

    Error.captureStackTrace(this, this.constructor);

    this.command = command;
    this.title = title;
    this.reason = reason;
    this.fields = fields;
  }

  createEmbed() {
    const description = this.reason && `Reason: ${this.reason}`;

    const result = {
      embed: {
        title: this.title,
        color: 12124160,
        description,
      },
    };

    if (this.fields) {
      result.embed.fields = this.fields;
    }

    return result;
  }
}

class GeneralError extends BaseError {}

class EmbedError extends Error {
  constructor(msgOrObj) {
    const { title, reason, fields, command } = defaultArgs(msgOrObj);

    super(`${title} ${reason || ''}`);

    Error.captureStackTrace(this, this.constructor);

    this.title = title;
    this.command = command;
    this.color = 12124160;
    this.reason = reason;
    this.fields = fields;
  }

  createEmbed() {
    const description = this.reason && `Reason: ${this.reason}`;

    return {
      embed: {
        title: this.title,
        color: 12124160,
        description,
        fields: this.fields,
      },
    };
  }
}

class PreconditionError extends EmbedError {
  constructor(...args) {
    super(...args);

    this.title = 'Precondition Failed';
    this.color = 'yellow';
  }
}

class CommandError extends EmbedError {}
class InputError extends BaseError {
  constructor(msgOrObj) {
    super(msgOrObj);

    this.title = 'Input Error';
  }
}

class GuildError extends BaseError {
  constructor(msgOrObj = 'Not in Guild') {
    super(msgOrObj);

    this.title = 'Guild Error';
    this.reason = 'Must be in a server to execute this command';
  }
}

class PermissionsError extends BaseError {
  constructor(msgOrObj = 'Cannot execute command') {
    super(msgOrObj);

    this.title = 'Permissions Error';
    this.reason = 'You do not have permissions to execute that command';
    this.fields = [
      {
        name: 'Level Needed',
        value: msgOrObj,
      },
    ];
  }
}

module.exports = {
  GeneralError,
  InputError,
  GuildError,
  PreconditionError,
  CommandError,
  PermissionsError,
};
