/* eslint-disable react/jsx-filename-extension */
// @flow
import type { PropsWithChildren } from 'react';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'App/components/link';
import { NS_COMMON } from 'App/share/i18next';
import { type NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { Container } from 'reactstrap';

const Error: NextPage = (props) => {
  return <ErrorPage {...props} />;
};

// Error.getInitialProps = ({ res, err }) => {
//   // eslint-disable-next-line no-nested-ternary
//   const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
//   return { statusCode, err };
// };

export default Error;

export const ErrorPage = ({ statusCode, children }: PropsWithChildren<{ statusCode: number }>) => {
  const { t } = useTranslation(NS_COMMON);

  return (
    <Container
      tag="main"
      fluid
      className="bg-white text-center pb-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center"
    >
      <h1 className="text-error">{statusCode || 404}</h1>
      {children || <h4 className="text-uppercase text-danger">{t('Page not found')}</h4>}
      <br />
      <Link href="/" className="btn btn-primary">
        <FontAwesomeIcon icon={faHome} /> {t('Return home')}
      </Link>
    </Container>
  );
};
