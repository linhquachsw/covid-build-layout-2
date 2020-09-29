import { HField, HForm } from 'App/components/hook-form';
import { HButton } from 'App/components/hook-form/h-button';
import { useState } from 'react';
import useForm from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Card, Modal, ModalBody, ModalHeader, Button } from 'reactstrap';
import { actions as actAuth, getUserInfo } from 'App/redux-flow/auth.slice';
import { actions as cacheAct } from 'App/redux-flow/cache.slice';
import { loginAPI } from 'App/services/auth.service';
import { useRouter } from 'next/router';
import { NS_COMMON } from 'App/share/i18next';

// dispatch(
//   cacheActions.set(['lockApp', [true, 'Your session has expired. Please enter your password to continue.']])
// );

export const LockAppModal = () => {
  const [lock, lockMessage] = useSelector(({ cache }) => cache.lockApp || []);
  const [error, setErr] = useState();
  const { username, rememberMe } = useSelector((s) => s.auth || {});
  const d = useDispatch();
  const { t } = useTranslation(NS_COMMON);
  const router = useRouter();
  const methods = useForm({ mode: 'onChange', reValidateMode: 'onChange' });

  const handleSubmit = ({ password }) => {
    const values = { username, rememberMe, password };

    return loginAPI(values)
      .then((res) => d(actAuth.login(res.data)))
      .then(() => d(getUserInfo))
      .then(() => d(cacheAct.set(['lockApp', [false]])))
      .catch(setErr);
  };

  const handleLoginOther = () => {
    router.push('/account/sign-in').then(() => {
      d(cacheAct.set(['lockApp', [false]]));
    });
  };

  return (
    <Modal isOpen={lock} backdrop="static" centered>
      <HForm methods={methods} onSubmit={handleSubmit}>
        <ModalHeader className="bg-secondary justify-content-center">
          <img src="/imgs/logo.png" alt="logo" height="48" />
        </ModalHeader>

        <ModalBody className="bg-secondary">
          <Card body className="mb-4">
            <p>{t(lockMessage)}</p>

            <HField
              name="password"
              rules={{
                required: true,
                minLength: { value: 8, message: 'invalid' },
                maxLength: { value: 50, message: 'invalid' },
                // pattern: /(?=.*[\d\W])(?=.*[a-z])(?=.*[A-Z])/,
              }}
              inputProps={{
                required: true,
                type: 'password',
                placeholder: t('Enter your password'),
                tabIndex: 0,
              }}
            />

            <div className="d-flex justify-content-center mt-3">
              <HButton color="success">{t('Unlock')}</HButton>
              <Button onClick={handleLoginOther} color="dark" className="ml-2">
                {t('Switch Accounts')}
              </Button>
            </div>

            <Alert color="danger" isOpen={!!error} className="mt-3 mb-0">
              {(error || {}).message}
            </Alert>
          </Card>
        </ModalBody>
      </HForm>
    </Modal>
  );
};
