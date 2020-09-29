/* eslint-disable no-param-reassign */
// @flow
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'personally',
  initialState: {},
  reducers: {
    set: (state, action) => {
      const [key, value] = action.payload;

      if (!state[key]) return { ...state, [key]: value };

      if (value instanceof Array || typeof value !== 'object')
        return {
          ...state,
          [key]: value,
        };

      return {
        ...state,
        [key]: { ...state[key], ...value },
      };
    },

    clear: () => ({}),

    remove: (state, { payload: key }) => ({ ...state, [key]: null }),
  },
});

export const { actions } = slice;

export default slice;
