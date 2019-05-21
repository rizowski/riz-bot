import flatten from 'lodash.flatten';
import { Command } from './command.d';
import help from './help';
import add from './add';
import change from './change';
import your from './your';
import set from './set';
import join from './join';
import get from './get';
import remove from './remove';

const commands: Command[] = flatten([[help], add, change, your, set, join, get, remove]);

export default commands;
