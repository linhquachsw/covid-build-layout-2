// @flow
import { configureStore, getDefaultMiddleware, combineReducers } from '@reduxjs/toolkit';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import authSlice from './auth.slice';
import roleSlice from './role.slice';
import categorySlice from './category.slice';
import { slice as notificationSlice } from './notification.slice';
import cacheSlice from './cache.slice';
import personallySlice from './personally.slice';
import resourceSlice from './resource.slice';

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [cacheSlice.name]: cacheSlice.reducer,
  [categorySlice.name]: categorySlice.reducer,
  [notificationSlice.name]: notificationSlice.reducer,
  [personallySlice.name]: personallySlice.reducer,
  [resourceSlice.name]: resourceSlice.reducer,
  [roleSlice.name]: roleSlice.reducer,
});

const makeConfiguredStore = (reducer) => {
  const store = configureStore({
    reducer,
    middleware: getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  });

  return store;
};

export default (initialState: object = {}, { isServer }: MakeStoreOptions) => {
  if (isServer) {
    return makeConfiguredStore(rootReducer, initialState);
  }
  // we need it only on client side
  /* eslint-disable global-require */
  const { persistStore, persistReducer } = require('redux-persist');
  const storage = require('redux-persist/lib/storage').default;

  const persistConfig = {
    key: 'next-zero',
    whitelist: ['personally', 'auth'], // make sure it does not clash with server keys
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = makeConfiguredStore(persistedReducer, initialState);

  // eslint-disable-next-line no-underscore-dangle
  if (!store.__persistor) store.__persistor = persistStore(store); // Nasty hack

  return store;
};

export type AppState = {
  personally: {
    userInfo?: object,
  },
};
