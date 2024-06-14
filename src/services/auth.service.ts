import axios from "axios";
import { api } from '../components/common/http-common';
import { Buffer } from 'buffer';
              
export const register = async (username: string, email: string, password: string, actiCode: string) => {
  // Log the URL to verify it's correctly formed
  console.log('Register URL:', `/api/v1/users`);
  return await api.post(`/api/v1/users`, {
    username,
    email,
    password,
    actiCode,  
  });
};


export const login = async (username: string, password: string) => {
  console.log('username '+ username)
  console.log('password '+ password)
  const access_token: string = `Basic ${Buffer.from(`${username}:${password}`, 'utf8').toString('base64')}`;

  console.log('access_token '+ access_token)
  let data = '';
  let path:string = "https://a9cae81d-c094-4635-9860-14e886ff26fe-00-1n32cs1xece6w.pike.replit.dev:3000/api/v1/users/login";  
console.log('path '+ path)
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: path,
    headers: {
      'Authorization': `${access_token}`,
    },
    data: '',
  };

  console.log('config', JSON.stringify(config, null, 2));
  
try {
    const response = await axios.request(config);
    console.log('Login response:', response.data);
    return { user: response.data, token: access_token };
  } catch (error) {
    console.error('Error during login:', error);
    if (error.response) {
      console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('General error message:', error.message);
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("aToken");
  localStorage.removeItem("a");
  localStorage.removeItem("e");
  
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};
