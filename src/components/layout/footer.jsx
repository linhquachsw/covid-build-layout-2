import React from 'react';

import { Row, Col } from 'reactstrap';
import { Link } from '../link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer className="footer">
        <div className="container-fluid">
          <Row>
            <Col md={12}>
              <div className="footer-links d-none d-md-block">
                <Link href="/term">Terms and Conditions</Link>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/data">Genetic Data Usage and Privacy</Link>
                <Link href="/accreditations">Accreditations & Certifications</Link>
                <Link href="/accessibility">Accessibility</Link>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>©{currentYear} Avellino Labs. All Rights Reserved.</Col>
          </Row>
        </div>
      </footer>
    </>
  );
};

export default Footer;
