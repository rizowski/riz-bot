import * as global from './global/index.js';
import * as list from './list/index.js';
import * as join from './join/index.js';
import * as leave from './leave/index.js';
import * as create from './create/index.js';
import * as emoji from './emoji/index.js';

const groups = [global, list, join, leave, create, emoji];

export const cmds = groups.flatMap((g) => g.cmds);
export const definitions = groups.flatMap((g) => g.definitions).map((d) => d.toJSON());
