import React, { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem } from 'reactstrap';
import { Link } from 'App/components/link';
import { clients } from 'App/App.route';
import ActiveLink from '../activeLink';

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar className="topbar-custom" color="white" light expand="lg">
        <NavbarBrand href="/">
          <Link href="/" className="logo px-2">
            <span className="logo-lg text-center">
              <img src="/imgs/logo.png" alt="logo" height="48" />
            </span>
            <span className="logo-sm text-center">
              <img src="/imgs/logo.png" alt="logo" height="48" />
            </span>
          </Link>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {clients.map((item, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <NavItem className="ml-4" key={idx}>
                <ActiveLink activeClassName="active" href={item.path}>
                  <a className="nav-link" href>
                    {item.name}
                  </a>
                </ActiveLink>
              </NavItem>
            ))}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default TopBar;
