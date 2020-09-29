/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { getPermissionsAPI } from 'App/services/roleAndPermission.serivce';
// import get from 'lodash/get';

const slice = createSlice({
  name: 'role',
  initialState: null,
  reducers: {
    init: (state, action) => {
      return action.payload;
    },
  },
});

export const { actions } = slice;

export default slice;

export const fetchRoleDetail = () => async (dispatch) => {
  try {
    const permissions = await getPermissionsAPI();

    dispatch(actions.init({ permissions }));
  } catch (err) {
    console.log(err);
  }
};
