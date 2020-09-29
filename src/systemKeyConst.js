// export system Key const

import { faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';

// result
export const ResultType = {
  Positive: 1,
  Presumptive: 2,
  Negative: 3,
  Invalid: 4,
};

export const ResultTypeIcon = {
  [ResultType.Positive]: faExclamationTriangle,
  [ResultType.Presumptive]: faExclamationTriangle,
  [ResultType.Negative]: faCheck,
  [ResultType.Invalid]: faExclamationTriangle,
};

export const ResultColor = (cell) => {
  switch (cell) {
    case 1:
      return 'text-danger';
    case 2:
      return 'text-warning';
    case 3:
      return 'text-success';
    default:
      return 'text-purple';
  }
};
