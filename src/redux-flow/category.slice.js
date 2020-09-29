// @flow
import { createSlice } from '@reduxjs/toolkit';
import { Get } from 'App/services/base.service';

export const CAT_KEY = 'CAT_KEY';
export const CAT_FACILITY = 'CAT_FACILITY';

const mapAPI = {
  [CAT_FACILITY]: `/GetCatFacility`,
};

const mapKeyValue = {
  [CAT_KEY]: ['value', 'displayName'],
  [CAT_FACILITY]: ['id', 'name'],
};

const initialState = {};

const slice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      return { ...state, ...action.payload };
    },
    clear: (state) => ({ ...initialState, [CAT_KEY]: state[CAT_KEY] }),
  },
});

export const { actions } = slice;

export default slice;

export const fetchCategories = (categories: string[]) => (dispatch) => {
  if (categories && categories.length > 0) {
    const tasks = categories.map((cat) => Get(mapAPI[cat]));

    return Promise.all(tasks).then((res) => {
      const newState = categories.reduce((prev, val, inx) => {
        /* eslint-disable no-param-reassign */
        prev[val] = res[inx].data;

        if (mapKeyValue[val]) {
          const [key, value] = mapKeyValue[val];

          prev[val] = prev[val].map((p) => ({ ...p, value: p[key], label: p[value] }));
        }

        dispatch(actions.setCategory({ [val]: prev[val] }));

        return prev;
      }, {});

      return newState;
    });
  }

  return Promise.resolve();
};
