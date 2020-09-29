// @flow
import { useEffect, useState, useRef } from 'react';
import type { NextPage } from 'next';
import type { PageProps } from 'App/components/layout/pageLayout';
import { Alert } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AccountLayout from 'App/components/account/accountLayout';
import { Link } from 'App/components/link';
import { NS_COMMON } from 'App/share/i18next';
import { loginAPI } from 'App/services/auth.service';
import { actions as actAuth, getUserInfo, isAuthenticated } from 'App/redux-flow/auth.slice';
import { useRouter } from 'next/router';
import { HForm, HField, Checkbox } from 'App/components/hook-form';
import useForm from 'react-hook-form';
import { HButton } from 'App/components/hook-form/h-button';
import { PageLoader } from 'App/components/loader';

const MainPage: NextPage<PageProps> = () => {
  const [error, setErr] = useState();
  const auth = useSelector((s) => s.auth);
  const router = useRouter();
  const { query } = router;
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      username: query.username !== undefined ? query.username : null,
    },
  });
  const d = useDispatch();
  const { t } = useTranslation(NS_COMMON);

  const inputRef = useRef(null);
  useEffect(() => {
    if (isAuthenticated()) {
      // if ((query?.serviceurl ?? '') !== '') {
      //   const userName = localStorage.getItem('user_name');
      //   generateZohoSignupLinkAPI({ userName }).then((data) => {
      //     location.href = data.data.url + data.data.path;
      //   });
      // } else {
      //   query.redirect ? router.push(query.redirect) : router.push('/index', '/');
      // }

      query.redirect ? router.push(query.redirect) : router.push('/index', '/');
    } else {
      router.prefetch('/index');

      setTimeout(() => {
        const { username, rememberMe } = auth;

        query.username === undefined ? methods.reset({ username, rememberMe }) : null;
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [inputRef]);

  const onSubmit = (values) => {
    return loginAPI(values)
      .then((res) => {
        const { requiredResetPassword, resetPasswordToken, userName } = res.data;
        if (requiredResetPassword) {
          router.push(`/account/resetpw?token=${resetPasswordToken}&user_name=${userName}`);
          throw new Error();
        }

        const { username, rememberMe } = values;

        d(actAuth.login({ username, rememberMe, ...res.data }));

        return res;
      })
      .then(() => d(getUserInfo))
      .then(() => (query.redirect ? router.push(query.redirect) : router.push('/index', '/')))
      .catch(setErr);
  };

  const usernameRule = {
    required: true,
    maxLength: { value: 50 },
  };

  if (isAuthenticated()) {
    return <PageLoader />;
  }

  return (
    <AccountLayout>
      <p className="mb-3 text-center">{t('enterYourUsernameAndPasswordMsg')}</p>

      <HForm onSubmit={onSubmit} methods={methods}>
        <Link href="/account/forgot-password" className="float-right" tabIndex="-1">
          {t('Forgot Username')}
        </Link>

        <HField
          name="username"
          label
          rules={usernameRule}
          inputProps={{
            required: true,
            placeholder: t('Enter your username'),
            tabIndex: 0,
            innerRef: (ref) => {
              if (!query.username) inputRef.current = ref;

              methods.register(usernameRule)(ref);
            },
          }}
        />

        <Link href="/account/forgot-password" className="float-right" tabIndex="-1">
          {t('Forgot Password')}
        </Link>

        <HField
          name="password"
          label
          inputProps={{
            required: true,
            type: 'password',
            placeholder: t('Enter your password'),
            tabIndex: 0,
            innerRef: (ref) => {
              if (query.username) inputRef.current = ref;

              methods.register({ required: true })(ref);
            },
          }}
        />

        <div className="form-group">
          <Checkbox name="rememberMe" label tabIndex={0} />
        </div>

        <Alert color="danger" isOpen={!!error?.message} className="mt-3">
          {error?.message}
        </Alert>

        <div className="d-flex justify-content-center">
          <HButton color="warning" tabIndex="0">
            {t('Log In')}
          </HButton>
        </div>
      </HForm>
    </AccountLayout>
  );
};

MainPage.getInitialProps = () => ({
  noLayout: true,
});

// export const getStaticProps: GetStaticProps = async () => {
//   return {
//     props: {
//       noLayout: true,
//     },
//   };
// };

export default MainPage;
