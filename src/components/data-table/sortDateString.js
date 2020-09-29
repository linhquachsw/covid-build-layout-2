const sortNormal = (a, b, order) => {
  if (order === 'asc') {
    return a > b ? 1 : -1;
  }
  return a < b ? 1 : -1;
};

export const sortDateString = (a, b, order) => {
  const parsedValueA = new Date(a);
  const parsedValueB = new Date(b);

  if (isNaN(parsedValueA) && isNaN(parsedValueB)) return 0;
  if (isNaN(parsedValueA) && !isNaN(parsedValueB)) return 1;
  if (!isNaN(parsedValueA) && isNaN(parsedValueB)) return -1;

  return sortNormal(parsedValueA, parsedValueB, order);
};
