import { enableTypeFormatter } from './index';

export const statusField = () => ({
  dataField: 'status',
  text: true,
  sort: true,
  formatter: enableTypeFormatter,
  filterValue: enableTypeFormatter,
});

export const dateModifiedField = () => ({
  dataField: 'dateModified',
  text: true,
  hidden: true,
});
