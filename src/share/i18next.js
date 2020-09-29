// @flow
// import NextI18Next from 'next-i18next';
import isNode from 'detect-node';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import axios from 'axios';

export const NS_COMMON = 'common';
export const NS_VARIANTS = 'variants';

const { NODE_ENV } = process.env;

if (!isNode) {
  i18next
    // load translation using xhr -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend);
}

const isDev = NODE_ENV === 'development';
const loadPath = isDev ? '/api/locales/{{lng}}/{{ns}}' : '/locales/{{lng}}/{{ns}}.json';

i18next
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: false,
    ns: [NS_COMMON],
    defaultNS: [NS_COMMON],

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    load: 'languageOnly',
    saveMissing: isDev, // send not translated keys to endpoint
    keySeparator: false,
    partialBundledLanguages: true,
    backend: {
      loadPath,
      // path to post missing resources
      addPath: '/api/locales/{{lng}}/{{ns}}',

      parse: (data) => data,

      request(options, url, payload, callback) {
        return axios
          .request({
            method: payload ? 'POST' : 'GET',
            params: options.queryStringParams,
            data: payload,
            url,
          })
          .then((res) => callback(null, res));
      },
    },
  });

export const i18n = i18next;
