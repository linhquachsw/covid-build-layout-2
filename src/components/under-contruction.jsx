// @flow
import { type FunctionComponent } from 'react';
import { Row, Col, Alert } from 'reactstrap';

type Props = {
  title: string,
};

export const UnderConstruction: FunctionComponent<Props> = ({ title }: Props) => (
  <Row>
    <Col lg={8} xl={4} className="mx-auto text-center py-5 mt-5">
      <img src="/icons/construct.svg" alt="Under construction" className="w-50 mx-auto" />

      <Alert color="warning">
        <a
          className="text-warning h3"
          href={`https://reliantehs.atlassian.net/browse/${title}`}
          title="Click to open Jira Task"
          target="_blank"
          rel="noopener noreferrer"
        >
          {title}
        </a>

        <div className="mt-3">Under construction</div>
      </Alert>
    </Col>
  </Row>
);
