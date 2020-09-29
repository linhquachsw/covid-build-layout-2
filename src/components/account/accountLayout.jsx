// @flow
import React, { useState, type PropsWithChildren, type FunctionComponent } from 'react';
import Link from 'next/link';
import { Container, Row, Col, Card } from 'reactstrap';
import { connect } from 'react-redux';

type Props = PropsWithChildren<{
  auth: object,
}>;

const AccountLayout: FunctionComponent<Props> = ({ children }: Props) => {
  const [currentYear] = useState(new Date().getFullYear());

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card body className="bg-secondary">
            <div className="pt-4 pb-4 text-center">
              <Link href="/">
                <img src="/imgs/logo.png" alt="logo" height="48" />
              </Link>
            </div>

            <Card body className="mb-4">
              {children}
            </Card>
          </Card>
        </Col>
      </Row>

      <p className="text-center mt-2">©{currentYear} Avellino Coronavirus</p>
    </Container>
  );
};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(mapStateToProps)(AccountLayout);
