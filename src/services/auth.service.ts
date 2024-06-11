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
  const access_token:string = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
  console.log('access_token '+ access_token)
  let data = '';
  let path:string = "api/v1/users/login";  
  console.log('path '+ path)
  let config = {
         method: 'post',
         maxBodyLength: Infinity,
         url: path,
         headers: { 
           'Authorization': `Basic Y3ljaGVuZzo2NTQzMjE=`
          // 'Authorization': 'Basic Y3ljaGVuZzo2NTQzMjE='
         },
         data : data
       };
  console.log('config '+ config);

  await axios.request(config).then((response) => {
         console.log('response from server ' + JSON.stringify(response.data));
         localStorage.setItem("aToken",access_token), 
         localStorage.setItem("users", JSON.stringify(response.data));
     return response.data  })
   
          
    
} 


export const logout = () => {
  localStorage.removeItem("users");
  localStorage.removeItem("aToken");
  localStorage.removeItem("a");
  localStorage.removeItem("e");
  
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("users");
  if (userStr) return JSON.parse(userStr);

  return null;
};
