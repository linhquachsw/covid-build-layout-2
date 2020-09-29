import { useTranslation } from 'react-i18next';
import { NS_VARIANTS } from '../../share/i18next';

const Formatter = ({ data }) => {
  const { t } = useTranslation(NS_VARIANTS);

  return t(data);
};

export const variantTypeFormatter = (cell) => <Formatter data={cell} />;
