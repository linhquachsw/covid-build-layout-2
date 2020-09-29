/* eslint-disable react/destructuring-assignment */
// @flow
import { Button, type ButtonProps, Spinner } from 'reactstrap';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { NS_COMMON } from 'App/share/i18next';

export const HButton = (props: ButtonProps) => {
  const { t } = useTranslation(NS_COMMON);
  const { formState } = useFormContext();
  const { dirty, isSubmitting } = formState;

  const spinnerClasses = classNames('align-middle mr-2', { 'd-none': !isSubmitting });

  return (
    <Button color="success" {...props} disabled={!dirty || isSubmitting || props.disabled}>
      <Spinner size="sm" color="light" className={spinnerClasses} />

      {props.children || t('Save')}
    </Button>
  );
};
