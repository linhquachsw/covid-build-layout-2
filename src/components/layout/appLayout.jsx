// @flow
import { type FunctionComponent, type PropsWithChildren, useEffect, useState } from 'react';
import { type NextComponentType, type NextPageContext } from 'next';
import { useTranslation } from 'react-i18next';
import { NS_COMMON } from 'App/share/i18next';
import get from 'lodash/get';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { getUserInfo, USER_TYPE, isGrantAny, isAuthenticated } from 'App/redux-flow/auth.slice';
import { Link } from 'App/components/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { fetchCategories } from 'App/redux-flow/category.slice';
import { PageTransition } from 'next-page-transitions';
import { Alert } from 'reactstrap';
import { REFRESH_TOKEN } from 'App/appConst';
import cs from 'classnames';
import { refreshTokenAPI } from 'App/services/base.service';
// import { actions } from 'App/redux-flow/personally.slice';
import TopBar from './topbar';
// import LeftBar from './leftBar';
import { LockAppModal } from './lockApp.modal';
import { ErrorLayout } from './errorLayout';
// import { ImpersonationAlert } from './impersonationAlert';
import { PageLoader } from '../loader';
import Footer from './footer';

const routingPermission = {
  [USER_TYPE.INTERNAL]: '/admin',
  [USER_TYPE.TENANT]: '/client',
};

const TIMEOUT = 600; // must match $TIMEOUT in scss

export const ErrorContent: FunctionComponent = () => {
  const { t } = useTranslation(NS_COMMON);

  return (
    <div className="d-flex justify-content-center mt-3">
      <Link href="/" className="btn btn-primary">
        <FontAwesomeIcon icon={faHome} /> {t('Return home')}
      </Link>

      <Link href="/account/sign-in" className="btn btn-dark ml-2">
        {t('Log In use other account.')}
      </Link>
    </div>
  );
};

export const AccessDeniedError = () => {
  const { t } = useTranslation(NS_COMMON);

  return (
    <ErrorLayout errorCode={403} message={t('Access denied!')} className="">
      <ErrorContent />
    </ErrorLayout>
  );
};

type Props = PropsWithChildren<{
  noLayout?: boolean,
  hasError: boolean,
}>;

export const AppLayout: FunctionComponent<Props> = ({ children, noLayout, hasError, ...restProps }: Props) => {
  const { ready } = useTranslation(NS_COMMON);
  const d = useDispatch();
  const { t } = useTranslation(NS_COMMON);
  const userType = useSelector((s) => get(s, 'auth.userType'));
  const compactMode = useSelector((s) => !!get(s, 'personally.compactMode'));
  const [appReady, setReady] = useState(false);
  const [showSidebar, setSidebar] = useState();
  const router = useRouter();
  // const setCompactMode = () => d(actions.set(['compactMode', !compactMode]));

  if (!ready) return <PageLoader />;

  useEffect(() => {
    setReady(false);

    if (isAuthenticated()) d(getUserInfo).then(() => setReady(true));
    else setReady(true);
  }, [userType]);

  const openLeftMenu = () => {
    setSidebar(!showSidebar);
  };

  if (!appReady) return <PageLoader />;

  if (!userType && /^\/(client|admin)/.test(router.asPath)) {
    router.push('/account/sign-in');

    return <PageLoader />;
  }

  return (
    <div
      className={cs('wrapper', { 'd-flex flex-column': noLayout, 'sidebar-enable': showSidebar })}
      data-leftbar-compact-mode={compactMode ? 'condensed' : null}
      data-leftbar-theme="dark"
    >
      {/* <div className={cs('d-flex flex-column flex-grow-1', { 'with-leftbar': !!userType, 'content-page': !noLayout })}>
        {!noLayout && userType && <TopBar openLeftMenu={openLeftMenu} {...restProps} />}

        <PageTransition
          key="page-transition"
          timeout={TIMEOUT}
          classNames="position-relative d-flex flex-column flex-grow-1 page-transition"
          loadingComponent={<PageLoader />}
          loadingDelay={500}
          loadingTimeout={{
            enter: TIMEOUT,
            exit: 0,
          }}
          loadingClassNames="loading-indicator"
        >
          {hasError ? (
            <ErrorLayout errorCode={500} message={t('Something went wrong!')}>
              <ErrorContent />
            </ErrorLayout>
          ) : (
            children
          )}
        </PageTransition>
      </div> */}
      <div className={cs('d-flex flex-column flex-grow-1', { 'content-page': !noLayout })}>
        {!noLayout && userType && <TopBar openLeftMenu={openLeftMenu} {...restProps} />}

        <PageTransition
          key="page-transition"
          timeout={TIMEOUT}
          classNames="position-relative d-flex flex-column flex-grow-1 page-transition"
          loadingComponent={<PageLoader />}
          loadingDelay={500}
          loadingTimeout={{
            enter: TIMEOUT,
            exit: 0,
          }}
          loadingClassNames="loading-indicator"
        >
          {hasError ? (
            <ErrorLayout errorCode={500} message={t('Something went wrong!')}>
              <ErrorContent />
            </ErrorLayout>
          ) : (
            children
          )}
        </PageTransition>
      </div>
      <Footer />

      <LockAppModal />
    </div>
  );
};
AppLayout.defaultProps = {
  noLayout: false,
};

type AppSecureProps = {
  tag: NextComponentType<NextPageContext, {}, {}>,
};

export const AppSecure: FunctionComponent<AppSecureProps> = ({ tag: Tag }: AppSecureProps) => {
  const [{ grant, categories, permission, ...props }] = useState(Tag.getInitialProps ? Tag.getInitialProps() : {});
  const [pageReady, setReady] = useState(false);
  const { permissions, userType, loading } = useSelector((s) => s.auth);
  const permissionData = (permissions || []).find((p) => p.keyScreen === permission);
  const { t } = useTranslation(NS_COMMON);
  const d = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!userType && permission && router.pathname !== '/account/sign-in') {
      setReady(false);

      router.push('/account/sign-in');
    }
  }, [userType, permission]);

  useEffect(() => {
    setReady(false);

    if (isAuthenticated()) {
      d(fetchCategories(categories)).finally(() => setReady(true));
    } else if (localStorage[REFRESH_TOKEN]) {
      refreshTokenAPI()
        .then(() => d(getUserInfo))
        .then(() => d(fetchCategories(categories)))
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [categories]);

  if (!pageReady || loading) return <PageLoader />;

  if (userType === USER_TYPE.TENANT && permissions?.length === 0) {
    return (
      <Alert color="warning" className="m-3">
        {t("You don't have any permissions.")}
      </Alert>
    );
  }

  // eslint-disable-next-line no-console
  console.log('Page--', router.pathname, router.asPath);

  if ((router.pathname === '/_error' || router.pathname === '/') && !permission) return <Tag {...props} />;

  if (!/^\/(client|admin)/.test(router.asPath) && !permission) return <Tag {...props} />;

  // if (!currentFacility && userType === USER_TYPE.TENANT) {
  //   return (
  //     <>
  //       {/* <ImpersonationAlert /> */}

  //       <Alert color="danger" className="d-flex justify-content-between m-3">
  //         {t('selectFacilityMsg')}
  //       </Alert>
  //     </>
  //   );
  // }

  if (userType === USER_TYPE.INTERNAL && router.asPath.startsWith(routingPermission[USER_TYPE.INTERNAL])) {
    return <Tag {...props} />;
  }

  if (
    userType === USER_TYPE.TENANT &&
    router.asPath.startsWith(routingPermission[USER_TYPE.TENANT]) &&
    (!permission || permissionData)
  ) {
    if (!permission || (permissionData && isGrantAny(permissionData, grant)))
      return <Tag {...props} permission={permissionData || {}} />;

    return <AccessDeniedError />;
  }

  if (
    userType === USER_TYPE.TENANT &&
    router.asPath.startsWith(routingPermission[USER_TYPE.TENANT]) &&
    permission &&
    !permissionData
  ) {
    return <AccessDeniedError />;
  }

  if (
    Object.keys(routingPermission).includes(userType.toString()) &&
    Object.keys(routingPermission)
      .filter((x) => x !== userType.toString())
      .some((x) => router.asPath.startsWith(routingPermission[x]))
  ) {
    return <AccessDeniedError />;
  }

  return null;
};
