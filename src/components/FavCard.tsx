// FavPage.tsx

import React, { useEffect, useState } from 'react';
import { Spin, Card, Row, Col, Typography, message, Button, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getFav, unFav } from '../services/dog.service'; // Adjust this based on your service file

const { Text } = Typography;

const FavCard: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchFavorites = async () => {
    try {
      const response = await getFav(); // Assuming getFav fetches favorite dogs
      console.log('Favorites:', response.data); // Verify the response structure
      setFavorites(response.data); // Assuming response.data is an array of favorite dogs
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
      
    fetchFavorites();
  }, []);



  
  const handleUnFavourit = async (id: number) => {
    console.log(token);
    console.log(id);
    try {
      await unFav(id);
      message.success('Dog deleted successfully');
          fetchFavorites(); // Refresh the dog list after successful deletion
    } catch (error) {
      console.error('Error deleting dog:', error);
      message.error('Failed to delete dog');
    }
  };

  if (loading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
    return <Spin indicator={antIcon} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {favorites.length === 0 ? (
          <Text>No favorite dogs found.</Text>
        ) : (
          favorites.map(({id, name, breed, age, description, imageurl}) => (
            <Col key={id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                title={name}
                cover={<img alt="dog" src={imageurl} style={{ height: 200, objectFit: 'cover' }} />}
                extra={[
                  <>
                  <Link to={`/dogList/${id}`}>View Dog</Link> 

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
                          handleUnFavourit(id);
                        },
                      });
                    }}
                  >Delete
              </Button>
                  </>
                ]}
              >
              
                <p>Breed: {breed}</p>
                <p>Age: {age}</p>
                <p>Description: {description}</p>
              </Card>

            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default FavCard;
