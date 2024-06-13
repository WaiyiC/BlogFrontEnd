  import React, { useState, useEffect } from 'react';
  import { Card, Col, Row, Spin, Button, Modal, Form, Input, message, Upload } from 'antd';
  import { LoadingOutlined } from '@ant-design/icons';
  import axios from 'axios';
  import { getCurrentUser } from "../services/auth.service";
import DogT from "../types/dog.type";
import { addDog, deleteDog,getDogById } from "../services/dog.service";
import { api } from '../components/common/http-common';


  const ManageDog: React.FC = () => {
    const [dogs, setDogs] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [currentDog, setCurrentDog] = useState<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    
    const API_URL = 'https://a9cae81d-c094-4635-9860-14e886ff26fe-00-1n32cs1xece6w.pike.replit.dev:3000/api/v1/dogs';
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
        const response = await axios.get(API_URL, {
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
      const { name, breed, age, description, imageurl } = values;
      console.log(token);
    addDog(name, breed, age, description,imageurl).then(
        (response) => {

          window.alert("success")
          console.log(response.data);

        })
        .catch((error) => {
                   window.alert(error)
           console.log(error.toString());

        }
      );
    };


    const handleUpdateDog = async (values: DogT) => {
      try {
        await axios.put(`${API_URL}/${currentDog.id}`, values, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        message.success('Dog updated successfully');
        setIsModalVisible(false);
        setCurrentDog(null);
        fetchDogs();
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
    
    const showModal = (dog: any = null) => {
      setCurrentDog(dog);
      setIsEditing(!!dog);
      setIsModalVisible(true);
    };

    return (
      <div>
        <Button type="primary" onClick={() => showModal()}>Add Dog</Button>
        <Row gutter={[16, 16]} style={{ marginTop: "15px" }}>
          {loading ? <Spin indicator={<LoadingOutlined />} /> : (
            dogs.map(dog => (
              <Col key={dog.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={dog.name}
                  extra={
                    <>
                      <Button type="primary" onClick={() => showModal(dog)}>Edit</Button>
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
            onFinish={isEditing ? handleUpdateDog : handleAddDog}
            initialValues={currentDog}
          >
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
            <Form.Item
              name="imageurl"
              label="imageurl"
              rules={[{ required: true, message: 'Please input the dog\'s photo!' }]}
            >
              <Input type="string" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {isEditing ? 'Update' : 'Add'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  export default ManageDog;
