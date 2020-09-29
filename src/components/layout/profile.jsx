// @flow
import React, { type FunctionComponent, useState } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faSignOutAlt, faReply } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { actions as authAct, USER_TYPE } from 'App/redux-flow/auth.slice';
import { actions as cacheAct } from 'App/redux-flow/cache.slice';
import { actions as perAct } from 'App/redux-flow/personally.slice';
import { actions as catAct } from 'App/redux-flow/category.slice';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { PHOTO_LINK } from 'App/appConst';
import classNames from 'classnames';
import { NS_COMMON } from 'App/share/i18next';
import * as Url from 'url';

type Props = { className?: string };

const supportLangs = {
  en: 'English',
  es: 'español',
};

export const Profile: FunctionComponent<Props> = (props) => {
  const [showListLanguage, setShowListLanguage] = useState(false);
  const { t, i18n } = useTranslation(NS_COMMON);
  const { photoLink, displayName, facilities = [], currentFacility, userType, impersonateUser } = useSelector(
    (s) => s.auth
  );
  const router = useRouter();
  const d = useDispatch();

  const handleChangeLang = (lang: string) => () => {
    i18n.changeLanguage(lang);
    setShowListLanguage(false);
  };

  return (
    <UncontrolledDropdown nav inNavbar {...props}>
      <DropdownToggle nav className="nav-user px-2 d-flex align-items-center">
        <img
          src={photoLink || PHOTO_LINK}
          className="rounded-circle ml-auto"
          alt="user"
          style={{ height: '2rem', width: '2rem' }}
        />

        <div
          className={classNames('ml-2 d-md-flex flex-column text-left text-secondary', {
            'd-none': userType === USER_TYPE.TENANT,
          })}
        >
          <h6 className="my-0">{displayName}</h6>

          {userType === USER_TYPE.TENANT && currentFacility && <small>{currentFacility.name}</small>}
        </div>
        <FontAwesomeIcon icon={faChevronDown} className="ml-2 mr-auto" />
      </DropdownToggle>

      <DropdownMenu right tabIndex={null} style={{ zIndex: 1100 }} className="position-absolute">
        {impersonateUser && (
          <>
            <DropdownItem disabled>
              {t('Impersonation by')}
              <div className="d-flex align-items-center mt-2">
                <img
                  src={impersonateUser.photoLink || PHOTO_LINK}
                  className="rounded-circle mr-2"
                  alt="user"
                  style={{ height: '2rem', width: '2rem' }}
                />

                <div>
                  {impersonateUser.displayName}

                  <div className="small">{impersonateUser.title}</div>
                </div>
              </div>
            </DropdownItem>

            <DropdownItem
              onClick={() => {
                d(catAct.clear());
                d(cacheAct.clear());

                d(authAct.backImpersonateUser());

                router.push('/index', '/');
              }}
            >
              <FontAwesomeIcon icon={faReply} className="text-danger mr-2" />
              {t('Exit Impersonation')}
            </DropdownItem>

            <DropdownItem divider />
          </>
        )}

        {userType === USER_TYPE.TENANT && facilities.length > 1 && (
          <>
            <DropdownItem disabled>{t('Facilities')}</DropdownItem>

            {facilities.map((f) => (
              <DropdownItem
                key={f.id}
                active={currentFacility?.id === f.id}
                onClick={() => {
                  if (currentFacility?.id !== f.id) {
                    d(authAct.selectFacility(f));
                    d(catAct.clear());
                    d(cacheAct.clear());

                    const newUrl = Url.parse(router.asPath);
                    newUrl.pathname = router.pathname;
                    router.push(newUrl, router.asPath);
                  }
                }}
              >
                {f.name}
              </DropdownItem>
            ))}

            <DropdownItem divider />
          </>
        )}

        <DropdownItem
          toggle={false}
          className="d-flex align-items-center"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            setShowListLanguage(!showListLanguage);
          }}
        >
          {supportLangs[i18n.language.substr(0, 2)]}

          <FontAwesomeIcon icon={faChevronDown} fixedWidth className="ml-auto" size="xs" />
        </DropdownItem>

        <Collapse isOpen={showListLanguage}>
          {Object.entries(supportLangs)
            .filter(([lang]) => !i18n.language.startsWith(lang))
            .map(([lang, name]) => (
              <DropdownItem key={lang} toggle={false} onClick={handleChangeLang(lang)}>
                {name}
              </DropdownItem>
            ))}
        </Collapse>

        <DropdownItem divider />

        {userType === USER_TYPE.INTERNAL && (
          <>
            <DropdownItem disabled>Ver: {process.env.VERSION}</DropdownItem>

            <DropdownItem divider />
          </>
        )}

        <DropdownItem
          onClick={() => {
            d(catAct.clear());
            d(cacheAct.clear());
            d(perAct.clear());
            d(authAct.logout());

            router.push('/account/sign-in');
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-danger" />

          {t('Logout')}
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};
Profile.defaultProps = {
  className: '',
};
