import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Spin, Tooltip, Modal, Form, Input, Button, message } from 'antd';
import { LoadingOutlined, PlusOutlined, HeartOutlined, HeartFilled, MessageOutlined } from '@ant-design/icons';
import LikeT from "../types/likes.type";
import { BrowserRouter as Router, Link } from 'react-router-dom';
import api from './common/http-common';
import PostIcon from './posticon';
import EditForm from './EditForm';
import { getCurrentUser } from '../services/auth.service';
import { likeDogs,dislikeDogs, checkUserLiked  } from "../services/dog.service";
import { getDogById } from "../services/dog.service";
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DogList: React.FC = () => {
  const [dogs, setDogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [likeLoading, setLikeLoading] = useState<number | null>(null); // Track loading state for likes
  const [isCommentModalVisible, setIsCommentModalVisible] = useState<boolean>(false);
  const [commentedDogId, setCommentedDogId] = useState<number | null>(null);
  const [userLikedDogs, setUserLikedDogs] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const token = localStorage.getItem("token");
  const { id: dogid } = useParams();

  

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === 'admin','user') {
      setCurrentUser(user);
      fetchDogs();
    }
    }, []);

  const fetchDogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/dogs', {
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

  
  const handleLike = async (id: number) => {
    const userid = getCurrentUser().id;
    console.log(id);
    console.log('u:',userid, 'd:',id);
  if (!id || !userid) {
      console.error('Missing dogid or userid', { id, userid});
      return;
    }
  try {
      setLikeLoading(id);
      const likedDogId = await likeDogs(id, userid);
      console.log('Liked Dog ID:', likedDogId);

      // Update localStorage to reflect that the user has liked this dog
      localStorage.setItem(`liked_${likedDogId}`, 'true');

      updateDogList(id, { likes: dogs.find(dog => dog.id === id)?.likes + 1 }); // Update likes count locally
      setUserLikedDogs(prevLikedDogs => [...prevLikedDogs, id]); // Mark dog as liked by the current user
    } catch (error) {
      console.error('Error liking dog:', error);
    } finally {
      setLikeLoading(null);
    }
  };

  const handleDislike = async (id: number) => {
    const userid = getCurrentUser()?.id;

    if (!userid) {
      console.error('Missing user id');
      return;
    }

    try {
      await dislikeDogs(id, userid);
      message.success('Disliked successfully');
      fetchDogs(); // Refresh the dog list after successful dislike
    } catch (error) {
      console.error('Error disliking dog:', error);
      message.error('Failed to dislike dog');
    }
  };

  const handleComment = (id: number) => {
    setCommentedDogId(id);
    setIsCommentModalVisible(true);
  };

  const handleCommentSubmit = async (values: any) => {
    const { comment } = values;
    const id = commentedDogId;

    try {
      // Simulate backend API call to submit comment (replace with actual API call)
      console.log(`Submitting comment for dog with ID: ${id}, Comment: ${comment}`);
      // Replace the following with your actual API endpoint for commenting on a dog
      // const response = await api.post(`/api/v1/dogs/${id}/comment`, { comment });

      // Example: Display success message (assuming response includes success indicator)
      message.success('Comment submitted successfully');
    } catch (error) {
      console.error('Error submitting comment:', error);
      message.error('Failed to submit comment');
    } finally {
      setIsCommentModalVisible(false);
      setCommentedDogId(null);
    }
  };

  const updateDogList = (id: number, updatedDog: any) => {
    setDogs(prevDogs =>
      prevDogs.map(dog =>
        dog.id === id ? { ...dog, ...updatedDog } : dog
      )
    );
  };
  
  if (loading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
    return (<Spin indicator={antIcon} />);
  }

  if (!dogs.length) {
    return (<div>There are no dogs available now.</div>);
  }

  return (
    <Row gutter={[16, 16]} style={{ marginLeft: "15px" }}>
     
      {dogs.map(({ id, name, breed, age, description, imageurl, ownerid, likes }) => (
        <Col key={id}>
          <Card
            title={name}
            style={{ width: 300 }}
            cover={<img alt="example" src={imageurl} />}
            hoverable
                        actions={[
                          <Tooltip title={userLikedDogs.includes(id) ? "Dislike" : "Like"}>
                            {likeLoading === id ? (
                              <LoadingOutlined />
                            ) : (
                              <>
                                {userLikedDogs.includes(id) ? (
                                  <HeartFilled style={{ color: 'red' }} key="like" onClick={() => handleDislike(id)} />
                                ) : (
                                  <HeartOutlined key="like" onClick={() => handleLike(id)} />
                                )}
                                {likes}
                              </>
                            )}
              </Tooltip>,
              <Tooltip title="Comment">
                <MessageOutlined key="comment" onClick={() => handleComment(id)} />
              </Tooltip>,
              ownerid === getCurrentUser()?.id && <EditForm isNew={false} aid={id} />
            ]}
          >
            <p>Breed: {breed}</p>
            <p>Age: {age}</p>
            <p>Description: {description}</p>
          </Card>
        </Col>
      ))}
      <Modal
        title="Add Comment"
        visible={isCommentModalVisible}
        onCancel={() => setIsCommentModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleCommentSubmit}>
          <Form.Item
            name="comment"
            rules={[{ required: true, message: 'Please enter your comment!' }]}
          >
            <Input.TextArea placeholder="Enter your comment" rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Row>
  );
};

export default DogList;
