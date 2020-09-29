import { i18n } from '../../share/i18next';

export const enableTypeFormatter = (cell) => {
  return i18n.t(cell ? 'Enabled' : 'Disabled');
};
