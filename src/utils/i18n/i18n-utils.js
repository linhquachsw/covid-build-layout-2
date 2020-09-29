import { NS_COMMON, NS_VARIANTS } from 'App/share/i18next';
import { es, enUS } from 'date-fns/locale';

export class I18nUtils {
  static DATE_TRANSLATE_FORMAT = 'MMMM yyyy';

  // translate from client
  static translateClient(t, key) {
    return !key ? '' : t(`${NS_COMMON}:${key}`);
  }

  // translate from server
  static translateServer(t, key) {
    return !key ? '' : t(`${NS_VARIANTS}:${key}`);
  }

  static sortByTranslated(a, b, order, t) {
    if (order === 'asc') {
      return this.translateServer(t, a) > this.translateServer(t, b) ? 1 : -1;
    }
    return this.translateServer(t, a) < this.translateServer(t, b) ? 1 : -1;
  }

  // set format date
  static setFormat(lang = 'en') {
    switch (lang) {
      default:
        return this.DATE_TRANSLATE_FORMAT;
    }
  }

  // set locales date
  static setLocale(lang = 'en') {
    switch (lang) {
      case 'es':
        return es;

      default:
        return enUS;
    }
  }
}
