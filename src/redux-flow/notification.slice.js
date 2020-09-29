/* eslint-disable no-param-reassign */
// @flow
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { type AxiosError } from 'axios';

export const slice = createSlice({
  name: 'notification',
  initialState: [],
  reducers: {
    addNof: (state, action) => {
      state.push(action.payload);
    },
    removeNof: (state, action) => state.filter((p) => p.id !== action.payload),
  },
});

export const { actions } = slice;

export const pushNoti = (cb: Promise, extraConfig) => (dispatch) => {
  const id = uuid();

  return !cb
    ? Promise.resolve()
    : cb.catch((err: AxiosError) => {
        if (err) {
          if (err.isAxiosError && !err.response) {
            const nof = {
              id,
              header: 'Error',
              children: 'Cannot connect to server!',
              color: 'danger',
            };

            dispatch(actions.addNof(nof));
          } else {
            const nof = {
              id,
              header: err.isAxiosError && err.response ? err.response.statusText : 'Error',
              children: err.message,
              color: 'danger',
              ...extraConfig,
            };

            dispatch(actions.addNof(nof));
          }

          throw err;
        }
      });
};
