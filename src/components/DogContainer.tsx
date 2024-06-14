import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import api from './common/http-common';
import SearchDog from './dogSearch';
import DogList from './DogList';

const DogContainer: React.FC = () => {
  const [dogs, setDogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await api.get('/api/v1/dogs', {
          headers: { "Authorization": `Basic ${localStorage.getItem('aToken')}` }
        });
        setDogs(response.data);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDogs();
  }, []);

  const handleSearch = async (searchType: string, value: any) => {
    let urlPath = `/dogs`;

    if (searchType === "breed") {
      urlPath += `/breed/${value}`;
    } else if (searchType === "age") {
      urlPath += `/age/${value}`;
    } else if (searchType === "all" && value === "") {
      urlPath += `/`;
    }

    try {
      const response = await api.get(urlPath, {
        headers: { "Authorization": `Basic ${localStorage.getItem('aToken')}` }
      });

      if (!response.data.length || response.data.length === 0) {
        alert("No data found");
      } else {
        setDogs(response.data);
      }
    } catch (error) {
      console.log("Error fetching dogs", error);
    }
  }

  return (
    <Row gutter={[16, 16]} style={{ marginLeft: "15px" }}>
      <Col span={24}>
        <SearchDog onSearch={handleSearch} />
      </Col>
      <Col span={24}>
        <DogList dogs={dogs} loading={loading} />
      </Col>
    </Row>
  );
}

export default DogContainer;
