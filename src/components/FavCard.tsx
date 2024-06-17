// FavPage.tsx

import React, { useEffect, useState } from 'react';
import { Spin, Card, Row, Col, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getFav } from '../services/dog.service'; // Adjust this based on your service file

const { Text } = Typography;

const FavCard: React.FC = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchFavorites();
  }, []);

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
                actions={[
                  <Link to={`/dogList/${id}`}>View Dog</Link> // Issue: Empty `to` prop
                  // <Link to={`/remove/${dog.id}`}>Remove</Link>, // Optional: Uncomment if needed
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
