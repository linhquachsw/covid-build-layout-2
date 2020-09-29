// @flow
import type { FunctionComponent } from 'react';
import { useFormContext } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import cs from 'classnames';
import { HField, type Props as FieldProps } from './h-inputs';

export const HPhoneField: FunctionComponent<FieldProps> = ({ inputProps, rules, ...props }: FieldProps) => {
  const { register, setValue, watch, errors, setError, clearError, triggerValidation } = useFormContext();

  const { name } = props;
  const value = watch(name) || '';

  return (
    <HField
      {...props}
      inputProps={{
        containerClass: cs({ 'is-invalid': !!errors[name], 'react-tel-input': true }),
        inputProps,
        country: 'us',
        value,
        onBlur: ({ currentTarget: { value: inputVal } }, country) => {
          const val = inputVal.slice(1);

          if (val === country.dialCode) setValue(name, null, true);
          else setValue(name, val, true);

          if (val.startsWith(country.dialCode) || (country?.dialCode || '').startsWith(val)) {
            clearError(name);
            triggerValidation(name);
          } else setError(name, 'invalid');
        },
        ref: register({ name }, rules),
      }}
      tag={PhoneInput}
    />
  );
};
