// @flow
import { type FunctionComponent, useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { getFileInfoAPI } from 'App/services/resource.service';
import { FilePond, registerPlugin, type FilePondProps } from 'react-filepond';
import Preview from 'filepond-plugin-image-preview';
import ExifOrientation from 'filepond-plugin-image-exif-orientation';
import FileValidateType from 'filepond-plugin-file-validate-type';
import FileValidateSize from 'filepond-plugin-file-validate-size';
import ImageTransform from 'filepond-plugin-image-transform';
import { FilepondUtils } from 'App/utils/plugins/filepond/filepond-utils';
import { NS_COMMON } from 'App/share/i18next';
import { useTranslation } from 'react-i18next';

registerPlugin(ExifOrientation, Preview, FileValidateType, FileValidateSize, ImageTransform);

const { REACT_APP_AUTH_API_URL } = process.env;

type Props = FilePondProps & { name: string, onload?: (str: string) => void };

export const HUploadImage: FunctionComponent = ({ name }: Props) => {
  const [files, setFiles] = useState([]);
  const { register, setValue, watch } = useFormContext();
  const { t } = useTranslation(NS_COMMON);

  useEffect(() => {
    register({ name });
  }, [register]);

  const img = watch(name);

  useEffect(() => {
    if (img && files.length < 1)
      getFileInfoAPI(img.split('/').slice(-1)[0]).then(({ data }) =>
        setFiles([
          {
            options: {
              type: 'local',
              // mock file information
              file: {
                name: data.fileName,
                size: data.size,
                type: data.mimeType,
              },
            },
          },
        ])
      );
  }, [img]);

  return (
    <FilePond
      name={name}
      // instantUpload={false}
      allowImagePreview
      acceptedFileTypes={['image/*']}
      allowImageExifOrientation
      // imageTransformOutputMimeType="image/*"
      files={files}
      onpreparefile={(file, output) => {
        const body = new FormData();
        body.append('content', output, file.filename);

        fetch(`${REACT_APP_AUTH_API_URL}/UploadFileAzureBlob`, { method: 'POST', body })
          .then((res) => res.json())
          .then(({ default: url }) => {
            setValue(name, url, true);
          });
      }}
      onupdatefiles={(fileItems) => {
        if (fileItems.length < 1) {
          setValue(name, '', true);
        }

        // Set currently active file objects to this.state
        setFiles(fileItems.map((fileItem) => fileItem.file));
      }}
      {...FilepondUtils.localeConfig({
        defaultLocale: {
          labelIdle: `${t('dragAndDropImage')} <span class="filepond--label-action"> ${t('Browse')} </span>`,
        },
      })}
    />
  );
};
