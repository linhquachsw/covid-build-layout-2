// @flow
import { v4 as uuid } from 'uuid';
import { useState, type FunctionComponent, type PropsWithChildren, useCallback } from 'react';
import {
  CustomInput,
  type CustomInputProps,
  FormGroup,
  Label,
  Col,
  Input,
  type InputProps,
  type LabelProps,
  FormFeedback,
} from 'reactstrap';
import { type ColumnProps } from 'reactstrap/lib/Col';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RHFInput } from 'react-hook-form-input';
import classNames from 'classnames';
import { NS_COMMON } from 'App/share/i18next';

export const Checkbox = (props: CustomInputProps) => {
  const { t } = useTranslation(NS_COMMON);
  const [id] = useState(uuid());
  const { register } = useFormContext();

  const { name, label } = props;

  return (
    <CustomInput id={id} innerRef={register} {...props} label={label === true ? t(name) : label} type="checkbox" />
  );
};

export const Radio = (props: CustomInputProps) => {
  const [id] = useState(uuid());
  const { register } = useFormContext();
  const { t } = useTranslation(NS_COMMON);

  const { name, label } = props;

  return <CustomInput id={id} innerRef={register} {...props} type="radio" label={label === true ? t(name) : label} />;
};

export const Switch = (props: CustomInputProps) => {
  const [id] = useState(uuid());
  const { register } = useFormContext();
  const { t } = useTranslation(NS_COMMON);

  const { name, label } = props;

  return (
    <CustomInput id={id} innerRef={register} {...props} label={label === true ? t(name) : t(label)} type="switch" />
  );
};

export type Props = PropsWithChildren<{
  rules?: {
    required:
      | string
      | boolean
      | {
          value: boolean,
          message: string,
        },
    min:
      | string
      | number
      | {
          value: string | number,
          message: string,
        },
    max:
      | string
      | number
      | {
          value: string | number,
          message: string,
        },
    maxLength:
      | string
      | number
      | {
          value: string | number,
          message: string,
        },
    minLength:
      | string
      | number
      | {
          value: string | number,
          message: string,
        },
    pattern:
      | RegExp
      | {
          value: RegExp,
          message: string,
        },
    validate: (value: string | number | object) => string,
  },
  xs?: [ColumnProps],
  sm?: [ColumnProps],
  md?: [ColumnProps],
  lg?: [ColumnProps],
  xl?: [ColumnProps],
  inputProps?: InputProps,
  name: string,
  row?: boolean,
  label?: string,
  helpText?: string,
  labelProps: LabelProps,
}>;

export const HField: FunctionComponent<Props> = ({
  children,
  row,
  name,
  label,
  labelProps,
  tag: Tag,
  rules,
  as,
  inputProps,
  xs,
  sm,
  md,
  lg,
  xl,
  helpText,
  pandingInput,
  ...restProps
}: Props) => {
  const [id] = useState(uuid());
  const { t } = useTranslation(NS_COMMON);
  const { register, errors, setValue } = useFormContext();

  const setInputValue = useCallback((field: string, value) => {
    if (value && value instanceof Array) {
      if (value.some((p) => p.value === 'ALL')) {
        const [, ...allOps] = inputProps.options;

        return setValue(field, allOps, true);
      }

      if (value.length < 1) return setValue(field, null, true);
    }

    return setValue(field, value, true);
  });

  let input = null;
  if (as) {
    input = (
      <RHFInput
        setValue={setInputValue}
        register={register}
        rules={rules}
        name={name}
        id={id}
        as={as}
        mode="onChange"
        {...inputProps}
      />
    );
  } else {
    input = <Tag innerRef={register(rules)} invalid={!!errors[name]} {...inputProps} name={name} id={id} />;
  }

  const helpElem = helpText ? <small className="form-text text-muted">{helpText}</small> : null;

  let feedbackText = null;
  if (errors[name] && errors[name].message !== null) {
    const { [name]: error } = errors;

    const rule = rules[error.type];

    if (error.message) feedbackText = t(error.message);
    else if (error.message !== '' && rule) {
      const ruleValues = rule.value !== undefined ? rule : { value: rule };

      feedbackText = t(error.type, ruleValues);
    } else {
      feedbackText = t(error.type);
    }
  }

  const feedback = feedbackText && <FormFeedback>{feedbackText}</FormFeedback>;

  if (!label)
    return (
      <>
        {input}
        {feedback}
        {helpElem}
      </>
    );

  if (row) {
    return (
      <FormGroup {...restProps} className={classNames('form-row', restProps.className)}>
        <Label
          className="font-weight-bold"
          {...labelProps}
          xs={xs[0]}
          sm={sm[0]}
          md={md[0]}
          lg={lg[0]}
          xl={xl[0]}
          for={id}
        >
          {t(label === true ? name : label)}
        </Label>
        <Col xs={xs[1]} sm={sm[1]} md={md[1]} lg={lg[1]} xl={xl[1]} className={pandingInput}>
          {input}
          {feedback}
          {helpElem}
        </Col>
        {children}
      </FormGroup>
    );
  }

  return (
    <FormGroup {...restProps}>
      <Label className="font-weight-bold" {...labelProps} for={id}>
        {t(label === true ? name : label)}
      </Label>
      {input}
      {feedback}
      {helpElem}
      {children}
    </FormGroup>
  );
};
HField.defaultProps = {
  rules: {},
  tag: Input,
  row: false,
  label: '',
  helpText: null,
  labelProps: null,
  inputProps: null,
  xs: [],
  sm: [],
  md: [],
  lg: [],
  xl: [],
};

export const HFeedback = ({ name, rules }: { name: string, rules?: object }) => {
  const { t } = useTranslation(NS_COMMON);
  const { errors } = useFormContext();

  const error = errors[name];

  if (!error) return null;

  let feedbackText = null;
  const rule = rules[error.type];

  if (error.message) feedbackText = t(error.message);
  else if (error.message !== '') {
    const ruleValues = rule?.value !== undefined ? rule : { value: rule };

    feedbackText = t(error.type, ruleValues);
  }

  if (!feedbackText) return null;

  return <div className="d-block invalid-feedback">{t(feedbackText)}</div>;
};
HFeedback.defaultProps = {
  rules: {},
};
