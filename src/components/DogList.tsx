import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Spin, Tooltip, Input, Typography } from 'antd';
import { LoadingOutlined, HeartOutlined, HeartFilled, StarOutlined, StarFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from './common/http-common';
import { getCurrentUser } from '../services/auth.service';
import { likeDogs, dislikeDogs, addFavorite } from "../services/dog.service";

const { Search } = Input;
const { Title } = Typography;

const DogList: React.FC = () => {
  const [dogs, setDogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [likeLoading, setLikeLoading] = useState<number | null>(null);
  const [favLoading, setFavLoading] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [breedFilter, setBreedFilter] = useState<string>('');
  const [ageFilter, setAgeFilter] = useState<number | null>(null);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await api.get('/dogs');
        const dogsWithLikes = response.data.map((dog: any) => ({
          ...dog,
          likes: dog.likes || [],
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


  const handleAddToFavorites = async (id: number) => {
    const userid = getCurrentUser().id;
    if (!id || !userid) {
      console.error('Missing dogid or userid', { id, userid });
      return;
    }
    setFavLoading(id);
    try {
      await addFavorite(userid, id);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    } finally {
      setFavLoading(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    filterDogs(value.trim(), breedFilter, ageFilter);
  };

  const handleBreedFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBreedFilter(e.target.value);
    filterDogs(searchQuery, e.target.value, ageFilter);
  };

  const handleAgeFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const age = value === '' ? null : parseInt(value, 10);
    setAgeFilter(isNaN(age) ? null : age);
    filterDogs(searchQuery, breedFilter, isNaN(age) ? null : age);
  };

  const filterDogs = (search: string, breed: string, age: number | null) => {
    let filteredDogs = dogs.filter(dog =>
      (search === '' || dog.name.toLowerCase().includes(search.toLowerCase())) &&
      (breed === '' || dog.breed.toLowerCase().includes(breed.toLowerCase())) &&
      (age === null || dog.age === age)
    );

    setDogs(filteredDogs);
  };

  if (loading) {
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />;
  }

  return (
      <Row gutter={[16, 16]} style={{ marginTop: "15px" }}>
      <Col>
        <Title level={3} style={{ color: "#0032b3" }}>Find Your Favorite Dogs</Title>
        <Row justify="center" gutter={[16, 32]} style={{ marginLeft: "5%", marginRight: "5%" }}>
          <Col span={12}>
            <Search placeholder="Search dogs by name" onSearch={handleSearch} enterButton />
          </Col>
          <Col span={6}>
            <Input placeholder="Filter by Breed" value={breedFilter} onChange={handleBreedFilterChange} />
          </Col>
          <Col span={6}>
            <Input type="number" placeholder="Filter by Age" value={ageFilter || ''} onChange={handleAgeFilterChange} />
          </Col>
          {dogs.length === 0 ? (
            <div>No dogs available</div>
          ) : (
            dogs.map(({ id, name, breed, age, description, image, likes, likedByCurrentUser }) => (
              <Col key={id}  xs={24} sm={12} md={8} lg={6}>
                  <Card
                    title={name}
                    style={{height: 400 }}
                  actions={[
                    <Tooltip title={likedByCurrentUser ? "Dislike" : "Like"}>
                      {likeLoading === id ? (
                        <LoadingOutlined />
                      ) : likedByCurrentUser ? (
                        <HeartFilled style={{ color: '#FE8BCF' }} key="like" onClick={() => handleDislike(id)} />
                      ) : (
                        <HeartOutlined style={{ color: 'gray' }} key="like" onClick={() => handleLike(id)} />
                      )}
                    </Tooltip>,
                    <Tooltip title={"Add to Favorites"}>
                      {favLoading === id ? (
                    
                        <StarFilled style={{ color: '#5ADCC6' }} key="favorite"  />
                      ) : (
                        <StarOutlined style={{ color: 'gray' }} key="favorite" onClick={() => handleAddToFavorites(id)} />
                      )}
                    </Tooltip>,
                  ]}
                >
                  <Link to={`/dogList/${id}`}>
                    <p><img src={`https://a9cae81d-c094-4635-9860-14e886ff26fe-00-1n32cs1xece6w.pike.replit.dev:3000/api/v1/images/${image}`} alt="dog" style={{ width: '50%', height: 'auto',marginLeft:"10%" , marginRight:"10%"}} /></p>
                    <p>Breed: {breed}</p>
                    <p>Age: {age}</p>
                    <p style={{ height: 50 }}>Description: {description}</p>
                  </Link>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default DogList;
