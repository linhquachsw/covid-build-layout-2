/* eslint-disable no-param-reassign */
// @flow
import { createSlice } from '@reduxjs/toolkit';
import * as _ from 'lodash';
import * as cookie from 'js-cookie';
import { Get, FACILITY_KEY } from 'App/services/base.service';
import { TOKEN_KEY, REFRESH_TOKEN } from 'App/appConst';
import { actions as catActions, CAT_KEY } from './category.slice';
import { actions as notiActions } from './notification.slice';

export const USER_TYPE = {
  INTERNAL: 95000,
  TENANT: 95001,
  VENDOR: 95002,
};

export const userTypeSelector = (s) => {
  return { userType: _.get(s, 'auth.userType') || null };
};

const slice = createSlice({
  name: 'auth',
  initialState: {},
  reducers: {
    login: (state, action) => {
      const { accessToken, refreshToken, expiresIn, ...data } = action.payload;

      const expires = new Date();
      expires.setSeconds(expires.getSeconds() + expiresIn);

      cookie.set(TOKEN_KEY, accessToken, { expires, sameSite: 'Lax' });
      localStorage.setItem(REFRESH_TOKEN, JSON.stringify({ username: data.username, refreshToken }));
      localStorage.setItem('user_name', data.username);

      return { ...state, ...data };
    },
    logout: (state) => {
      const { username, rememberMe } = state;

      cookie.remove(TOKEN_KEY);

      sessionStorage.setItem('logoutTime', new Date().toISOString());
      // sessionStorage.setItem(LAST_ROUTE, `${Router.pathname}|${Router.asPath}`);
      localStorage.removeItem(FACILITY_KEY);
      localStorage.removeItem(REFRESH_TOKEN);
      localStorage.removeItem(`IU_${TOKEN_KEY}`);
      localStorage.removeItem(`IU_${REFRESH_TOKEN}`);
      _.forIn(localStorage, (value, key) => {
        if (_.endsWith(key, `filter:${username}`)) {
          localStorage.removeItem(key);
        }
      });

      if (rememberMe) return { username, rememberMe };

      return {};
    },
  },
});

export const { actions } = slice;

export default slice;

export const getUserInfo = (dispatch) => {
  return Get(`/GetInfo`)
    .then((res) => {
      dispatch(actions.fillData(res.data));

      const keys: object[] = res.data.keys.map((x) => ({ ...x, value: x.value, label: x.displayName }));

      dispatch(
        catActions.setCategory({
          [CAT_KEY]: keys,
        })
      );

      return res;
    })
    .catch((err) => {
      if (err.isAxiosError) {
        if (!err.response) {
          dispatch(
            notiActions.addNof({
              color: 'danger',
              header: 'Something went wrong!',
              children: 'Please check your network and try again.',
            })
          );
        }
      }

      return err;
    });
};

const mapKeyToPermission = {
  C: 'create',
  R: 'read',
  U: 'update',
  D: 'delete',
};

export const isGrantAny = (permission: object, strCondition: string) => {
  if (!permission) return false;

  return strCondition.split('.').some((key) => {
    const field = mapKeyToPermission[key];

    if (permission[field]) return true;

    return false;
  });
};

export const getPermission = (key) => (state) => {
  const permissions = _.get(state, 'auth.permissions') || [];
  return permissions.find((p) => p.keyScreen === key);
};

export const isAuthenticated = () => {
  return !!cookie.get(TOKEN_KEY) && cookie.get(TOKEN_KEY) !== 'undefined';
};
