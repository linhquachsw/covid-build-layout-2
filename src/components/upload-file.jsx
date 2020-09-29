// @flow
// import dynamic from 'next/dynamic';
import { type FunctionComponent, useState, useEffect } from 'react';
import { FilePond, registerPlugin, type FilePondProps } from 'react-filepond';
import Preview from 'filepond-plugin-image-preview';
import ExifOrientation from 'filepond-plugin-image-exif-orientation';
import FileValidateType from 'filepond-plugin-file-validate-type';
import FileValidateSize from 'filepond-plugin-file-validate-size';
import ImageCrop from 'filepond-plugin-image-crop';
import ImageTransform from 'filepond-plugin-image-transform';
import { deleteFileAzureBlobAPI } from 'App/services/resource.service';
import { NS_COMMON } from 'App/share/i18next';
import { useTranslation } from 'react-i18next';
import { FilepondUtils } from 'App/utils/plugins/filepond/filepond-utils';

const { REACT_APP_AUTH_API_URL } = process.env;

type Props = FilePondProps & { onload?: (str: string) => void };
// const Preview = dynamic(() => import('filepond-plugin-image-preview'), { ssr: false });
// const ExifOrientation = dynamic(() => import('filepond-plugin-image-exif-orientation'), { ssr: false });
// const FileValidateType = dynamic(() => import('filepond-plugin-file-validate-type'), { ssr: false });
// const FileValidateSize = dynamic(() => import('filepond-plugin-file-validate-size'), { ssr: false });

registerPlugin(Preview, ExifOrientation, FileValidateType, FileValidateSize, ImageCrop, ImageTransform);

export const UploadFile: FunctionComponent<Props> = ({ onload, callbackFileId, ...props }: Props) => {
  const [fileTempId, setFileId] = useState();
  useEffect(() => {
    callbackFileId && callbackFileId(fileTempId);
  }, [fileTempId]);

  return (
    <FilePond
      name="content"
      // instantUpload={false}
      allowImageExifOrientation
      allowImagePreview={false}
      server={{
        url: REACT_APP_AUTH_API_URL,
        process: {
          url: '/UploadFileAzureBlob',
          method: 'POST',
          onload: (res) => {
            const { default: url, fileId } = JSON.parse(res);
            if (onload) onload(url);

            return fileId;
          },
        },
        revert: (fileId, load) => {
          deleteFileAzureBlobAPI(fileId).then(() => {
            setFileId(fileId);
          });
          // we are done
          load();
        },
        load: {
          url: '/FileUpload/',
          method: 'GET',
        },
      }}
      {...props}
      {...FilepondUtils.localeConfig({ defaultLocale: {} })}
    />
  );
};
UploadFile.defaultProps = {
  onload: null,
  allowMultiple: false,
};

type CropImageUploadProps = {
  imageCropAspectRatio?: string,
  onload: () => void,
};

export const CropImageUpload: FunctionComponent<CropImageUploadProps> = (props: CropImageUploadProps) => {
  const { imageCropAspectRatio = '1:1', onload } = props;
  const { t } = useTranslation(NS_COMMON);
  return (
    <FilePond
      name="content"
      allowImageExifOrientation
      allowImagePreview
      allowImageCrop
      allowImageTransform
      imageCropAspectRatio={imageCropAspectRatio}
      acceptedFileTypes={['image/*']}
      {...FilepondUtils.localeConfig({
        defaultLocale: {
          labelIdle: `${t('dragAndDropImage')} <span class="filepond--label-action"> ${t('Browse')} </span>`,
        },
      })}
      server={{
        url: REACT_APP_AUTH_API_URL,
        process: {
          url: '/UploadFileAzureBlob',
          method: 'POST',
          onload: (res) => {
            const { default: url, fileId } = JSON.parse(res);

            if (onload) onload(url);

            return fileId;
          },
        },
        load: {
          url: '/FileUpload/',
          method: 'GET',
        },
      }}
      {...props}
    />
  );
};
CropImageUpload.defaultProps = {
  imageCropAspectRatio: '1:1',
};
