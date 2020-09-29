// @flow
import { type FunctionComponent, type ReactNode } from 'react';
import classNames from 'classnames';

type Props = {
  tag?: string | ReactNode,
  className?: string,
  align?: 'start' & 'end' & 'center' & 'baseline' & 'stretch',
  justify?: 'start' & 'end' & 'center' & 'between' & 'around',
};
export const Flexbox: FunctionComponent<Props> = ({ tag: Tag, align, justify, className, ...props }: Props) => {
  const classes = classNames('d-flex', className, {
    [`align-items-${align}`]: align,
    [`justify-content-${justify}`]: justify,
  });

  return <Tag className={classes} {...props} />;
};
Flexbox.defaultProps = {
  tag: 'div',
  className: null,
  align: 'center',
  justify: 'start',
};
