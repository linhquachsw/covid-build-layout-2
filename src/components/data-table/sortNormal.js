import * as _ from 'lodash';

const sortOrder = (a, b) => {
  if (a === b) return 0;

  if (_.isString(a)) {
    return a.localeCompare(b);
  }

  return a > b ? 1 : -1;
};

export const sortNormal = (a, b, order) => {
  if (order === 'asc') {
    return sortOrder(a, b);
  }

  return sortOrder(b, a);
};
