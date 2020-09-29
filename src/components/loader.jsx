// @flow
import type { FunctionComponent } from 'react';
import { Container } from 'reactstrap';
import styled from 'styled-components';

export const CardLoader: FunctionComponent = ({ loading }: { loading?: boolean }) =>
  !loading ? null : (
    <div className="card-disabled">
      <div className="card-portlets-loader">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
CardLoader.defaultProps = {
  loading: false,
};

const LogoFlicker = styled.img`
  @keyframes flickerAnimation {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @-o-keyframes flickerAnimation {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @-moz-keyframes flickerAnimation {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @-webkit-keyframes flickerAnimation {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  animation: flickerAnimation 1.5s infinite;
`;

export const PageLoader = () => {
  return (
    <Container fluid className="pt-5 position-absolute h-100 bg-white text-center">
      <LogoFlicker src="/imgs/logo.png" alt="logo" height="48" />
    </Container>
  );
};
