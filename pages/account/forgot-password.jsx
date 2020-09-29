// @flow
import { useState } from 'react';
import type { NextPage } from 'next';
import type { PageProps } from 'App/components/layout/pageLayout';
import { useTranslation } from 'react-i18next';
import { Alert } from 'reactstrap';
import { sendEmailResetPasswordAPI } from 'App/services/auth.service';
import AccountLayout from 'App/components/account/accountLayout';
import useForm from 'react-hook-form';
import { HForm, HField } from 'App/components/hook-form';
import * as yup from 'yup';
import { NS_COMMON } from 'App/share/i18next';
import { HButton } from 'App/components/hook-form/h-button';

const MainPage: NextPage<PageProps> = () => {
  const { t } = useTranslation(NS_COMMON);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    validationSchema: yup.object({
      email: yup.string().email('invalid').required('required'),
    }),
  });

  const onSubmit = (values) => {
    setSuccess(false);
    setErrors([]);

    return sendEmailResetPasswordAPI(values)
      .then(() => setSuccess(true))
      .catch((err) => setErrors([err]));
  };

  return (
    <AccountLayout>
      <p className="mb-3 text-center">{t('forgotPasswordWarning')}</p>

      <HForm onSubmit={onSubmit} methods={methods}>
        <HField
          name="email"
          label={t('Email Address')}
          inputProps={{
            required: true,
            type: 'email',
            placeholder: t('Enter your email'),
          }}
        />

        <div className="d-flex justify-content-center">
          <HButton color="success">{t('Reset Password')}</HButton>
        </div>
      </HForm>

      <Alert color="success" isOpen={success} className="mt-3">
        {t('Email sent!')}
      </Alert>

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
