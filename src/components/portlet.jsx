// @flow
import React, { Component, ReactNode, Children } from 'react';
import cs from 'classnames';
import { Card, CardTitle, Collapse, Button } from 'reactstrap';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardLoader } from './loader';

type PortletProps = {
  className?: string,
  children?: object,
  cardTitle?: ReactNode,
  collapseClasses?: string,
  expandClasses?: string,
  allowCollapse?: boolean,
  defaultCollapsed?: boolean,
  loading?: boolean,
  noMarginHeader?: boolean,
  body?: boolean,
};

type PortletState = {
  isOpen: boolean,
  hidden: boolean,
};

class Portlet extends Component<PortletProps, PortletState> {
  constructor(props) {
    super(props);

    this.state = { isOpen: !props.defaultCollapsed, hidden: false };
  }

  toggleContent = (e) => {
    e.stopPropagation();

    // eslint-disable-next-line react/destructuring-assignment
    if (this.props.allowCollapse) this.setState((state) => ({ isOpen: !state.isOpen }));
  };

  remove = () => {
    this.setState({ hidden: true });
  };

  render() {
    const {
      children,
      cardTitle,
      className,
      allowCollapse,
      collapseClasses,
      expandClasses,
      loading,
      noMarginHeader,
      body,
    } = this.props;
    const { isOpen, hidden } = this.state;

    return !hidden ? (
      <Card
        body={body}
        className={cs(className || 'mb-2', 'border-0', {
          [collapseClasses]: !isOpen,
          [expandClasses]: isOpen,
        })}
      >
        <CardTitle
          tag="h2"
          // className="mb-0 d-flex justify-content-between align-items-baseline"
          className="mb-0  justify-content-between align-items-baseline font-weight-bold entry-title"
          onClick={this.toggleContent}
        >
          {cardTitle}

          {allowCollapse && (
            <Button
              color="light"
              outline
              className="border-0 align-self-start text-muted ml-1 p-0"
              onClick={this.toggleContent}
            >
              <FontAwesomeIcon fixedWidth icon={isOpen ? faChevronUp : faChevronDown} />
            </Button>
          )}
        </CardTitle>

        <Collapse isOpen={children && Children.toArray(children).filter((x) => !!x).length > 0 && isOpen}>
          {!noMarginHeader && <div className="mt-2" />}
          {children}
        </Collapse>

        <CardLoader loading={loading} />
      </Card>
    ) : null;
  }
}
Portlet.defaultProps = {
  collapseClasses: '',
  expandClasses: '',
  cardTitle: '',
  className: '',
  children: null,
  allowCollapse: false,
  defaultCollapsed: false,
  loading: false,
  noMarginHeader: false,
  body: true,
};
export default Portlet;
