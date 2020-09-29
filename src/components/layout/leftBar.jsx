// @flow
import { Component } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link } from 'App/components/link';
import LeftNav from './leftNav';

type Props = {
  setSidebar: () => void,
  compactMode: object,
  setCompactMode: () => void,
};

class LeftBar extends Component<Props> {
  menuNodeRef;

  /**
   * Bind event
   */
  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleOtherClick, false);
  };

  /**
   * Bind event
   */
  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleOtherClick, false);
  };

  /**
   * Handle the click anywhere in doc
   */
  handleOtherClick = (event) => {
    const { setSidebar } = this.props;
    if (this.menuNodeRef.contains(event.target)) return;
    // else hide the menubar
    setSidebar(false);
  };

  render() {
    return (
      <div
        className="left-side-menu"
        ref={(node) => {
          this.menuNodeRef = node;
        }}
      >
        <PerfectScrollbar>
          <Link href="/" className="logo px-2">
            <span className="logo-lg text-center">
              <img src="/imgs/logo.png" alt="logo" height="48" />
            </span>
            <span className="logo-sm text-center">
              <img src="/imgs/logo.png" alt="logo" height="48" />
            </span>
          </Link>

          {/* eslint-disable-next-line react/destructuring-assignment */}
          <LeftNav compactMode={this.props.compactMode} setCompactMode={this.props.setCompactMode} />

          <div className="clearfix" />
        </PerfectScrollbar>
      </div>
    );
  }
}

export default LeftBar;
