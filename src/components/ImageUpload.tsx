import React from 'react';
//import '../App.css';
import 'antd/dist/reset.css';
import { Upload, Button, message, Alert, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { api } from './common/http-common';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
      imgPosted: [],
      isUploadOk: false,
      imageFilename: ''
    };
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const { setImageFilename } = this.props; // Destructure the prop here
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('upload', file, file.name);
    });

    this.setState({
      uploading: true
    });

    let requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    };

    fetch(`https://a9cae81d-c094-4635-9860-14e886ff26fe-00-1n32cs1xece6w.pike.replit.dev:3000/api/v1/images`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        message.success('upload successfully.');
        this.setState({
          isUploadOk: true,
          imageFilename: result.filename
        });
        setImageFilename(result.filename); // Use the prop here
        this.setState({
          imgPosted: result
        });
        console.log("result ", result);
      })
      .catch((error) => {
        message.error('upload failed.');
        console.error('Error:', error);
      })
      .finally(() => {
        this.setState({
          uploading: false,
        });
      });
  };

  render() {
    const { Title } = Typography;
    const { uploading, fileList, imageFilename } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <>
        <div>
          <p></p>
          <Title level={3} style={{ color: "#0032b3" }}>Select and Upload Pet Image</Title>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
          <Button
            onClick={this.handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16, marginBottom: 16 }}
          >
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
          {this.state.isUploadOk && (
            <div>
              <p style={{ color: 'red' }}>Image uploaded successfully: </p>
              <Alert style={{ marginTop: 16, marginBottom: 16 }} message={JSON.stringify(this.state.imgPosted)} type="success" />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default ImageUpload;
