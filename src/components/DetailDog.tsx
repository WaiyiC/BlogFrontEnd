import 'antd/dist/reset.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Col, Card, Form, Input, message,List } from 'antd';
import axios from 'axios';
import { RollbackOutlined, LoadingOutlined, CloseSquareOutlined, CloseSquareFilled } from '@ant-design/icons';
import { getCurrentUser } from "../services/auth.service";
import { commentDogs  } from "../services/dog.service";
import EditForm from './EditForm';
import { api } from './common/http-common';
import CommentT from "../types/comment.type";

const DogDetail: React.FC = () => {
  const currentUser = getCurrentUser();
  const { id } = useParams<{ id: string }>();
  const [dog, setDog] = useState<any>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('outlined');
  const [comments, setComments] = useState<any[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const token = localStorage.getItem("token");
  const [isCommentModalVisible, setIsCommentModalVisible] = useState<boolean>(false);
  const [isCommentLoading, setIsCommentLoading] = useState<boolean>(false);
  const [commentedDogId, setCommentedDogId] = useState<number | null>(null);
  useEffect(() => {
    // Fetch dog details including comments
    const fetchDogDetails = async () => {
      try {
        const [dogResponse, commentsResponse] = await Promise.all([
          api.get(`/api/v1/dogs/${id}`),
          api.get(`/api/v1/dogs/${id}/comment`) // Assuming endpoint for fetching comments
        ]);

        setDog(dogResponse.data);
        setLoading(false);

        // Fetch usernames for each comment
        const commentPromises = commentsResponse.data.map((comment: any) =>
          api.get(`/api/v1/users/${comment.userid}`)
        );

        const usernames = await Promise.all(commentPromises);
        const updatedComments = commentsResponse.data.map((comment: any, index: number) => ({
          ...comment,
          username: usernames[index].data.username
        }));

        setComments(updatedComments);
      } catch (error) {
        console.error('Error fetching dog details:', error);
      }
    };

    fetchDogDetails();
  }, [id]);

  
  const handleComment = (id: number) => {
    console.log('Setting commentedDogId:', id);
    setCommentedDogId(id);
    setIsCommentModalVisible(true);
  }; 


  const handleCommentSubmit =  (values: CommentT) => {
    let userid = getCurrentUser()?.id;
    let dogid = parseInt(id);
      const {messagetxt } = values;
    console.log(token);
    console.log('u:', userid);
    console.log('dog:', id);
    console.log('comment:', messagetxt);
      commentDogs(dogid, userid, messagetxt).then(
        (response) => {

          window.alert("success")
          window.location.reload();

        })
        .catch((error) => {
                   window.alert(error)
           console.log(error.toString());

        }
      );
    };
    
  const getIcon = (theme: string) => {
    return theme === 'filled' ? CloseSquareFilled : CloseSquareOutlined;
  };

  
  if (loading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
    return <Spin indicator={antIcon} />;
  }

  if (!dog) {
    return <div>Dog not found</div>;
  }

  const Icon = getIcon(theme);

  return (
    <>
      <h2>Dog Details</h2>
      <Col span={24}>
        <Card title={dog.name} style={{ width: "90%", marginLeft: "5%", marginRight: "5%" }}
          cover={<img alt="dog" src={dog.imageurl} />} hoverable
        >
          <div>
            <h3>Breed</h3>
            <p>{dog.breed}</p>
            <h3>Age</h3>
            <p>{dog.age}</p>
            <h3>Description</h3>
            <p>{dog.description}</p>
          </div>
          <Form onFinish={handleCommentSubmit}>
            <Form.Item
              name="messagetxt"
              placeholder="Comment"

            >
              <Input />
            </Form.Item>
            <Form.Item>
              
              <Button
                onClick={() => handleComment(dog.id)}
                htmlType="submit"
                loading={submittingComment}
              >
                Submit Comment
              </Button>
            </Form.Item>
          </Form>

          <h3>Comments</h3>
          <List
            dataSource={comments}
            renderItem={(item) => (
              <List.Item>
                <p>{item.messagetxt}</p>
                <p>Comment by: {item.username}</p>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </>
  );
};

export default DogDetail;
