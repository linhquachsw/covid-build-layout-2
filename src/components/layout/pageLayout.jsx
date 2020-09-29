/* eslint-disable react/destructuring-assignment */
// @flow
import {
  type FunctionComponent,
  type PropsWithChildren,
  type HTMLAttributes,
  useEffect,
  createContext,
  useContext,
} from 'react';
import { Container, type ContainerProps } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { NS_COMMON, NS_VARIANTS } from 'App/share/i18next';
import { actions } from 'App/redux-flow/personally.slice';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import cs from 'classnames';
import * as _ from 'lodash';
// import { ImpersonationAlert } from './impersonationAlert';
import { Link } from '../link';

type Props = PropsWithChildren<
  {
    title: string,
    titleValue?: object,
    loading: boolean,
    ctx?: object,
    noImpersonateWarning?: boolean,
  } & ContainerProps
>;

export const PageCtx = createContext({});

export const usePageContext = () => useContext(PageCtx);

export const PageLayout: FunctionComponent<Props> = ({
  title,
  titleValue,
  loading,
  children,
  ctx,
  noImpersonateWarning,
  className,
  ...props
}: Props) => {
  const { t } = useTranslation(NS_COMMON);
  const pageRedirect = useSelector((s) => s.personally.pageRedirect);
  const { appSettings } = useSelector((s) => s.auth);
  const d = useDispatch();
  const { query, pathname, asPath } = useRouter();

  useEffect(() => {
    if (pageRedirect) d(actions.set(['pageRedirect', false]));
  }, [pageRedirect]);

  return (
    <PageCtx.Provider value={ctx}>
      {/* {!query.isPrint && !noImpersonateWarning && <ImpersonationAlert />} */}

      <Container
        tag="main"
        fluid
        className={cs(className || 'mb-1', 'pt-3', { 'bg-white': query.isPrint }, { 'print-previewer': query.isPrint })}
        {...props}
      >
        {/* {query.isPrint && (
          <div className="mb-4">
            <img src="/imgs/reliantehs_color.png" alt="logo" height="48" />
          </div>
        )} */}

        {title && (
          <h2>
            <Link href={pathname} as={asPath} className="text-secondary">
              {_.isNumber(title) ? t(`${NS_VARIANTS}:${title}`) : t(title, titleValue)}
            </Link>
          </h2>
        )}

        {children}

        {loading && (
          <div className="card-disabled pb-5 d-flex align-items-center justify-content-center">
            <div className="card-portlets-loader" />
          </div>
        )}

        {query.isPrint && (
          <div className="page-footer border-top py-1 mt-3 text-center">
            {(appSettings || []).slice(0, 1).map((x) => x.footer)}
          </div>
        )}
      </Container>
    </PageCtx.Provider>
  );
};
PageLayout.defaultProps = {
  ctx: {},
  titleValue: {},
  noImpersonateWarning: false,
};

type PageHeaderProps = PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>;

export const PageHeader: FunctionComponent<PageHeaderProps> = (props: PageHeaderProps) => (
  <h2 className="d-flex align-items-center justify-content-between" {...props}>
    {props.children}
  </h2>
);

export type PageProps = {
  permission: {
    create: boolean,
    update: boolean,
    delete: boolean,
    read: boolean,
    id: number,
    keyRecordStatus: number,
    keySection: number,
    keyScreen: number,
    labelScreen: string,
  },
};
