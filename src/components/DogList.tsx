import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Spin, Tooltip, Modal, Form, Input, Button, message, Typography, Select, Table } from 'antd'; // Import Table and Select
import { LoadingOutlined, HeartOutlined, HeartFilled, MessageOutlined } from '@ant-design/icons';
import { getCurrentUser } from '../services/auth.service';
import { likeDogs, dislikeDogs } from "../services/dog.service";
import EditForm from './EditForm';
import api from './common/http-common';
import { NavigateFunction, useNavigate } from 'react-router-dom';


const { Column } = Table;
const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

const DogList: React.FC = () => {
  const [dogs, setDogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [likeLoading, setLikeLoading] = useState<number | null>(null); // Track loading state for likes
  const [isCommentModalVisible, setIsCommentModalVisible] = useState<boolean>(false);
  const [commentedDogId, setCommentedDogId] = useState<number | null>(null);
  const [userLikedDogs, setUserLikedDogs] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchType, setSearchType] = useState<string>("all");
  const [searchValue, setSearchValue] = useState<string>("");
  const [isSearchOK, setSearchOK] = useState<boolean>(false);
  const [dogsData, setSearchedDogs] = useState<any[]>([]);
  const [press, setPress] = useState<string>("");

  const token = localStorage.getItem("token");
  let navigate: NavigateFunction = useNavigate();

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
    if (!id || !userid) {
      console.error('Missing dogid or userid', { id, userid });
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

  const handleSearch = async () => {
    let urlPath = '/api/v1/dogs';

    if (searchType === "breed") {
      urlPath += `/breed/${searchValue}`;
    } else if (searchType === "age") {
      urlPath += `/age/${searchValue}`;
    } else if (searchType === "all" && searchValue === "") {
      urlPath += `/`;
    }

    try {
      const response = await api.get(urlPath);
      if (!response.data.length || response.data.length === 0) {
        message.info("No data found");
        navigate("/profile");
      } else {
        setSearchedDogs(response.data);
        setSearchOK(true);
      }
    } catch (error) {
      console.error('Error fetching dogs:', error);
    }
  };

  function handleChange(value: any) {
    message.info("Please enter the breed or age of the dog to search");
    setPress(value);
    console.log(`selected ${value}`);
  }

  if (loading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
    return <Spin indicator={antIcon} />;
  }

  return (
    <Row gutter={[16, 16]} style={{ marginLeft: "15px" }}>
      <Col span={16}>
        <Title level={3} style={{ color: "#0032b3" }}>Dog List</Title>
        <Title level={5}>Find your favorite dog</Title>
        <Search placeholder="Search Dogs"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={handleSearch} />
        <Select defaultValue="all" style={{ width: 280, marginRight: '200px' }} onChange={handleChange}>
          <Option value="all">All</Option>
          <Option value="breed">Breed</Option>
          <Option value="age">Age</Option>
        </Select>

        {isSearchOK ? (
          <Table dataSource={dogsData}>
            <Column title="ID" dataIndex="id" key="id" />
            <Column title="Name" dataIndex="name" key="name" />
            <Column title="Breed" dataIndex="breed" key="breed" />
            <Column title="Age" dataIndex="age" key="age" />
            <Column title="Description" dataIndex="description" key="description" />
          </Table>
        ) : (
          dogs.map(({ id, name, breed, age, description, imageurl, ownerid, likes, likedByCurrentUser }) => (
            <Card
              key={id}
              title={name}
              style={{ width: 300, marginBottom: 16 }}
              cover={<img alt="example" src={imageurl} />}
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
              <p>Breed: {breed}</p>
              <p>Age: {age}</p>
              <p>Description: {description}</p>
            </Card>
          ))
        )}

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
      </Col>
    </Row>
  );
};

export default DogList;
