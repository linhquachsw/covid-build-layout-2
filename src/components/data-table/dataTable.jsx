/* eslint-disable react/destructuring-assignment */
// @flow
import { Component, useEffect, useState, useCallback, useMemo } from 'react';
import type { ReactNode, FunctionComponent } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
} from 'react-bootstrap-table2-paginator';
import {
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { actions as cacheAct } from 'App/redux-flow/cache.slice';
import { actions as personAct } from 'App/redux-flow/personally.slice';
import { NS_COMMON } from 'App/share/i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import cs from 'classnames';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/router';
import { CardLoader } from '../loader';
import { sortByNameWithNumber } from './sortByNameWithNumber';
import { sortDateString } from './sortDateString';
import { sortInsensitive } from './sortInsensitive';

export type Column = {
  dataField: string,
  text: boolean | string,
  sort?: boolean,
  align?: 'left' | 'center' | 'right',
  classes?: string,
  sortFunc?: (a, b, order: 'asc' | 'desc') => number,
  formatter: (cell: string | number, row: object, rowIndex: number, extraData) => ReactNode,
  filterValue: (cell: object, row: object) => string,
};

type SearchProps = {
  className: string,
  parentPage: string,
};

const MySearch: FunctionComponent<SearchProps> = ({ className, parentPage }: SearchProps) => {
  const gridData = useSelector((s) => s.cache[`${parentPage}.grid`] || {});
  const { t } = useTranslation(NS_COMMON);
  const d = useDispatch();
  const [searchText, onSearch] = useState(gridData.searchText || '');

  useEffect(() => {
    if (!searchText || searchText.length > 2) {
      d(cacheAct.setGridData([parentPage, { searchText }]));
    }
  }, [searchText]);

  return (
    <InputGroup className={className}>
      <Input
        placeholder={t('Search...')}
        onChange={({ target: { value } }) => onSearch(value)}
        value={searchText}
        className={cs({ 'rounded-right': searchText.length < 1 })}
      />

      <FontAwesomeIcon size="lg" fixedWidth icon={faSearch} className="text-muted dropdown-toggle ml-2" />

      {searchText.length > 0 && (
        <InputGroupAddon addonType="append">
          <Button color="success" onClick={() => onSearch('')}>
            {t('Clear')}
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
};

const SearchBar = styled(MySearch)`
  .form-control {
    padding-left: 2.5rem;
  }

  .fa-search {
    z-index: 10;
    opacity: 0.5;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .dropdown.show {
    position: absolute;
    top: 100%;
    margin-top: 0.25rem;

    .dropdown-menu {
      min-width: 22rem !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    .dropdown-item {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

type SizePerPageProps = {
  options: Array<{ page: number }>,
  currSizePerPage: number,
  onSizePerPageChange: (page: number) => void,
};
const sizePerPageRenderer = ({ options, currSizePerPage, onSizePerPageChange }: SizePerPageProps) => (
  <UncontrolledDropdown tag="span" direction="up">
    <DropdownToggle color="outline-primary" caret>
      <span className="mr-1">{currSizePerPage}</span>
    </DropdownToggle>

    <DropdownMenu>
      {options.map((option) => (
        <DropdownItem
          key={option.page}
          active={option.page === parseInt(currSizePerPage, 10)}
          onClick={() => onSizePerPageChange(option.page)}
        >
          {option.page}
        </DropdownItem>
      ))}
    </DropdownMenu>
  </UncontrolledDropdown>
);

const getSortFunc = (f: string) => {
  if (f.includes('name')) return sortByNameWithNumber;

  if (f.includes('date')) return sortDateString;

  return sortInsensitive;
};

const sizePerPageList = (type) => {
  switch (type) {
    case 'odd':
      return [{ value: 5 }, { value: 10 }, { value: 25 }, { value: 50 }, { value: 100 }];
    default:
      return [{ value: 10 }, { value: 25 }, { value: 50 }, { value: 100 }];
  }
};

type RemoteTableProps = {
  noSearch?: boolean,
  keyField?: string,
  data?: object[],
  loading: boolean,
  isPaging?: boolean,
  filter?: (row: object) => boolean,
  columns: [Column],
  parentPage: string,
  gridData?: object,
  sortData?: object,
  defaultSorted?: {
    dataField: string,
    order: 'asc' | 'desc',
  },
  typePerPage?: string,
  children?: ReactNode,
  size?: number,
  wrapperClasses?: string,
};

const RemoteTable: FunctionComponent<RemoteTableProps> = (props: RemoteTableProps) => {
  const {
    parentPage,
    columns,
    isPaging,
    typePerPage,
    children,
    noSearch,
    size,
    keyField,
    defaultSorted,
    wrapperClasses,
    data,
    loading,
    filter,
  } = props;
  const { gridData, sortData } = useSelector((s) => ({
    gridData: { page: 1, sizePerPage: typePerPage ? 5 : 10, searchText: '', ...s.cache[`${parentPage}.grid`] },
    sortData: s.personally[`${parentPage}.grid`] || {},
  }));
  const [filterData, setFilterData] = useState([]);
  const [dataSize, setDataSize] = useState(0);
  const [gridKey, setKey] = useState(uuid());
  const d = useDispatch();
  const { t } = useTranslation();
  const {
    query: { isPrint },
  } = useRouter();

  const cacheData = (obj) => d(cacheAct.setGridData([parentPage, obj]));

  const maxPage = Math.ceil(dataSize / gridData.sizePerPage);

  const onSort = useCallback(
    (dataField, order) => {
      const { sort = {} } = sortData;

      if (
        order === 'asc' &&
        sort.dataField === dataField &&
        sort.order === 'desc' &&
        defaultSorted.dataField !== dataField
      ) {
        d(personAct.set([`${parentPage}.grid`, { sort: defaultSorted }]));

        setKey(uuid());
      } else {
        d(personAct.set([`${parentPage}.grid`, { sort: { dataField, order } }]));
      }
    },
    [sortData, defaultSorted]
  );

  const cols = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        text: col.text === true ? t(col.dataField) : t(col.text),
        onSort,
        sortFunc: col.sortFunc || getSortFunc(col.dataField.toLowerCase()),
      })),
    [columns, onSort]
  );

  const getData = useCallback(
    ({ page = 1, sizePerPage = 10, searchText = '', sort = defaultSorted }: { page: number, sizePerPage: number }) => {
      let result = data.filter((row) => {
        return columns.some((col) => {
          let targetVal = row[col.dataField];

          if (col.filterValue) targetVal = col.filterValue(targetVal, row);

          targetVal = (targetVal || '').toString().toLowerCase();

          return targetVal.includes(searchText.toLowerCase());
        });
      });

      const { sortFunc } = cols.find((x) => x.dataField === sort.dataField) || { sortFunc: sortInsensitive };

      result = result.sort((a, b) => sortFunc(a[sort.dataField], b[sort.dataField], sort.order));

      if (filter) result = result.filter(filter);

      if (!isPaging)
        return {
          result,
          dataSize: result.length,
        };

      let currPage = Math.ceil(result.length / sizePerPage);
      if (page < currPage) currPage = page;

      const currentIndex = (currPage - 1) * sizePerPage;

      return {
        result: result.slice(currentIndex, currentIndex + sizePerPage),
        dataSize: result.length,
      };
    },
    [data, columns, filter]
  );

  useEffect(() => {
    if (loading) {
      setFilterData([]);
      return;
    }

    const newData = getData({ ...gridData, ...sortData });

    setDataSize(newData.dataSize);
    setFilterData(newData.result);
  }, [
    loading,
    filter,
    data,
    gridData.searchText,
    gridData.page,
    gridData.sizePerPage,
    sortData.sort?.dataField,
    sortData.sort?.order,
  ]);

  const handleTableChange = (type, { page, sizePerPage }) => {
    cacheData({ page, sizePerPage });
  };

  useEffect(() => {
    if (!sortData.sort) {
      d(personAct.set([`${parentPage}.grid`, { sort: defaultSorted }]));
    }
  }, []);

  return (
    <PaginationProvider
      key={gridKey}
      pagination={paginationFactory({
        custom: true,
        totalSize: dataSize,
        sizePerPage: !isPaging ? dataSize : gridData.sizePerPage,
        page: (maxPage < gridData.page ? maxPage : gridData.page) || 1,
        hidePageListOnlyOnePage: true,
        hideSizePerPage: !isPaging,
        sizePerPageList: sizePerPageList(typePerPage),
        sizePerPageRenderer,
        showTotal: true,
      })}
    >
      {({ paginationProps, paginationTableProps }) => (
        <>
          <Row className="mb-3">
            <Col className="d-flex">{children}</Col>

            {!noSearch && !isPrint && (
              <Col lg={size} className="mt-1 mt-lg-0">
                <SearchBar parentPage={parentPage} />
              </Col>
            )}
          </Row>
          <BootstrapTable
            {...paginationTableProps}
            bootstrap4
            remote
            keyField={keyField}
            data={filterData}
            columns={cols}
            search={{ defaultSearch: gridData.searchText }}
            onTableChange={handleTableChange}
            defaultSortDirection="asc"
            bordered={false}
            hover
            sort={sortData?.sort}
            wrapperClasses={cs('table-responsive', wrapperClasses)}
            headerClasses="bg-light"
            noDataIndication={() => (
              <>
                <CardLoader loading={loading} />
                {!loading && t(`${NS_COMMON}:No record found`)}
              </>
            )}
          />

          {isPaging && (
            <Row>
              <Col xs={12} xl="auto" className="text-center mr-xl-auto mb-1 mb-xl-0 mt-1">
                <SizePerPageDropdownStandalone {...paginationProps} />
                {paginationProps.showTotal ? (
                  <span className="ml-2 mr-auto">{t(`${NS_COMMON}:Records per page`)}</span>
                ) : null}
              </Col>

              <Col xs="auto" className="mr-xl-0 mx-auto mt-xl-1">
                <PaginationListStandalone {...paginationProps} />
              </Col>
            </Row>
          )}
        </>
      )}
    </PaginationProvider>
  );
};
RemoteTable.defaultProps = {
  keyField: 'id',
  gridData: {},
  sortData: {},
  noSearch: false,
  data: null,
  defaultSorted: {
    dataField: 'id',
    order: 'desc',
  },
  isPaging: true,
  filter: undefined,
  typePerPage: '',
  children: null,
  wrapperClasses: null,
  size: 4,
};

type Props = RemoteTableProps & {
  remote?: () => Promise<object[]>,
  data?: object[],
};

type State = {
  data: Array<object>,
  loading: boolean,
  gridKey: string,
};

class WraperTable extends Component<Props, State> {
  state: State = {
    data: [],
    loading: false,
  };

  static getDerivedStateFromProps({ data, remote }) {
    if (!remote) return { data };

    return null;
  }

  componentDidMount() {
    if (this.props.remote) {
      this.fetchData();
    }
  }

  fetchData = (cb) => {
    const { remote } = this.props;

    this.setState({ loading: true, data: [] }, () =>
      remote()
        .then(({ data }) => this.setState({ data }))
        .then(() => {
          if (cb) cb();
        })
        .finally(() => this.setState({ loading: false }))
    );
  };

  render() {
    return <RemoteTable fetchData={this.fetchData} {...this.props} {...this.state} />;
  }
}
WraperTable.defaultProps = {
  keyField: 'id',
  gridData: {},
  sortData: {},
  noSearch: false,
  defaultSorted: {
    dataField: 'id',
    order: 'desc',
  },
  isPaging: true,
  filter: undefined,
  typePerPage: '',
  children: null,
  remote: null,
  data: null,
  wrapperClasses: null,
  size: 4,
};

export default WraperTable;
