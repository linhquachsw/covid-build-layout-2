// @flow
import { type FunctionComponent, useState } from 'react';
import { ModalFooter, type ModalFooterProps, Button, Spinner } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { type PermissionModel } from 'App/share/types';
import { isGrantAny } from 'App/redux-flow/auth.slice';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { NS_COMMON } from 'App/share/i18next';
import { HButton } from './h-button';
import { AllFieldRequiredText } from './h-form';

type Props = ModalFooterProps & {
  permission?: PermissionModel,
  onDelete?: () => Promise,
  saveTitle?: string,
  savePermission?: string,
};

export const HModalFooter: FunctionComponent<Props> = ({
  onDelete,
  onEdit,
  isSave,
  permission,
  saveTitle,
  saveColor,
  savePermission,
  children,
  isShowAllFieldRequiredText,
  onClose,
  ...props
}: Props) => {
  const { t } = useTranslation(NS_COMMON);
  const [loadingDelete, setLoading] = useState(false);
  const {
    formState: { isSubmitting },
  } = useFormContext();

  const handleDelete = () => {
    setLoading(true);

    return onDelete();
  };

  const spinnerClasses = classNames('align-middle mr-2', { 'd-none': !loadingDelete });

  return (
    <ModalFooter {...props}>
      {isShowAllFieldRequiredText && <AllFieldRequiredText className="mr-auto" />}

      {children}

      {onDelete && (!permission || permission.delete) && (
        <Button color="danger" onClick={handleDelete} disabled={loadingDelete || isSubmitting}>
          <Spinner size="sm" color="light" className={spinnerClasses} />

          {t('Delete')}
        </Button>
      )}
      {isSave && (!permission || isGrantAny(permission, savePermission)) && (
        <HButton color={saveColor}>{t(saveTitle)}</HButton>
      )}
      {onEdit && (!permission || permission.update) && (
        <Button color="secondary" onClick={onEdit}>
          {t('Edit')}
        </Button>
      )}
      {onClose && <Button> {t('Close')}</Button>}
    </ModalFooter>
  );
};
HModalFooter.defaultProps = {
  isSave: true,
  isShowAllFieldRequiredText: true,
  onDelete: null,
  onEdit: null,
  permission: null,
  saveTitle: 'Save',
  saveColor: 'success',
  savePermission: 'U.D',
  onClose: null,
};
