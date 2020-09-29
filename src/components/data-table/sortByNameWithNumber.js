import { sortNormal } from './sortNormal';
import { sortInsensitive } from './sortInsensitive';

export const sortByNameWithNumber = (a, b, order) => {
  if (a === b) return 0;

  let regex = /^(.+)\s(\d+)$/;
  let ma = `${a}`.match(regex);
  let mb = `${b}`.match(regex);

  if (!ma || !mb) {
    regex = /^\d+$/;
    ma = regex.test(`${a}`);
    mb = regex.test(`${b}`);

    if (ma && mb) return sortNormal(Number(a), Number(b), order);

    return sortInsensitive(a, b, order);
  }

  if (ma[1] !== mb[1]) return sortInsensitive(a, b, order);

  return sortNormal(Number(ma[2]), Number(mb[2]), order);
};
