/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// @flow
import type { FunctionComponent } from 'react';
import { Component, useEffect, Fragment } from 'react';
import classNames from 'classnames';
import { connect, useSelector } from 'react-redux';
import { USER_TYPE, userTypeSelector, isGrantAny } from 'App/redux-flow/auth.slice';
import { Link } from 'App/components/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';
import { Collapse, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { NS_VARIANTS, NS_COMMON } from 'App/share/i18next';
import { I18nUtils } from 'App/utils/i18n/i18n-utils';
import { admins, clients, type MenuItem } from '../../App.route';

type ListItemWithChildrenProps = {
  item: MenuItem,
  subMenuClassNames: string,
  linkClassNames: string,
  onClickMenuItem: () => void,
  expandRoute?: string,
  translation: string,
};
const ListItemWithChildren: FunctionComponent<ListItemWithChildrenProps> = ({
  item,
  linkClassNames,
  subMenuClassNames,
  onClickMenuItem,
  expandRoute,
  translation,
}: ListItemWithChildrenProps) => {
  const { asPath } = useRouter();
  const { t } = useTranslation(translation);
  const permissions: object[] = useSelector((s) => get(s, 'auth.permissions') || []);

  const anyGrantChild = item.children
    .map((p) => permissions.find((q) => q.keyScreen === p.permission))
    .some((p) => isGrantAny(p, 'C.R.U.D'));

  if (!anyGrantChild) return null;

  useEffect(() => {
    if (asPath.includes(item.path)) onClickMenuItem();
  }, []);

  const active = asPath.startsWith(item.path);

  return (
    <li className={classNames('side-nav-item')}>
      <Button
        color="link"
        className={classNames(
          'btn-block d-flex align-items-center',
          'text-left',
          'rounded-0',
          'side-sub-nav-link',
          linkClassNames,
          { active }
        )}
        onClick={onClickMenuItem}
      >
        {item.icon && (
          <FontAwesomeIcon fixedWidth icon={item.icon} className="align-middle font-weight-normal" size="lg" />
        )}

        {item.badge && <span className={`badge badge-${item.badge.variant} float-right`}>{item.badge.text}</span>}

        <span className="text-truncate">{t(`${item.permission || item.name}`)}</span>
      </Button>

      <Collapse isOpen={expandRoute === item.path}>
        <ul className={classNames(subMenuClassNames)}>
          {item.children.map((child) => (
            <ListItem item={child} linkClassName="" key={child.id} translation={translation} />
          ))}
        </ul>
      </Collapse>
    </li>
  );
};
ListItemWithChildren.defaultProps = { expandRoute: null };

type ListItemProps = {
  item: object,
  className?: string,
  linkClassName: string,
  translation: String,
  onClickMenuItem?: () => void,
};
const ListItem: FunctionComponent<ListItemProps> = ({
  item,
  className,
  linkClassName,
  translation,
  onClickMenuItem,
}: ListItemProps) => {
  const { asPath } = useRouter();
  const { t } = useTranslation(translation);
  const permissions: object[] = useSelector((s) => get(s, 'auth.permissions') || []);

  const permission = permissions.find((p) => p.keyScreen === item.permission);
  const permissionDashboard = permissions.find((p) => p.keyScreen === 79001);
  const permissionReport = permissions.find((p) => p.keyScreen === 79007);

  // if (item.permission && !permission) return null;

  if (item.permission === 79000) {
    if (
      permissionDashboard &&
      !isGrantAny(permissionDashboard, 'C.R.U.D') &&
      permission &&
      !isGrantAny(permission, 'C.R.U.D')
    )
      return null;
  } else if (permission && !isGrantAny(permission, 'C.R.U.D')) return null;

  if (item.permission === 79007 && !isGrantAny(permissionReport, 'R')) {
    return null;
  }

  if (item.checkEWaste) {
    const { showEWaste } = useSelector((s) => get(s, 'auth') || { showEWaste: true });
    if (!showEWaste) return null;
  }

  const classes = classNames({ 'side-nav-item': true, 'd-none': item.hidden, active: asPath === item.path }, className);
  const classesLink = classNames('text-truncate', 'side-nav-link-ref', 'side-sub-nav-link', linkClassName);
  // const classesaTag = classNames(
  //   'text-truncate',
  //   'side-nav-link-ref',
  //   'side-sub-nav-link',
  //   'cursor-pointer',
  //   linkClassName
  // );
  // if (item.permission === 79009) {
  //   return (
  //     <li className={classes} onClick={() => RedirectToZohoDesk()}>
  //       {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
  //       <a href="" className={classesaTag}>
  //         {item.icon && (
  //           <FontAwesomeIcon fixedWidth icon={item.icon} className="align-middle font-weight-normal" size="lg" />
  //         )}

  //         {item.badge && <span className={`badge badge-${item.badge.variant} float-right`}>{item.badge.text}</span>}

  //         <span>{I18nUtils.translateServer(t, `${item.permission || item.name}`)}</span>
  //       </a>
  //     </li>
  //   );
  // }

  if (item.permission === 79000) {
    return (
      <li className={classes} onClick={onClickMenuItem}>
        <Link
          href={permission && isGrantAny(permission, 'C.R.U.D') ? item.path : '/client/emplopyee-dashboard'}
          className={classesLink}
          prefetch={false}
        >
          {item.icon && (
            <FontAwesomeIcon fixedWidth icon={item.icon} className="align-middle font-weight-normal" size="lg" />
          )}

          {item.badge && <span className={`badge badge-${item.badge.variant} float-right`}>{item.badge.text}</span>}

          <span>
            {permission && isGrantAny(permission, 'C.R.U.D')
              ? I18nUtils.translateServer(t, `${item.permission || item.name}`)
              : permissionDashboard?.labelScreen}
          </span>
        </Link>
      </li>
    );
  }

  return (
    <li className={classes} onClick={onClickMenuItem}>
      <Link href={item.path} className={classesLink} prefetch={false}>
        {item.icon && (
          <FontAwesomeIcon fixedWidth icon={item.icon} className="align-middle font-weight-normal" size="lg" />
        )}

        {item.badge && <span className={`badge badge-${item.badge.variant} float-right`}>{item.badge.text}</span>}

        <span>{I18nUtils.translateServer(t, `${item.permission || item.name}`)}</span>
      </Link>
    </li>
  );
};
ListItem.defaultProps = { className: null, onClickMenuItem: null };

type Props = {
  userType: null & number,
  setCompactMode: () => void,
  compactMode: boolean,
};
class LeftNav extends Component<Props> {
  state = {
    items: null,
    // announcements: false,
    translation: null,
  };

  static getDerivedStateFromProps({ userType }) {
    const mapping = {
      [USER_TYPE.TENANT]: clients,
      [USER_TYPE.INTERNAL]: admins,
    };

    return {
      items: mapping[userType],
      announcements: userType !== USER_TYPE.INTERNAL,
      translation: userType === USER_TYPE.INTERNAL ? NS_COMMON : NS_VARIANTS,
    };
  }

  render() {
    const { items, key, expandItem, translation } = this.state;
    const { compactMode, setCompactMode } = this.props;

    if (!items) return null;

    return (
      <>
        <ul className="metismenu side-nav" id={key}>
          {items.map((item) => {
            return (
              <Fragment key={item.id}>
                {item.header && (
                  <li className="side-nav-title side-nav-item" key={`${item.id}-el`}>
                    {item.header}
                  </li>
                )}

                {item.children ? (
                  <ListItemWithChildren
                    item={item}
                    subMenuClassNames="side-nav-second-level"
                    linkClassNames="side-nav-link"
                    expandRoute={expandItem}
                    onClickMenuItem={() => this.setState({ expandItem: item.path === expandItem ? null : item.path })}
                    translation={translation}
                  />
                ) : (
                  <ListItem
                    item={item}
                    linkClassName="side-nav-link"
                    translation={translation}
                    onClickMenuItem={() => this.setState({ expandItem: item.path === expandItem ? null : item.path })}
                  />
                )}
              </Fragment>
            );
          })}

          <MinNavigation compactMode={!!compactMode} onClick={setCompactMode} />
        </ul>

        {/* {announcements && !compactMode && <AnnouncementsCard />} */}
      </>
    );
  }
}

export default connect(userTypeSelector)(LeftNav);

type MinNavigationProps = {
  onClick: () => void,
  compactMode: boolean,
};
const MinNavigation: FunctionComponent<MinNavigationProps> = ({ compactMode, onClick }: MinNavigationProps) => {
  const { t } = useTranslation(NS_COMMON);

  return (
    <li className="side-nav-item" onClick={onClick}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" className="side-nav-link-ref side-sub-nav-link side-nav-link side-nav-min">
        <FontAwesomeIcon
          fixedWidth
          icon={compactMode ? faChevronCircleRight : faChevronCircleLeft}
          className="align-middle font-weight-normal"
          size="lg"
        />

        <span>{t('Minimize Navigation')}</span>
      </a>
    </li>
  );
};
