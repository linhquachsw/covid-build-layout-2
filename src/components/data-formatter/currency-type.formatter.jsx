import Currency from 'react-currency-formatter';

export const currencyTypeFormatter = (cell) => {
  if (!cell) return null;

  return <Currency quantity={cell} currency="USD" />;
};
