// @flow
import { Post } from './base.service';

const { REACT_APP_AUTH_API_URL } = process.env;

export const checkUserNameIsExistAPI = (username) => Post(`${REACT_APP_AUTH_API_URL}/CheckUserNameIsExist/${username}`);

export const externalSignupAPI = (payload) => Post(`${REACT_APP_AUTH_API_URL}/ExternalSignup`, payload);

export const checkEmailIsExistAPI = (emailVal) => Post(`${REACT_APP_AUTH_API_URL}/CheckEmailIsExist/${emailVal}`);
