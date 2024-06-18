import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Spin, Button, Modal, Form, Input, message, Upload } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getCurrentUser } from "../services/auth.service";
import DogT from "../types/dog.type";
import { editDog, addDog, deleteDog,getDogById } from "../services/dog.service";
import { api } from '../components/common/http-common';
import ImageUpload from './ImageUpload'
import { v4 as uuidv4 } from 'uuid';

const ManageDog: React.FC = () => {
  const [dogs, setDogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentDog, setCurrentDog] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [image, setImageFilename] = useState<string>('');
  const token = localStorage.getItem("token");

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === 'admin') {
      setCurrentUser(user);
      fetchDogs();
    } else {
      alert("You do not have access to this page.");
      window.location.href = '/login'
    }
    }, []);

  const fetchDogs = async () => {
    setLoading(true);
    try {
      const response = await api.get("/dogs", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setDogs(response.data);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDog = async (values: DogT) => {
    const { name, breed, age, description } = values;
    const image = uuidv4();
    console.log(token);
  addDog(name, breed, age, description,image).then(
      (response) => {

        window.alert("success")
        fetchDogs(); 
        setIsModalVisible(false);

      })
      .catch((error) => {
                 window.alert(error)
         console.log(error.toString());

      }
    );
  };

  const handleUpdateDog = async (values: any) => {
    const { id, name, breed, age, description } = values;
    const image = uuidv4();
    try {
      await editDog(id,  name, breed, age, description, image );
      message.success('Dog updated successfully');
      fetchDogs();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error updating dog:', error);
      message.error('Failed to update dog');
    }
  };
  
  const handleDeleteDog = async (id: number) => {
    console.log(token);
    console.log(id);
    try {
      await deleteDog(id);
      message.success('Dog deleted successfully');
      fetchDogs(); // Refresh the dog list after successful deletion
    } catch (error) {
      console.error('Error deleting dog:', error);
      message.error('Failed to delete dog');
    }
  };


  const onFinish = (values: any) => {
    console.log('Received values:', values);
    if (isEditing) {
      handleUpdateDog(values);
    } else {
      handleAddDog(values);
    }
  };
  
  const showModal = (dog: any = null) => {
    setCurrentDog(dog);
    setIsEditing(!!dog);
    setIsModalVisible(true);
    if (dog && dog.image) {
          setImageFilename(dog.image); // Set image URL when modal is shown
      } else {
          setImageFilename(''); // Reset image URL if no dog or no image
      }
  };

  if (loading) {
    return <Spin indicator={<LoadingOutlined style={{ marginTop: "15%" , fontSize: 48 }} spin />} />;
  }
  return (
    <div>
      <Button onClick={() => showModal()} style={{ marginTop: "2%" }}>Add Dog</Button>
      <Row gutter={[16, 16]} style={{ marginTop: "15px" }}>
        {loading ? <Spin indicator={<LoadingOutlined />} /> : (
          dogs.map(dog => (
            <Col key={dog.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={dog.name}
                style={{height: 400 }}
                extra={
                  <>
                     <Button onClick={() => showModal(dog)}>Edit</Button>
                    <Button
                      type="danger"
                      onClick={() => {
                        // Show confirmation alert before deleting
                        Modal.confirm({
                          title: 'Confirm Deletion',
                          content: 'Are you sure you want to delete this dog?',
                          okText: 'Yes, delete this dog!',
                            cancelText: 'No',
                          onOk() {
                            handleDeleteDog(dog.id);
                          },
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </>
                }
              >
                <p><img src={`https://a9cae81d-c094-4635-9860-14e886ff26fe-00-1n32cs1xece6w.pike.replit.dev:3000/api/v1/images/${dog.image}`} alt="dog" style={{ width: '50%', height: 'auto',marginLeft:"10%" , marginRight:"10%"}} /></p>
                <p>Breed: {dog.breed}</p>
                <p>Age: {dog.age}</p>
                <p>Description: {dog.description}</p>
              </Card>
            </Col>
          ))
        )}
      </Row>
      <Modal
        title={isEditing ? 'Edit Dog' : 'Add Dog'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          onFinish={onFinish}
          initialValues={currentDog}
        >
         
            <Form.Item name="id">
              <Input type="hidden" />
            </Form.Item>
           
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the dog\'s name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="breed"
            label="Breed"
            rules={[{ required: true, message: 'Please input the dog\'s breed!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: 'Please input the dog\'s age!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the dog\'s description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="image" label="Image">
            <ImageUpload setImageFilename={setImageFilename} />
          </Form.Item>
          
          <Form.Item>
            <Button htmlType="submit">
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default ManageDog;
