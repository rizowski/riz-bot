import flatten from 'lodash.flatten';
import { Command } from './command.d';
import help from './help';
import add from './additions';
import change from './actions';
import get from './informational';
import remove from './destructive';

const commands: Command[] = flatten([[help], add, change, get, remove]);

export default commands;
