// @flow
import { type FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { NS_COMMON } from 'App/share/i18next';

type Props = {
  valid: boolean,
  rule: string,
};

export const ValidateRule: FunctionComponent<Props> = ({ valid, rule }: Props) => {
  const { t } = useTranslation(NS_COMMON);

  return (
    <div className="d-flex align-items-center text-secondary mb-1">
      <FontAwesomeIcon
        className={classNames('mr-2', {
          'text-success': valid,
          'text-secondary': !valid,
        })}
        icon={faCheckCircle}
        size="lg"
      />
      {t(rule)}
    </div>
  );
};
