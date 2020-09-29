// @flow
import type { FunctionComponent, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import cs from 'classnames';
import { NS_COMMON } from 'App/share/i18next';
import { PageLayout } from './pageLayout';

type Props = PropsWithChildren<{
  errorCode?: number,
  message: string,
}>;

export const ErrorLayout: FunctionComponent<Props> = ({ message, errorCode, className, children }: Props) => {
  return (
    <PageLayout
      noImpersonateWarning
      className={cs(
        'bg-white text-center pb-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center',
        className
      )}
    >
      <h1 className="text-error">{errorCode}</h1>
      <h4 className="text-uppercase text-danger">{message}</h4>

      <br />

      {children}
    </PageLayout>
  );
};
ErrorLayout.defaultProps = {
  errorCode: 400,
};

export const BadRequestPage: FunctionComponent<Props> = (props: Props) => {
  const { t } = useTranslation(NS_COMMON);

  return <ErrorLayout {...props} errorCode={400} message={t('Bad Request!')} />;
};
