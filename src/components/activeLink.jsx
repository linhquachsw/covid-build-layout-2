// @flow
import { useRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames';
import { Children, cloneElement } from 'react';
import type { FunctionComponent, ReactChild } from 'react';

type Props = {
  children: ReactChild,
  activeClassName?: string,
  href: string,
};

const ActiveLink: FunctionComponent<Props> = ({ children, activeClassName, ...props }: Props) => {
  const { pathname } = useRouter();
  const child = Children.only(children);
  const childClassName = child.props.className || '';

  // eslint-disable-next-line react/destructuring-assignment
  const className = pathname === props.href ? classNames(childClassName, activeClassName) : childClassName;

  return (
    <Link {...props}>
      {cloneElement(child, {
        className: className || null,
      })}
    </Link>
  );
};
ActiveLink.defaultProps = {
  activeClassName: 'active',
};

export default ActiveLink;
