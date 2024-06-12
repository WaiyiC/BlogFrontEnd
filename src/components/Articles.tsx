import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import api from './common/http-common';
import PostIcon from './posticon';
import EditForm from './EditForm';
import { getCurrentUser } from '../services/auth.service';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticles = async () => {
      console.log('Fetching dogs...');
      try {
        const response = await api.get('/api/v1/articles');
        console.log('API response:', response);
          setArticles(response.data);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      } finally {
        setLoading(false);
        console.log('Loading state set to false');
      }
    };

      fetchArticles();
  }, []);

  if (loading) {
    console.log('Loading state is true');
    const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
    return (<Spin indicator={antIcon} />);
  }

  if (!articles.length) {
    console.log('No dogs found');
    return (<div>There are no dogs available now.</div>);
  }

  console.log('Rendering dogs:', articles);
  return (
    <Row gutter={[16,16]} style={{marginLeft:"15px"}}>
      {
        articles.map(({id, title, summary,imageurl, links})=> (
        <Col key={id}>                                          
         <Card title={title} style={{width: 300}}
               cover={<img alt="example" src={imageurl} />} hoverable
               actions={[
                <PostIcon type="like" countLink={links.likes} id={id} />,
                
                <PostIcon type="heart" FavLink={links.fav} id={id}/>

              ]} 
               >               
              <p>summary: {summary}</p>
              
            </Card>

          </Col>
        ))
      }
    </Row>
  );
};

export default Articles;