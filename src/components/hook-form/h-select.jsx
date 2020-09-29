// @flow
import { useState, useEffect, type FunctionComponent } from 'react';
import classNames from 'classnames';
import { NS_COMMON, NS_VARIANTS } from 'App/share/i18next';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import Select, { components as RSComponents, type MenuListComponentProps } from 'react-select';
import { useSelector } from 'react-redux';
import { HField, type Props as HFieldProps } from './h-inputs';

const MenuList = (props: MenuListComponentProps<object>) => {
  const {
    setValue,
    options,
    children,
    isMulti,
    selectProps,
    selectProps: { filterOption, getOptionValue, getOptionLabel, inputValue },
  } = props;
  const { t } = useTranslation(NS_COMMON);

  return (
    <RSComponents.MenuList {...props}>
      {isMulti && children?.type?.name !== 'NoOptionsMessage' && (
        <RSComponents.Option
          {...props}
          innerProps={{
            onClick: () => {
              let newOps = [];

              options.forEach((op) => {
                if (op.options) newOps = newOps.concat(op.options);
                else newOps.push(op);
              });

              newOps = newOps.filter((data) =>
                filterOption({ data, value: getOptionValue(data), label: getOptionLabel(data) }, inputValue)
              );

              setValue(newOps, 'set-value');
            },
          }}
        >
          {`- ${t('All')} ${t(selectProps.optionLabel)} -`}
        </RSComponents.Option>
      )}
      {children}
    </RSComponents.MenuList>
  );
};

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, backgroundColor: 'gray' } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 } : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: 'none' } : base;
  },
};

const HSelectPlaceholderContainer = (props: { content: string }) => {
  const { t } = useTranslation(NS_COMMON);
  const { content } = props;
  return (
    <div className="text-truncate" style={{ maxWidth: 'calc(100% - 20px)' }}>
      {content ?? t(`${NS_COMMON}:Select or Type...`)}
    </div>
  );
};

type Props = HFieldProps & {
  loadOptions?: () => Promise<{ data: object[] }>,
  onInitOptions?: () => void,
  isMulti?: boolean,
  isSearchable?: boolean,
  isClearable?: boolean,
  required?: required,
  optionLabel?: string,
  components?: object,
  isDisabled?: boodlean,
};

export const HSelect: FunctionComponent<Props> = ({
  loadOptions,
  isMulti,
  isSearchable,
  isDisabled,
  isClearable,
  required,
  optionLabel,
  inputProps,
  className,
  onInitOptions,
  filterOption,
  options: propOps,
  components,
  rules,
  ...props
}: Props) => {
  const { placeholder } = props;
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const { setValue, errors } = useFormContext();
  const { t } = useTranslation(NS_COMMON);

  const { name } = props;

  useEffect(() => {
    if (loadOptions) {
      loadOptions()
        .then(({ data }) => {
          setOptions(data);
          onInitOptions(data);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <HField
      {...props}
      rules={{ required, ...rules }}
      inputProps={{ required, setValue, ...inputProps }}
      as={
        <Select
          components={{ MenuList, ...components }}
          options={loadOptions ? options : propOps}
          isLoading={loading}
          isMulti={isMulti}
          isDisabled={isDisabled}
          styles={styles}
          isSearchable={isSearchable}
          isClearable={isClearable}
          filterOption={filterOption}
          optionLabel={t(optionLabel || name)}
          placeholder={<HSelectPlaceholderContainer content={placeholder} />}
          noOptionsMessage={() => t('No {{type}} Available', { type: t(optionLabel || name) })}
          className={classNames(className, 'react-select', { 'is-invalid': !!errors[name], required })}
          classNamePrefix={classNames('react-select')}
        />
      }
    />
  );
};
HSelect.defaultProps = {
  loadOptions: null,
  required: false,
  isMulti: false,
  isSearchable: true,
  isClearable: true,
  optionLabel: null,
  onInitOptions: () => {},
  components: {},
  isDisabled: false,
};

type TypeProps = HFieldProps & {
  onInitOptions?: () => void,
  isMulti?: boolean,
  isSearchable?: boolean,
  isClearable?: boolean,
  required?: required,
  optionLabel?: string,
  isDisabled?: boolean,
};
export const HTypeSelect: FunctionComponent<TypeProps> = ({
  type,
  isMulti,
  isSearchable,
  isClearable,
  required,
  optionLabel,
  inputProps,
  className,
  onInitOptions,
  filterOption,
  rules,
  options,
  isDisabled,
  ...props
}: TypeProps) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(NS_COMMON);
  const typeOptions = useSelector(({ category }) => category[type]);
  const { setValue, errors } = useFormContext();

  const { name, placeholder } = props;

  useEffect(() => {
    if (typeOptions) {
      if (onInitOptions) onInitOptions(typeOptions);

      setLoading(false);
    }
  }, [typeOptions]);

  const ops = (options || typeOptions || []).map((x) => {
    let label = t(`${NS_VARIANTS}:${x.value}`);

    if (label === `${x.value}`) label = x.label;

    return { ...x, value: x.value, label };
  });

  return (
    <HField
      {...props}
      rules={{ required, ...rules }}
      inputProps={{ required, setValue, ...inputProps }}
      as={
        <Select
          components={{ MenuList }}
          options={ops}
          isLoading={loading}
          isMulti={isMulti}
          isDisabled={isDisabled}
          styles={styles}
          isSearchable={isSearchable}
          isClearable={isClearable}
          filterOption={filterOption}
          optionLabel={t(optionLabel || name)}
          placeholder={<HSelectPlaceholderContainer content={placeholder} />}
          noOptionsMessage={() => t('No {{type}} Available', { type: t(optionLabel || name) })}
          className={classNames(className, 'react-select', { 'is-invalid': !!errors[name], required })}
          classNamePrefix={classNames('react-select')}
        />
      }
    />
  );
};
HTypeSelect.defaultProps = {
  required: false,
  isMulti: false,
  isSearchable: true,
  isClearable: true,
  optionLabel: null,
  isDisabled: false,
  onInitOptions: () => {},
};
