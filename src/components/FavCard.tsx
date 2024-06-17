import 'antd/dist/reset.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Col, Row, Spin } from 'antd';
import axios from 'axios';
import { LoadingOutlined, CloseSquareOutlined, CloseSquareFilled } from '@ant-design/icons';
import PostIcon from './posticon';
import Displaycomment from './comments';
import { api } from './common/http-common';

const FavCard = (props: any) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('outlined');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const results = await api.get(`/api/v1/fav`);
        console.log('API results:', results.data);
        setArticles(results.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (fav: any) => {
    setTheme('filled');
    try {
      const response = await axios.delete(fav.links.fav, {
        headers: {
          "Authorization": `Basic ${localStorage.getItem('aToken')}`
        }
      });
      if (response.data.message === "removed") {
        alert("This article is removed from your favorite list");
        navigate("/favpage");
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting favorite:', error);
      alert("Check network problems");
    }
  };

  if (loading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
    return <Spin indicator={antIcon} />;
  } else {
    if (!articles.length) {
      return <div>There is no article available now.</div>;
    } else {
      const Icon = getIcon(theme);
      return (
        <>
          <Row gutter={[16, 16]}>
            {articles.map(({ id, title, alltext, imageurl, links }) => (
              <Col key={id}>
                <Card
                  title={title}
                  style={{ width: 300 }}
                  cover={<img alt="example" src={imageurl} />}
                  hoverable
                  actions={[
                    <PostIcon type="like" countLink={links.likes} id={id} />,
                    <Displaycomment msgLink={links.msg} id={id} />,
                    <PostIcon type="heart" />,
                    <Icon onClick={() => handleDelete({ links })} />
                  ]}
                >
                  <Link to={`/${id}`}>Details</Link>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      );
    }
  }
};

function getIcon(theme: string) {
  return theme === 'filled' ? CloseSquareFilled : CloseSquareOutlined;
}

export default FavCard;
