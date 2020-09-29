import { Post } from './base.service';

const { REACT_APP_AUTH_API_URL } = process.env;

const config = { baseURL: REACT_APP_AUTH_API_URL };

export const loginAPI = (payload) => Post('/Auth', payload, config);

export const signUpAPI = (payload) => Post('/Auth/Register', payload, config);

export const sendEmailResetPasswordAPI = (payload) => Post('/SendEmailResetPassword', payload, config);

export const resetPasswordAPI = (payload) => Post('/ResetPassword', payload, config);
