import * as _ from 'lodash';
import { sortNormal } from './sortNormal';

export const sortInsensitive = (x, y, order) => {
  const a = _.isString(x) ? x.toLowerCase() : x;
  const b = _.isString(y) ? y.toLowerCase() : y;

  if (a === b) return sortNormal(x, y, order);

  return sortNormal(a, b, order);
};
