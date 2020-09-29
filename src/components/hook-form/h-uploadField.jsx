// @flow
import { type FunctionComponent, useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { getFileInfoAPI } from 'App/services/resource.service';
import { UploadFile } from '../upload-file';

type Props = {
  name: string,
  disabled: Boolean,
  rules: object,
};

export const HUploadField: FunctionComponent = ({ name, disabled, rules = {} }: Props) => {
  const [files, setFiles] = useState([]);
  const { register, setValue, watch } = useFormContext();

  useEffect(() => {
    register({ name }, rules);
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
    <UploadFile
      files={files}
      disabled={disabled}
      onload={(url) => {
        setValue(name, url, true);
      }}
      onupdatefiles={(fileItems) => {
        if (fileItems.length < 1) {
          setValue(name, '', true);
        }

        // Set currently active file objects to this.state
        setFiles(fileItems.map((fileItem) => fileItem.file));
      }}
    />
  );
};
