import 'antd/dist/reset.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Col, Card, Form, Input, message, List } from 'antd';
import { RollbackOutlined, LoadingOutlined, CloseSquareOutlined, CloseSquareFilled } from '@ant-design/icons';
import { getCurrentUser } from "../services/auth.service";
import { commentDogs } from "../services/dog.service";
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

  const fetchDogDetails = async () => {
    try {
      const [dogResponse, commentsResponse] = await Promise.all([
        api.get(`/dogs/${id}`),
        api.get(`/dogs/${id}/comment`) // Assuming endpoint for fetching comments
      ]);

      setDog(dogResponse.data);
      setLoading(false);

      // Fetch usernames for each comment
      const commentPromises = commentsResponse.data.map((comment: any) =>
        api.get(`/users/${comment.userid}`)
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

  useEffect(() => {
    fetchDogDetails();
  }, [id]);

  const handleCommentSubmit = async (values: CommentT) => {
    const userid = getCurrentUser()?.id;
    const dogid = parseInt(id);
    const { messagetxt } = values;

    if (!userid) {
      message.error("You must be logged in to comment.");
      return;
    }

    setSubmittingComment(true);
    try {
      await commentDogs(dogid, userid, messagetxt);
      message.success("Comment submitted successfully.");
      fetchDogDetails(); // Refresh comments after submission
    } catch (error) {
      message.error("Error submitting comment.");
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
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
        <Card
          title={dog.name}
          style={{ width: "90%", marginLeft: "5%", marginRight: "5%" }}
        >
          <div>
            <p><img style={{ width: '40%', height: 'auto', marginLeft:"10%" , marginRight:"10%"}}
              src={`https://a9cae81d-c094-4635-9860-14e886ff26fe-00-1n32cs1xece6w.pike.replit.dev:3000/api/v1/images/${dog.image}`}/></p>
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
              rules={[{ required: true, message: 'Please enter your comment' }]}
            >
              <Input placeholder="Comment" />
            </Form.Item>
            <Form.Item>
              <Button
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
