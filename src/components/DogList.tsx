import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Spin, Tooltip, Modal, Form, Input, Button, message, Typography } from 'antd';
import { LoadingOutlined, PlusOutlined, HeartOutlined, HeartFilled, MessageOutlined } from '@ant-design/icons';
import LikeT from "../types/likes.type";
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import api from './common/http-common';
import PostIcon from './posticon';
import EditForm from './EditForm';
import { getCurrentUser } from '../services/auth.service';
import { likeDogs,dislikeDogs, checkUserLiked  } from "../services/dog.service";
import { getDogById } from "../services/dog.service";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SearchDog from './dogSearch'
import DogDetail from './DetailDog';

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
  const { Title } = Typography;
  
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await api.get('/api/v1/dogs');
        const dogsWithLikes = response.data.map((dog: any) => ({
          ...dog,
          likes: dog.likes || [], // Ensure likes is always an array
          likedByCurrentUser: Array.isArray(dog.likes) && dog.likes.some((like: any) => like.userid === getCurrentUser().id)
        }));
        setDogs(dogsWithLikes);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      } finally {
        setLoading(false);
      }
    };
      const user = getCurrentUser();
      setCurrentUser(user);
      fetchDogs();
    }, []);
  
  const handleLike = async (id: number) => {
    const userid = getCurrentUser().id;
    console.log(id);
    console.log('u:',userid, 'd:',id);
  if (!id || !userid) {
      console.error('Missing dogid or userid', { id, userid});
      return;
    }

      setLikeLoading(id);
      try {
        await likeDogs(id, userid);
        setDogs((prevDogs) =>
          prevDogs.map((dog) =>
            dog.id === id ? { ...dog, likedByCurrentUser: true, likes: [...dog.likes, { userid }] } : dog
          )
        );
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
    setLikeLoading(id);
    try {
      await dislikeDogs(id, userid);
      setDogs((prevDogs) =>
        prevDogs.map((dog) =>
          dog.id === id
            ? { ...dog, likedByCurrentUser: false, likes: dog.likes.filter((like: any) => like.userid !== userid) }
            : dog
        )
      );
    } catch (error) {
      console.error('Error disliking dog:', error);
    } finally {
      setLikeLoading(null);
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
     console.log(`Submitting comment for dog with ID: ${id}, Comment: ${comment}`);
      message.success('Comment submitted successfully');
    } catch (error) {
      console.error('Error submitting comment:', error);
      message.error('Failed to submit comment');
    } finally {
      setIsCommentModalVisible(false);
      setCommentedDogId(null);
    }
  };

  
  
  if (loading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
    return (<Spin indicator={antIcon} />);
  }

  if (!dogs.length) {
    return (<div>There are no dogs available now.</div>);
  }

  return (
    <Row style={{ marginTop: "50px" }}>
      <Col >
        <Title level={3} style={{ color: "#0032b3" }}>Find Your Favorite Dogs</Title>
      <Row justify="center" gutter={[16, 16]} style={{ marginLeft: "5%" ,marginRight: "5%" }}>
     

      {dogs.map(({ id, name, breed, age, description, imageurl, ownerid, likes, likedByCurrentUser }) => (
      
          <Col key={id} xs={24} sm={12} md={8} lg={8} xl={8}>
             
          <Card
            title={name}
            style={{ width: 350, height: 300}}
            cover={<img alt="example" src={imageurl} />}
            hoverable
                actions={[
                  <Tooltip title={likedByCurrentUser ? "Dislike" : "Like"}>
                    {likeLoading === id ? (
                      <LoadingOutlined />
                    ) : likedByCurrentUser ? (
                      <HeartFilled style={{ color: 'red' }} key="like" onClick={() => handleDislike(id)} />
                    ) : (
                      <HeartOutlined key="like" onClick={() => handleLike(id)} />
                    )}
                    {likes.length}
              </Tooltip>,
              <Tooltip title="Comment">
                <MessageOutlined key="comment" onClick={() => handleComment(id)} />
              </Tooltip>,
              ownerid === getCurrentUser()?.id && <EditForm isNew={false} aid={id} />
            ]}
          >
            <Link to={`/dogList/${id}`}>
            <p>Breed: {breed}</p>
            <p>Age: {age}</p>
            <p style={{height: 50}}>Description: {description}</p>
             </Link></Card>
            
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
      </Col>
    </Row>
      
  );
};

export default DogList;
