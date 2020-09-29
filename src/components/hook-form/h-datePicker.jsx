// @flow
import { forwardRef } from 'react';
import type { FunctionComponent, PropsWithChildren } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { type DayPickerInputProps, DateUtils } from 'react-day-picker';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input, DropdownMenu } from 'reactstrap';
import dateFnsParse from 'date-fns/parse';
import dateFnsFormat from 'date-fns/format';
import { DATE_FORMAT, formatDate, MAP_LOCALES } from 'App/utils/date-helper';
import { NS_COMMON } from 'App/share/i18next';

const localeUtils = {
  formatDay(d: Date, locale: string) {
    return dateFnsFormat(d, 'P', { locale: MAP_LOCALES[locale] });
  },
  formatMonthTitle(d: Date, locale: string) {
    return `${MAP_LOCALES[locale].localize.month(d.getMonth())} ${d.getFullYear()}`;
  },
  formatWeekdayShort(i: number, locale: string) {
    return MAP_LOCALES[locale].localize.day(i, { width: 'short' });
  },
  formatWeekdayLong(i: number, locale: string) {
    return MAP_LOCALES[locale].localize.day(i);
  },
  getFirstDayOfWeek(locale: string) {
    return MAP_LOCALES[locale].options.weekStartsOn;
  },
};

const Component = forwardRef((compProps, ref) => <Input {...compProps} innerRef={ref} />);

export const DPOverlayComponent: FunctionComponent<PropsWithChildren> = ({
  children,
  selectedDay,
  month,
  input,
  classNames,
  ...props
}: PropsWithChildren) => (
  <div className={classNames.overlayWrapper}>
    <DropdownMenu right className="show" {...props}>
      {children}
    </DropdownMenu>
  </div>
);

export const HDatePicker: FunctionComponent<DayPickerInputProps> = ({
  name,
  required,
  inputProps,
  onDayChange,
  overlayComponent,
  ...props
}: DayPickerInputProps) => {
  const { setValue, watch, setError, errors, clearError } = useFormContext();
  const { t } = useTranslation(NS_COMMON);

  const parseDate = (str: string, format: string, locale: string) => {
    if (str && str.length !== format.length) {
      setError(name, 'invalid');

      return undefined;
    }

    if (errors[name]?.type === 'invalid') clearError(name);

    const parsed = dateFnsParse(str, format, new Date(), { locale });

    if (DateUtils.isDate(parsed)) {
      return parsed;
    }

    return parsed;
  };

  const handleDayChange = (selectedDay, modifiers, dayPickerInput) => {
    setValue(name, selectedDay, true);

    if (onDayChange) onDayChange(selectedDay, modifiers, dayPickerInput);
  };

  const value = watch(name);

  return (
    <DayPickerInput
      component={Component}
      overlayComponent={overlayComponent}
      value={value}
      formatDate={formatDate}
      parseDate={parseDate}
      format={DATE_FORMAT}
      placeholder={t('month/day/year')}
      inputProps={{ required, ...inputProps }}
      dayPickerProps={{
        todayButton: t('Go to Today'),
        showOutsideDays: true,
        localeUtils,
        ...props,
      }}
      onDayChange={handleDayChange}
    />
  );
};
