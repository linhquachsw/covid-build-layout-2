// @flow
import { type FunctionComponent, forwardRef, useEffect, useState } from 'react';
import Select from 'react-select';
import type { Props as RProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import cs from 'classnames';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NS_VARIANTS, NS_COMMON } from 'App/share/i18next';
import * as _ from 'lodash';

const RSelectPlaceholderContainer = (props: object) => {
  const { t } = useTranslation(NS_COMMON);
  const { content } = props;

  return (
    <div className="text-truncate" style={{ maxWidth: 'calc(100% - 20px)' }}>
      {content ?? t(`${NS_COMMON}:Select or Type...`)}
    </div>
  );
};

type Props = RProps & {
  type?: string,
  createOption: () => Promise,
  removeOption: () => Promise,
  loadOptions: () => Promise,
};

export const RSelect: FunctionComponent<Props> = forwardRef(
  ({ className, classNamePrefix, type, defaultInputValue, translate, ...props }: Props, ref) => {
    const { t } = useTranslation(NS_COMMON);
    const options = useSelector(({ category }) => category[type]);
    let optionsI18 = _.cloneDeep(options);
    if (translate)
      optionsI18 = optionsI18?.map((x) => {
        return {
          label: t(`${NS_VARIANTS}:${x.value}`),
          value: x.value,
        };
      });

    let { defaultValue } = props;
    const { placeholder } = props;

    if (defaultInputValue) {
      const op = (options || []).find((x) => x.value === defaultInputValue);

      if (op) defaultValue = op;
    }

    return (
      <Select
        options={(translate ? optionsI18 : options) || []}
        hideSelectedOptions
        isLoading={type ? !options : false}
        placeholder={<RSelectPlaceholderContainer content={placeholder} />}
        {...props}
        noOptionsMessage={() => t('NoOptions')}
        defaultValue={defaultValue}
        className={cs('react-select', className)}
        classNamePrefix={cs('react-select', classNamePrefix)}
        ref={ref}
      />
    );
  }
);

type AsyncProps = Props & {
  loadOptions: () => Promise<object>,
};

export const RAsyncSelect: FunctionComponent<AsyncProps> = forwardRef(
  ({ className, classNamePrefix, defaultInputValue, loadOptions, ...props }: AsyncProps, ref) => {
    const [isLoading, setLoading] = useState(true);
    const [options, setOptions] = useState([]);
    const { t } = useTranslation(NS_COMMON);

    useEffect(() => {
      loadOptions()
        .then(({ data }) => setOptions(data))
        .finally(() => setLoading(false));
    }, []);

    let { defaultValue } = props;
    const { placeholder } = props;

    if (defaultInputValue) {
      const op = (options || []).find((x) => x.value === defaultInputValue);

      if (op) defaultValue = op;
    }

    return (
      <Select
        options={options || []}
        hideSelectedOptions
        isLoading={isLoading}
        {...props}
        noOptionsMessage={() => t('NoOptions')}
        placeholder={<RSelectPlaceholderContainer content={placeholder} />}
        defaultValue={defaultValue}
        className={cs('react-select', className)}
        classNamePrefix={cs('react-select', classNamePrefix)}
        ref={ref}
      />
    );
  }
);

export const RCreatableSelect: FunctionComponent<Props> = forwardRef(
  ({ className, classNamePrefix, createOption, loadOptions, name, isDisabled, translate, ...props }: Props, ref) => {
    const [isLoading, setLoading] = useState(true);
    const [options, setOptions] = useState([]);
    const { setValue } = useFormContext();
    const { t, i18n } = useTranslation(NS_COMMON);

    const { placeholder, isNotCreate } = props;

    const fetchData = () =>
      loadOptions()
        .then(({ data }) => {
          if (translate) {
            const dataMultilang = data.map((x) => ({
              label: t(`${NS_VARIANTS}:${x.value}`),
              value: x.value,
            }));
            setOptions(dataMultilang);
          } else {
            setOptions(data);
          }
        })
        .finally(() => setLoading(false));

    useEffect(() => {
      fetchData();
    }, []);

    const handleCreate = (inputValue: string) => {
      setLoading(true);

      createOption(inputValue)
        .then(({ data }) => (data.value ? data : { value: data, label: inputValue }))
        .then((op) => {
          setOptions([op, ...options]);

          if (name) setValue(name, op);

          fetchData();

          i18n.reloadResources(i18n.language, NS_VARIANTS);

          return op;
        })
        .finally(() => setLoading(false));
    };

    if (isNotCreate) {
      return (
        <Select
          onCreateOption={handleCreate}
          hideSelectedOptions
          options={options || []}
          isOptionDisabled={(op) => op.isDisabled || op.isDeleted}
          {...props}
          noOptionsMessage={() => t('NoOptions')}
          fetchData={fetchData}
          isDisabled={isLoading || isDisabled}
          isLoading={isLoading}
          placeholder={<RSelectPlaceholderContainer content={placeholder} />}
          className={cs('react-select', className)}
          classNamePrefix={cs('react-select', classNamePrefix)}
          ref={ref}
        />
      );
    }

    return (
      <CreatableSelect
        onCreateOption={handleCreate}
        hideSelectedOptions
        options={options || []}
        isOptionDisabled={(op) => op.isDisabled || op.isDeleted}
        {...props}
        noOptionsMessage={() => t('NoOptions')}
        fetchData={fetchData}
        isDisabled={isLoading || isDisabled}
        isLoading={isLoading}
        placeholder={<RSelectPlaceholderContainer content={placeholder} />}
        className={cs('react-select', className)}
        classNamePrefix={cs('react-select', classNamePrefix)}
        ref={ref}
      />
    );
  }
);

export const RCreatableSelectOptions: FunctionComponent<Props> = forwardRef(
  (
    {
      className,
      classNamePrefix,
      createOption,
      removeOption,
      loadOptions,
      optionsDefault,
      name,
      isDisabled,
      ...props
    }: Props,
    ref
  ) => {
    const { placeholder } = props;
    const [isLoading, setLoading] = useState(true);
    const [options, setOptions] = useState([]);
    const { setValue } = useFormContext();
    const { t, i18n } = useTranslation(NS_COMMON);

    const fetchData = () => {
      setOptions(optionsDefault);
      setLoading(false);
    };

    const handleLoadData = () =>
      loadOptions()
        .then(({ data }) => setOptions(data))
        .finally(() => setLoading(false));

    useEffect(() => {
      fetchData();
      // setValue(name, '');
    }, [optionsDefault]);

    const handleCreate = (inputValue: string) => {
      setLoading(true);

      createOption(inputValue)
        .then(({ data }) => (data.value ? data : { value: data, label: inputValue }))
        .then((op) => {
          setOptions([op, ...options]);

          if (name) setValue(name, op);

          // fetchData();

          i18n.reloadResources(i18n.language, NS_VARIANTS);

          return op;
        })
        .finally(() => setLoading(false));
    };

    return (
      <CreatableSelect
        onCreateOption={handleCreate}
        hideSelectedOptions
        options={options || []}
        isOptionDisabled={(op) => op.isDisabled || op.isDeleted}
        {...props}
        noOptionsMessage={() => t('NoOptions')}
        fetchData={handleLoadData}
        isDisabled={isLoading || isDisabled}
        isLoading={isLoading}
        placeholder={<RSelectPlaceholderContainer content={placeholder} />}
        className={cs('react-select', className)}
        classNamePrefix={cs('react-select', classNamePrefix)}
        ref={ref}
      />
    );
  }
);
