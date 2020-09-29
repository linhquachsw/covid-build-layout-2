// @flow
import { type HTMLAttributes } from 'react';
import { FormContext, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Collapse } from 'reactstrap';
import { NS_COMMON } from 'App/share/i18next';

type Props = HTMLAttributes<HTMLFormElement> & {
  methods: object,
  onSubmit: (values: object) => void,
};

export const HForm = ({ methods, onSubmit, innerRef, ...props }: Props) => {
  return (
    <FormContext {...methods}>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return methods.handleSubmit(onSubmit)(e);
        }}
        {...props}
        ref={innerRef}
      />
    </FormContext>
  );
};

export const AllFieldRequiredText: FunctionComponent = (props) => {
  const { t } = useTranslation(NS_COMMON);
  const { errors } = useFormContext();

  return (
    <Collapse isOpen={Object.keys(errors).some((key) => errors[key].type === 'required')} {...props}>
      <small className="text-danger">{t('allFieldRequired')}</small>
    </Collapse>
  );
};
export const AllFieldRequiredEmailAudit: FunctionComponent = (props) => {
  const { t } = useTranslation(NS_COMMON);
  const { errors } = useFormContext();

  return (
    <Collapse isOpen={Object.keys(errors).some((key) => errors[key].type === 'required')} {...props}>
      <small className="text-danger">{t('allFieldRequiredEmailAudit')}</small>
    </Collapse>
  );
};
