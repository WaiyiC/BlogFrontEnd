import 'antd/dist/reset.css';
import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import api from './common/http-common';
import PostIcon from './posticon';
import EditForm from './EditForm';
import { getCurrentUser } from '../services/auth.service';

const PetShelter: React.FC = () => {
  const [dogs, setDogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDogs = async () => {
      console.log('Fetching dogs...');
      try {
        const response = await api.get('api/v1/dogs');
        console.log('API response:', response);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setDogs(response.data);
        } else {
          console.log('No dogs found in the response');
        }
      } catch (error) {
        console.error('Error fetching dogs:', error);
      } finally {
        setLoading(false);
        console.log('Loading state set to false');
      }
    };

    fetchDogs();
  }, []);

  if (loading) {
    console.log('Loading state is true');
    const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
    return (<Spin indicator={antIcon} />);
  }

  if (!dogs.length) {
    console.log('No dogs available to display');
    return (<div>There are no dogs available now.</div>);
  }

  console.log('Rendering dogs:', dogs);
  return (
    <Row gutter={[16, 16]} style={{ marginLeft: "15px" }}>
      {dogs.map(({ id, name, breed, age, description, imageurl, ownerid }) => (
        <Col key={id}>
          <Card title={name} style={{ width: 300 }}
            cover={<img alt="example" src={imageurl} />} hoverable
            actions={[
              <PostIcon type="like" countLink={`/dogs/${id}/likes`} id={id} />,
              
              <PostIcon type="heart" FavLink={`/dogs/${id}/favorites`} id={id} />,
              ownerid === getCurrentUser()?.id && <EditForm isNew={false} aid={id} />
            ]}>
            <p>Breed: {breed}</p>
            <p>Age: {age}</p>
            <p>Description: {description}</p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PetShelter;