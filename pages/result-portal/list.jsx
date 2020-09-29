// @flow
import { PageLayout } from 'App/components/layout/pageLayout';
// import { Card } from 'reactstrap';
import { DataTable, type Column } from 'App/components/data-table';
import { dateTypeFormatter } from 'App/components/data-formatter';
import { ResultTypeIcon, ResultColor } from 'App/systemKeyConst';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NextLink from 'next/link';
import { Portlet, Link } from 'App/components';
import { Row, ListGroup, ListGroupItem, Button, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { NS_COMMON } from 'App/share/i18next';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';

const data = [
  {
    id: 1,
    firtName: 'Joe',
    lastName: 'Doe',
    date: '2020-08-03T10:50:50.587',
    resultType: 1,
    resultText: 'Positive',
    phone: '222 222-2222',
    cov: 2332342,
    site: 'Hayward Fire	',
  },
  {
    id: 2,
    firtName: 'Joshep',
    lastName: 'With',
    date: '2020-08-03T10:50:50.587',
    resultType: 3,
    resultText: 'Invalid',
    phone: '222 222-2222',
    cov: 2332342,
    site: 'Avellino',
  },
];

const columns: [Column] = [
  {
    dataField: 'firtName',
    text: 'First Name',
    sort: true,
  },
  {
    dataField: 'lastName',
    text: 'Last Name',
    sort: true,
  },
  {
    dataField: 'date',
    text: 'Date of Birth',
    sort: true,
    formatter: dateTypeFormatter,
    filterValue: dateTypeFormatter,
  },
  {
    dataField: 'resultType',
    text: 'Result',
    sort: true,
    formatter: (cell) => (
      <>
        <p className={ResultColor(cell)}>
          <FontAwesomeIcon icon={ResultTypeIcon[cell]} fixedWidth size="md" />
          Positive
        </p>
      </>
    ),
    style: { minWidth: '10em' },
  },
  {
    dataField: 'phone',
    text: 'Phone Number',
    sort: true,
  },
  {
    dataField: 'cov',
    text: 'COV #',
    sort: true,
  },
  {
    dataField: 'date',
    text: 'Collection Dates',
    sort: true,
    formatter: dateTypeFormatter,
    filterValue: dateTypeFormatter,
  },
  {
    dataField: 'date',
    text: 'Received Dates',
    sort: true,
    formatter: dateTypeFormatter,
    filterValue: dateTypeFormatter,
  },
  {
    dataField: 'date',
    text: 'Result Dates',
    sort: true,
    formatter: dateTypeFormatter,
    filterValue: dateTypeFormatter,
  },
  {
    dataField: 'site',
    text: 'Site',
    sort: true,
  },
  {
    dataField: 'id',
    text: '',
    // sort: true,
    formatter: (cell) => (
      <NextLink
        href={{
          pathname: '/result-portal/patient-report',
          query: { userId: cell },
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>View Report</a>
      </NextLink>
    ),
  },
];

const ResultPortal = () => {
  const { t } = useTranslation(NS_COMMON);

  return (
    <PageLayout>
      <Row>
        <Portlet cardTitle="Results Portal – Last 2 Weeks of Results">
          <div className="listgroup-custom mt-4">
            <ListGroup horizontal="md">
              <ListGroupItem tag="a" href="#">
                {t('Logout')}
              </ListGroupItem>
              <ListGroupItem tag="a" href="#">
                {t('Email Support')}
              </ListGroupItem>
              <ListGroupItem tag="a" href="#">
                {t('Result Portal')}
              </ListGroupItem>
              <ListGroupItem tag="a" href="#">
                {t('Search Result')}
              </ListGroupItem>
              <ListGroupItem tag="a" href="#">
                {t('In Process')}
              </ListGroupItem>
            </ListGroup>
          </div>
        </Portlet>
      </Row>
      <Row>
        <Col className="text-right mb-4" md="12">
          <Link href="/delegates">
            <Button color="primary">{t('Delegates')}</Button>
          </Link>
        </Col>
      </Row>
      {/* <Card body> */}
      <DataTable data={data} columns={columns} parentPage="result-portal">
        <Button className="pl-0" color="link">
          <FontAwesomeIcon className="mr-2" icon={faFileDownload} color="gray" />
          Download Data
        </Button>
      </DataTable>
      {/* </Card> */}
    </PageLayout>
  );
};

export default ResultPortal;
