import _ from 'lodash/fp';
import { createSlice } from '@reduxjs/toolkit';
import { uploadFileAzureBlobAPI } from 'App/services/resource.service';

export const initialState = {
  uploadFile: {
    data: undefined,
    error: undefined,
    loading: false,
  },
};

export const slice = createSlice({
  name: 'resource',
  initialState,
  reducers: {
    uploadFileAzureBlobInit: (state) => _.assign(state, { uploadFile: { loading: true } }),
    uploadFileAzureBlobSuccess: (state, action) =>
      _.assign(state, {
        uploadFile: {
          data: action.payload,
          loading: false,
        },
      }),
    uploadFileAzureBlobFail: (state, action) => {
      return _.assign(state, {
        uploadFile: {
          error: action.payload,
          loading: false,
        },
      });
    },
  },
});

export const { actions } = slice;

export default slice;

export const uploadFileAzureBlob = () => {
  return (dispatch) => {
    dispatch(actions.uploadFileAzureBlobInit());
    return uploadFileAzureBlobAPI()
      .then((data) => {
        dispatch(actions.uploadFileAzureBlobSuccess(data.data));
      })
      .catch((error) => {
        dispatch(actions.uploadFileAzureBlobFail(error));
      });
  };
};
