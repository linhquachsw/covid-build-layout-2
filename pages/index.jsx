// @flow
import { type NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as url from 'url';
import { PageLoader } from 'App/components/loader';
import { useSelector } from 'react-redux';
import { USER_TYPE, isAuthenticated } from 'App/redux-flow/auth.slice';

const pathnameWithParams = [
  ['/clients/[clientId]', /\/clients\/(\d+|new)/],
  ['/admin/configure-forms/edit/[id]', /\/admin\/configure-forms\/edit\/(\d+)/],
  ['/shared/[sharedId]', /\/shared\/(.+)/],
  ['/client/reports/master-records-list', /\/client\/reports\/master-records-list/],
];

const getPathname = (asPath: string) => {
  let pathname = null;
  pathnameWithParams.forEach(([path, reg]) => {
    if (asPath.match(reg)) pathname = url.parse(asPath).pathname.replace(reg, path);
  });

  if (pathname) return pathname;

  if (asPath.match(/^\/(client|admin|account)\/.*$/g)) {
    return url.parse(asPath).pathname;
  }

  return null;
};

const Page: NextPage = () => {
  const router = useRouter();
  const { userType, permissions } = useSelector((s) => s.auth);
  const faPermission = (permissions || []).find((p) => p.keyScreen === 79000);
  const empPermission = (permissions || []).find((p) => p.keyScreen === 79001);
  const { asPath } = router;

  useEffect(() => {
    if (asPath === '/') {
      if (isAuthenticated()) {
        switch (userType) {
          case USER_TYPE.TENANT: {
            // if (!faPermission?.read && empPermission?.read) router.push('/client/emplopyee-dashboard');
            // else if (faPermission?.read) router.push('/client/dashboard');
            // break;
            // router.push('/client/dashboard');
            router.push('/home');
            break;
          }

          case USER_TYPE.INTERNAL:
            router.push('/admin/clients');
            break;

          case USER_TYPE.VENDOR:
            router.push('/nonclient/audit-list');
            break;

          default:
            break;
        }
      } else {
        router.push('/account/sign-in');
      }
    } else if (localStorage.lastFailPath !== asPath) {
      const pathname = getPathname(asPath);
      const newUrl = url.parse(asPath);
      newUrl.pathname = pathname;

      console.log('REDIRECT--', newUrl);
      if (pathname) {
        router.replace(newUrl, router.asPath, { shallow: true }).then((success) => {
          if (!success) {
            localStorage.lastFailPath = router.asPath;
          }
        });
      }
    } else {
      router.replace('/_error', router.asPath, { shallow: true });
    }
  }, []);

  if (asPath === '/' && userType === USER_TYPE.TENANT && !faPermission?.read && !empPermission?.read) {
    return null;
  }

  return <PageLoader />;
};

export default Page;
