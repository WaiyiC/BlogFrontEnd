import 'antd/dist/reset.css';
import { Layout, Space, Button, Typography } from 'antd';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import * as AuthService from "./services/auth.service";
import UserT from './types/user.type';
import Login from "./components/Login";
import Register from "./components/Register";
import EventBus from "./components/common/EventBus";
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Profile from './components/Profile';
import FavPage from './components/favpage';
import FavCard from './components/FavCard';

import DogList from './components/DogList';
import AddDog from './components/AddDog';
import DogDetail from './components/DetailDog';

import ManageDog from './components/manageDog';
import { LogoutOutlined, HomeOutlined, DashboardOutlined, InfoCircleOutlined, StarFilled } from '@ant-design/icons';


const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserT | undefined>(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }

    EventBus.on("logout", handleLogout);

    return () => {
      EventBus.remove("logout", handleLogout);
    };
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    return <Navigate to="/" />;
  };
  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await AuthService.login(username, password);
      if (response) {
        localStorage.setItem("user", JSON.stringify(response.user));
        setCurrentUser(response.user);
        // Navigate to the profile or dashboard page
        navigate('/profile');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login failure
    }
  };

  return (
    <Router>
      <Layout>
        <Header  style={{backgroundColor: "#4A4A4A"}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Space>
                <Link to="/" >
                  <HomeOutlined style={{ fontSize: '32px', color: '#5ADCC6' }} />
                </Link>
                <Link to="/dashboard">
                  <DashboardOutlined style={{ fontSize: '32px', color: '#5ADCC6' }} />
                </Link>
                <Link to="/doglist">
                  <InfoCircleOutlined style={{ fontSize: '32px', color: '#5ADCC6' }} />
                </Link>
              </Space>
            </div>
            <div>
              {currentUser ? (
                <Space>
                  <Link to="/profile">
                    <Title level={5} style={{ color: '#5ADCC6' }}>{currentUser.username}</Title>
                  </Link>
                  {currentUser.role === 'admin' && (
                    <Link to="/managedog" >
                      <Title level={5} style={{ color: '#5ADCC6' }}>
                      Manage Dogs</Title>
                    </Link>
                  )}
                  <Link to="/favcard">
                    <StarFilled style={{ fontSize: '20px', color: '#5ADCC6' }} />
                  </Link>
                    <LogoutOutlined style={{ fontSize: '20px', color: '#5ADCC6' }} />
                    <Link to="/login" onClick={handleLogout} ><Title level={5} style={{ color: '#5ADCC6' }}>
                      </Title></Link>
                 
                </Space>
              ) : (
                <Space>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </Space>
              )}
            </div>
          </div>
        </Header>
        
        <Content>
          <Routes>             
            <Route index element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />}  />  
            <Route path="/about" element={<About />}  />        
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />          
            <Route path="/login" element={<Login />} />
            <Route path="/favcard" element={<FavCard />} />

            <Route path="/favpage" element={<FavPage />} />	          
              <Route path="/dogList" element={<DogList />} />
              <Route path="/dogList/:id" element={<DogDetail />} />
            <Route path="/AddDog" element={<AddDog />} />
            <Route path="/manageDog" element={<ManageDog />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Footer content</Footer>
      </Layout>
    </Router>
  );
};

export default App;
