import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface ImageUploadProps {
  setImageFilename: (filename: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setImageFilename }) => {
  const [fileList, setFileList] = useState<any[]>([]);

  const handleChange = (info: any) => {
    let fileList = [...info.fileList];

    // Limiting to only one file
    fileList = fileList.slice(-1);

    // Display image preview
    fileList = fileList.map(file => {
      if (file.response) {
        // Check if filename exists in the response
        const { filename } = file.response;
        if (filename) {
          file.url = file.response.url;
          return file;
        }
      }
      return file;
    });

    setFileList(fileList);

    // Notify parent component of the filename
    if (fileList.length > 0 && fileList[0].response) {
      const { filename } = fileList[0].response;
      if (filename) {
        setImageFilename(filename);
      }
    }
  };


  const uploadButton = (
    <div>
      <Button icon={<UploadOutlined />}>Upload</Button>
    </div>
  );

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      fileList={fileList}
      action="/api/upload"  // Replace with your actual upload endpoint
      onChange={handleChange}
      showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
    >
      {fileList.length >= 1 ? null : uploadButton}
    </Upload>
  );
};

export default ImageUpload;
