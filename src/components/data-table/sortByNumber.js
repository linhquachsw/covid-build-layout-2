const sortNormal = (a, b, order) => {
  if (order === 'asc') {
    return a > b ? 1 : -1;
  }
  return a < b ? 1 : -1;
};

export const sortByNumber = (a, b, order) => {
  if (a === b) return 0;
  if (a === '') a = -1;
  if (b === '') b = -1;

  return sortNormal(Number(a), Number(b), order);
};
