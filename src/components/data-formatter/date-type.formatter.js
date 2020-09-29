import { format } from 'date-fns';
import parseISO from 'date-fns/parseISO';
import { convertToLocalDate } from 'App/utils/date-helper';
import * as _ from 'lodash';

export const dateTypeFormatter = (cell) => {
  if (!cell) return null;

  const date = _.isDate(cell) ? cell : parseISO(cell);

  return format(date, 'P');
};

export const localDateTypeFormatter = (cell) => {
  if (!cell) return null;

  const date = convertToLocalDate(cell);

  return format(date, 'P');
};

export const localDateTimeTypeFormatter = (cell) => {
  if (!cell) return null;
  const date = convertToLocalDate(cell);
  return format(date, 'PPpp');
};

export const dateTypeFormatter1 = (cell) => {
  if (!cell) return null;

  const date = new Date(cell);
  const newDate = new Date(date);
  const now = new Date();

  if (now.getHours() > 12) {
    newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  }

  return format(newDate, 'P');
};

export const dateTimeTypeFormatter = (cell) => {
  if (!cell) return null;

  const date = new Date(cell);
  const newDate = new Date(date);

  newDate.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  return format(newDate, 'PPpp');
};
