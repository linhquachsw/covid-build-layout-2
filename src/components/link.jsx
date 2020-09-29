/* eslint-disable jsx-a11y/anchor-is-valid */
// @flow
import { type FunctionComponent, type PropsWithChildren, type HTMLAttributes } from 'react';
import NextLink, { type LinkProps } from 'next/link';

type Props = PropsWithChildren<LinkProps & HTMLAttributes<HTMLAnchorElement>>;

const buildUrl = (href: string, props) => {
  let url = href;

  (href.match(/\[(\w+)\]/) || []).forEach((p) => {
    url = url.replace(`[${p}]`, props[p]);
  });

  return url;
};

export const Link: FunctionComponent<Props> = ({
  children,
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  query,
  ...props
}: Props) => {
  const linkProps = { href, as, replace, scroll, shallow, prefetch };
  const url = as || buildUrl(href, query);

  return (
    <NextLink {...linkProps} as={url}>
      <a href={url} {...props}>
        {children}
      </a>
    </NextLink>
  );
};
