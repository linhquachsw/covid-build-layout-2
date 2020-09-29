/* eslint-disable react/destructuring-assignment */
// @flow
import { Button, type ButtonProps, Spinner } from 'reactstrap';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { FunctionComponent } from 'react';
import { NS_COMMON } from 'App/share/i18next';

type Props = {
  hideChildrenOnLoading?: boolean,
} & ButtonProps;

export const SpinButton: FunctionComponent<Props> = ({ hideChildrenOnLoading, ...props }: Props) => {
  const { t } = useTranslation(NS_COMMON);
  const [loading, setLoading] = useState(false);

  const spinnerClasses = classNames('align-middle', { 'mr-2': !hideChildrenOnLoading, 'd-none': !loading });

  const handleClick = () => {
    setLoading(true);

    props.onClick().finally(() => setLoading(false));
  };

  return (
    <Button color="success" {...props} disabled={loading || props.disabled} onClick={handleClick}>
      <Spinner size="sm" color="light" className={spinnerClasses} />

      {!(hideChildrenOnLoading && loading) && <>{props.children || t('Save')}</>}
    </Button>
  );
};
SpinButton.defaultProps = {
  hideChildrenOnLoading: false,
};
