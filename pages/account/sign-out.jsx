import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { actions as actAuth } from 'App/redux-flow/auth.slice';
import { actions as actCache } from 'App/redux-flow/cache.slice';
import { actions as actPer } from 'App/redux-flow/personally.slice';
import { actions as actCat } from 'App/redux-flow/category.slice';
import { useEffect } from 'react';

export default () => {
  const d = useDispatch();
  const router = useRouter();

  useEffect(() => {
    router.push('/account/sign-in');

    d(actCat.clear());
    d(actCache.clear());
    d(actPer.clear());
    d(actAuth.logout());
  }, []);

  return null;
};
