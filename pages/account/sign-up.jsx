// @flow
import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import type { PageProps } from 'App/components/layout/pageLayout';
import { useTranslation, Trans } from 'react-i18next';
import AccountLayout from 'App/components/account/accountLayout';
import { NS_COMMON } from 'App/share/i18next';
import { HForm, HField, HButton, AllFieldRequiredText } from 'App/components/hook-form';
import { Link } from 'App/components/link';
import useForm from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { checkUserNameIsExistAPI, externalSignupAPI, checkEmailIsExistAPI } from 'App/services/signUp.service';
import { useRouter } from 'next/router';

const MainPage: NextPage<PageProps> = () => {
  const { t } = useTranslation(NS_COMMON);
  const router = useRouter();
  const { query } = router;
  const { facilityId } = query;
  const [disabledButton, setDisabledButton] = useState(false);
  const [characters, setCharacters] = useState(false);
  const [lowUpcase, setLowUpcase] = useState(false);
  const [specialCharacters, setSpecialCharacters] = useState(false);
  const [includeUsername, setIncludeUsername] = useState(false);
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [username, setUsername] = useState(query.email);

  const onSubmit = (values) => {
    const userInfor = {
      companyName: values.companyName,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      username: values.username,
      password: values.password,
      facilityId,
    };
    externalSignupAPI(userInfor).then(() => {
      query.redirect
        ? router.push(`/account/sign-in?redirect=${query.redirect}&username=${values.username}`)
        : router.push('/account/sign-in');
    });
  };
  const Welcome = () => (
    <p className="text-center">
      <Trans i18nKey="welcomeSignUp">
        Welcome to Avellino Coronavirus. Please create an account or <Link href="/account/sign-in">login</Link>.
      </Trans>
    </p>
  );
  const getUsername = (value) => {
    setUsername(value);
  };
  const checkErorrPass = (value) => {
    setPass(value);
    value.length > 7 ? setCharacters(true) : setCharacters(false);
    const regexLowUpcase = '(?=.*[A-Z])(?=.*[a-z])';
    const regexSpecialCharacters = '(?=.*([0-9]|[!@#$%^&*])+)';
    !value.match(regexLowUpcase) ? setLowUpcase(false) : setLowUpcase(true);
    !value.match(regexSpecialCharacters) ? setSpecialCharacters(false) : setSpecialCharacters(true);
    value.includes(username) ? setIncludeUsername(false) : setIncludeUsername(true);
    value !== confirmPass || !lowUpcase || !specialCharacters || !characters || includeUsername
      ? setDisabledButton(true)
      : setDisabledButton(false);
  };
  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: query.email,
      username: query.email !== undefined ? query.email : null,
    },
  });

  useEffect(() => {
    query?.email &&
      checkEmailIsExistAPI(query.email).then((res) => {
        res.data ? router.push('/account/sign-in') : null;
      });
    // query?.email &&
    //   searchOrganizationContactByEmail(query.email).then((res) => {
    //     if (res.data.result) {
    //       populateSearchResult(res.data?.result);
    //       setOrganizationId(res.data?.result.organizationId);
    //     } else {
    //       setHasOrganizationId(false);
    //     }
    //   });
  }, []);
  // const populateSearchResult = (searchResult) => {
  //   setValue('companyName', searchResult?.organizationName ?? '');
  //   setValue('firstName', searchResult?.contactFirstName ?? '');
  //   setValue('lastName', searchResult?.contactLastName ?? '');
  // };

  return (
    <AccountLayout>
      <Welcome />
      <HForm onSubmit={onSubmit} methods={methods}>
        <HField
          name="email"
          label={t('Email')}
          rules={{
            required: true,
            type: 'email',
            maxLength: { value: 100 },
            validate: async (value) => {
              const res = await checkEmailIsExistAPI(value);
              return res.data ? t('Email not available. Please try again') : null;
            },
          }}
          inputProps={{
            required: true,
            readOnly: query.email !== undefined,
            placeholder: t('Enter your email'),
          }}
        />
        <HField
          name="username"
          label={t('Username')}
          rules={{
            required: true,
            maxLength: { value: 50 },
            validate: async (value) => {
              const res = await checkUserNameIsExistAPI(value);
              return res.data ? t('Username not available. Please try again') : null;
            },
          }}
          inputProps={{
            required: true,
            placeholder: t('Enter your username'),
            onChange: (e) => getUsername(e.target.value),
          }}
        />
        <HField
          name="password"
          label={t('Password')}
          rules={{
            maxLength: { value: 50 },
          }}
          inputProps={{
            required: true,
            type: 'Password',
            onChange: (e) => checkErorrPass(e.target.value),
            placeholder: t('Enter your password'),
          }}
        />
        <div className="form-group">
          <div>
            <FontAwesomeIcon icon={faCheckCircle} className={characters ? 'text-primary' : 'text-secondary'} />
            {t('At least 8 characters')}
          </div>
          <div>
            <FontAwesomeIcon icon={faCheckCircle} className={lowUpcase ? 'text-primary' : 'text-secondary'} />
            {t('Contains uppercase and lowercase letters')}
          </div>
          <div>
            <FontAwesomeIcon icon={faCheckCircle} className={specialCharacters ? 'text-primary' : 'text-secondary'} />
            {t('Contains a number or special character')}
          </div>
          <div>
            <FontAwesomeIcon icon={faCheckCircle} className={includeUsername ? 'text-primary' : 'text-secondary'} />
            {t('Does not contains user name')}
          </div>
        </div>
        <HField
          name="confirmpassword"
          label={t('Confirm Password')}
          type="password"
          rules={{
            required: true,
            maxLength: { value: 50 },
            validate: async (value) => {
              return value.trim() !== pass ? t('Passwords do not match') : null;
            },
          }}
          inputProps={{
            required: true,
            type: 'password',
            placeholder: t('Enter confirm password'),
            onChange: (e) => {
              setConfirmPass(e.target.value);
              e.target.value !== pass || !lowUpcase || !specialCharacters || !characters
                ? setDisabledButton(true)
                : setDisabledButton(false);
            },
          }}
        />
        <AllFieldRequiredText className="mr-auto" />
        <div className="d-flex justify-content-center">
          <HButton color="success" tabIndex="0" disabled={disabledButton}>
            {t('Create Account')}
          </HButton>
        </div>
      </HForm>
    </AccountLayout>
  );
};

MainPage.getInitialProps = () => ({
  noLayout: true,
});

export default MainPage;
