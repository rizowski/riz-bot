import { Embedable } from './responses.d';

interface Detail {
  title: string;
  description: string;
  inline?: boolean;
}

interface ErrorInput {
  title?: string;
  reason: string;
  color?: number;
  details?: Detail[];
}

interface ErrorContract {
  title: string;
  data: ErrorInput;
}

export class GeneralError extends Error implements ErrorContract {
  title: string;

  data: ErrorInput;

  constructor(input: ErrorInput) {
    super(input.reason);
    Error.captureStackTrace(this, this.constructor);

    this.title = input.title ?? 'General Error';
    this.data = input;
  }

  serialize(): Embedable {
    const { reason: description, color, details } = this.data;

    return {
      embed: {
        title: this.title,
        description,
        color: color ?? 12124160,
        fields: details?.map((d) => ({ name: d.title, value: d.description, inline: d.inline })),
      },
    };
  }
}

export class GuildError extends GeneralError {
  constructor(data: ErrorInput) {
    data.reason = data.reason || 'Must be in a guild';
    data.title = 'Guild Error';
    super(data);
  }
}

export class PreconditionError extends GeneralError {
  constructor(data: ErrorInput) {
    data.color = 12124160;
    data.title = 'Precondition Failed';

    super(data);
  }
}

interface CommandErrorInput {
  title: string;
  command: string;
  reason: string;
  input?: string;
}

export class CommandError extends GeneralError {
  constructor(input: CommandErrorInput) {
    const userInput = input.input
      ? [
          {
            title: 'Input',
            description: input.input,
          },
        ]
      : [];
    super({
      title: input.title,
      reason: input.reason,
      details: [
        {
          title: 'Command',
          description: input.command,
        },
        ...userInput,
      ],
    });
  }
}

export class InputError extends GeneralError {
  constructor(input: string, reason: string, expected: string) {
    super({
      title: 'Bad Input',
      reason,
      details: [
        {
          title: 'Input',
          description: input,
        },
        {
          title: 'Expected',
          description: expected,
        },
      ],
    });
  }
}

export class PermissionsError extends GeneralError {
  constructor(level: string) {
    super({
      title: 'Cannot execute command',
      reason: 'You do not have permissions to execute that command',
      details: [
        {
          title: 'Level needed',
          description: level,
        },
      ],
    });
  }
}
