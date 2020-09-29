// @flow
import React, { useState } from 'react';
import { type NextPage } from 'next';
import { useTranslation } from 'react-i18next';
import { Alert } from 'reactstrap';
import { resetPasswordAPI } from 'App/services/auth.service';
import AccountLayout from 'App/components/account/accountLayout';
import { ValidateRule } from 'App/components/account/validateRule';
import { useRouter } from 'next/router';
import { HForm, HField } from 'App/components/hook-form';
import useForm from 'react-hook-form';
import { HButton } from 'App/components/hook-form/h-button';
import { useDispatch } from 'react-redux';
import { actions as actAuth } from 'App/redux-flow/auth.slice';
import { NS_COMMON } from 'App/share/i18next';

const MainPage: NextPage = () => {
  const { t } = useTranslation(NS_COMMON);
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const methods = useForm({ mode: 'onChange', reValidateMode: 'onChange' });
  const d = useDispatch();
  const userName = router.query.user_name ?? '';

  const password = methods.watch('password');

  const onSubmit = (values) => {
    setErrors([]);

    return resetPasswordAPI({ token: router.query.token, ...values })
      .then(({ data }) => d(actAuth.setUsername(data)))
      .then(() => router.push('/account/sign-in'))
      .catch((err) => setErrors([err]));
  };

  return (
    <AccountLayout>
      <p className="mb-3 text-center">{t('Please enter a password for your account.')}</p>

      <HForm onSubmit={onSubmit} methods={methods}>
        <HField
          name="password"
          label="Password"
          className="mb-1"
          rules={{
            required: true,
            minLength: { value: 8, message: null },
            maxLength: 50,
            pattern: /(?=.*[\d\W])(?=.*[a-z])(?=.*[A-Z])/,
            validate: (val) => {
              return val?.toLowerCase()?.includes(userName?.toLowerCase() ?? '') ?? false
                ? 'Your password does not meet the following requirements.'
                : null;
            },
          }}
          inputProps={{
            required: true,
            type: 'password',
            placeholder: t('Enter your password'),
          }}
        />

        <ValidateRule valid={/^.{8,}$/.test(password || '')} rule="At least 8 characters" />
        <ValidateRule valid={/(?=.*[a-z])(?=.*[A-Z])/.test(password)} rule="Contains uppercase and lowercase letters" />
        <ValidateRule
          valid={/(?=.*\d)/.test(password) || /(?=.*\W)/.test(password)}
          rule="Contains a number or special character"
        />
        <ValidateRule
          valid={!(password?.toLowerCase()?.includes(userName.toLowerCase() ?? '') ?? false)}
          rule="Does not contain user name"
        />

        <HField
          className="mt-3"
          name="confirmationPassword"
          label="Confirm Password"
          type="password"
          rules={{
            required: true,
            validate: (val) => val === password || 'Passwords do not match',
          }}
          inputProps={{
            required: true,
            type: 'password',
            placeholder: t('Enter your password'),
          }}
        />

        <div className="d-flex justify-content-center">
          <HButton color="success">{t('Reset Password')}</HButton>
        </div>
      </HForm>

      <Alert color="danger" isOpen={errors.length > 0} tag="ul" className="mt-3 mb-0 list-unstyled">
        {errors.map((err) => (
          <li>{err.message}</li>
        ))}
      </Alert>
    </AccountLayout>
  );
};

MainPage.getInitialProps = () => ({
  noLayout: true,
});

export default MainPage;
