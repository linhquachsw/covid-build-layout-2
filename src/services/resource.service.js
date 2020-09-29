import { Get, Post, getService } from './base.service';

const { REACT_APP_AUTH_API_URL } = process.env;

export const uploadFileAzureBlobAPI = (payload) =>
  getService().post(`${REACT_APP_AUTH_API_URL}/UploadFileAzureBlob`, payload);

export const getFileInfoAPI = (payload) => Get(`/GetFileInfo/${payload}`);

export const deleteFileAzureBlobAPI = (payload) => Post(`${REACT_APP_AUTH_API_URL}/DeleteFileAzureBlob/${payload}`);

export const getFileAzureBlobURL = (fileId) => `${REACT_APP_AUTH_API_URL}/FileUpload/${fileId}`;
