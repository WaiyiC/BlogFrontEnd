import 'antd/dist/reset.css';
import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, Space } from 'antd';
import { LoginOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from "../services/auth.service";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const onFinish = async (values: any) => {
    const { username, password } = values;

    setMessage("");
    setLoading(true);

    try {
      const response = await login(username, password);
      if (response) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
        console.log(localStorage.getItem("token"));
        navigate("/profile");
        window.location.reload();
      }
    } catch (error) {
      console.error('Login failed:', error);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <Title level={3} style={{ textAlign: "center" }}>Welcome Blogger</Title>
      <Form
        style={{ margin: "5px" }}
        name="normal_login"
        layout="vertical"
        wrapperCol={{ span: 24 }}
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Checkbox>Remember me</Checkbox>
            <Link to="/forgot-password">Forgot password</Link>
          </Space>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Log in <LoginOutlined />
          </Button>
          <Text>Or <Link to="/register">register now!</Link></Text>
        </Form.Item>
      </Form>
      {message && <Text type="danger">{message}</Text>}
    </div>
  );
};

export default Login;