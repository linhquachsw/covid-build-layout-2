// @flow
import { FunctionComponent, useState } from 'react';
import { CustomInput } from 'reactstrap';
import { v4 as uuid } from 'uuid';

type RowProps = {
  cell: string & number,
};

const Row: FunctionComponent<RowProps> = ({ cell }: RowProps) => {
  const [key] = useState(uuid());

  return <CustomInput type="checkbox" id={key} name={key} checked={!!cell} readOnly />;
};

export const checkboxTypeFormatter = (cell, row) => row && <Row cell={cell} row={row} />;
