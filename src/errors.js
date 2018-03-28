function defaultArgs(msgOrObj) {
  return typeof msgOrObj === 'object'
    ? msgOrObj
    : { title: msgOrObj };
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

    return {
      embed: {
        title: this.title,
        color: 12124160,
        description,
        fields: this.fields,
      }
    };
  }
}

class GeneralError extends BaseError {
  constructor(msgOrObj) {
    super(msgOrObj);
  }
}

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



module.exports = {
  GeneralError,
  InputError,
  GuildError
};
