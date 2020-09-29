export const versionFormatter = (cell) => {
  if (!cell) return '';
  if (cell === '0') return (0.1).toFixed(1);

  return (cell / 10).toFixed(1);
};
