// @flow
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import dateFnsAdd from 'date-fns/addDays';
import dateFnsSub from 'date-fns/subDays';
import { DateUtils } from 'react-day-picker';
import formatISO from 'date-fns/formatISO';
import * as _ from 'lodash';
import enUS from 'date-fns/locale/en-US';
import es from 'date-fns/locale/es';
import { I18nUtils } from './i18n/i18n-utils';

export const DATE_FORMAT = 'MM/dd/yyyy';

export function parseDate(str, format = DATE_FORMAT, locale) {
  if (str.length !== format.length) {
    return undefined;
  }
  const parsed = dateFnsParse(str, format, new Date(), { locale });

  if (DateUtils.isDate(parsed)) {
    return parsed;
  }

  return undefined;
}

export function formatISODate(date: Date | string) {
  // eslint-disable-next-line no-param-reassign
  if (_.isString(date)) date = parseDate(date);

  if (!date) return date;

  return formatISO(date, { representation: 'date' });
}

export const MAP_LOCALES = {
  en: enUS,
  es,
};

export function formatDate(date, format = DATE_FORMAT, locale = 'en') {
  if (!date) return '';

  return dateFnsFormat(new Date(date), format, { locale: MAP_LOCALES[locale] });
}

export function formatDateTranslate(date) {
  if (!date) return '';

  const lang = localStorage.getItem('i18nextLng');
  return dateFnsFormat(new Date(date), I18nUtils.setFormat(lang), { locale: I18nUtils.setLocale(lang) });
}

export function addDays(date, amount = 0) {
  if (!date) return null;

  return dateFnsAdd(new Date(date), amount);
}

export function subDays(date, amount = 0) {
  if (!date) return null;

  return dateFnsSub(new Date(date), amount);
}

export function parseTime(time, format = 'h:mm aa', locale) {
  if (!time) return null;

  return dateFnsParse(time, format, new Date(), { locale });
}

export function formatTime(time, format = 'h:mm aa', locale) {
  if (!time) return null;

  return dateFnsFormat(new Date(time), format, { locale });
}

export function convertToLocalDate(str) {
  if (!/^[0-9]{4}-/.test(str)) return isFinite(new Date(str)) ? new Date(str) : new Date();
  const numberArray = str.split(/[^0-9]/).map((s) => parseInt(s));
  return new Date(
    numberArray[0],
    numberArray[1] - 1 || 0,
    numberArray[2] || 1,
    numberArray[3] || 0,
    numberArray[4] || 0,
    numberArray[5] || 0,
    numberArray[6] || 0
  );
}
