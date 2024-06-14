import axios from 'axios';
import { api } from '../components/common/http-common';
import { Buffer } from 'buffer';

const API_URL = 'https://a9cae81d-c094-4635-9860-14e886ff26fe-00-1n32cs1xece6w.pike.replit.dev:3000/api/v1/dogs';

const authHeader = () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Authorization header created');
      return { 'Authorization':  token };
    } else {
      console.warn('No token found in localStorage');
      return {};
    }
  } catch (error) {
    console.error('Error retrieving token from localStorage', error);
    return {};
  }
};


export const getAllDogs = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

export const addDog = async (name: string, breed: string, age: number, description: string, imageUrl: string) => {
  try {
    const response = await api.post(API_URL, { name, breed, age: Number(age), description, imageUrl }, { headers: authHeader() });
    return response.data; // Assuming server responds with a meaningful success message or data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error);
      // Optionally handle and re-throw the error to propagate it further
      throw error;
    } else {
      console.error('Unknown error:', error);
      // Handle other types of errors (not AxiosError) if needed
      throw error;
    }
  }
};

export const likeDogs = async (id: number, userid: number) => {
  try {
    const dog = await getDogById(id);
    const response = await api.post(`${API_URL}/${id}/likes`, { userid }, { headers: authHeader() });
    return response.data; // Assuming server responds with a meaningful success message or data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error);
      // Optionally handle and re-throw the error to propagate it further
      throw error;
    } else {
      console.error('Unknown error:', error);
      // Handle other types of errors (not AxiosError) if needed
      throw error;
    }
  }
};

export const dislikeDogs = async (id: number, userid: number) => {
  try {
    const response = await api.delete(`/api/v1/dogs/${id}/likes`, { headers: authHeader() });
    return response.data;
    return response.data;
      } catch (error) {
        throw error;
      }
    };


const handleAxiosError = (error: AxiosError) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error('Request failed with status code', error.response.status);
    console.error('Response data:', error.response.data); // This contains the detailed error message from the server
    // Example: Extract error details from the response
    const errorDetails = error.response.data;
    console.error('Error details:', errorDetails);
    // Example: Show error message in UI (replace with your actual UI logic)
    alert(`Validation error: ${errorDetails.message}`);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error setting up the request:', error.message);
  }
  console.error('Error config:', error.config);
};

export const updateDog = (id: number, dog: any) => {
  return axios.put(`${API_URL}/${id}`, dog, { headers: authHeader() });
};

export const getDogById = async (id: number) => {
  try {
    const response = await api.get(API_URL,{id}, { headers: authHeader() });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error);
      throw error;
    } else {
      console.error('Unknown error:', error);
      throw error;
    }
  }
};

export const getLikeById = async (id: number) => {
  try {
    const response = await api.get(API_URL , {id}, { headers: authHeader() });

    console.log(response)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error);
      throw error;
    } else {
      console.error('Unknown error:', error);
      throw error;
    }
  }
};

export const deleteDog = async (id: number) => {
  try {
    // Fetch the dog by its ID first
    const dog = await getDogById(id);
    console.log('Dog to delete:', dog);

    // Now perform the delete operation
    const response = await api.delete(`${API_URL}/${id}`, {
      headers: authHeader()
    });

    return response.data; // Assuming server responds with a meaningful success message or data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error);
      // Optionally handle and re-throw the error to propagate it further
      throw error;
    } else {
      console.error('Unknown error:', error);
      // Handle other types of errors (not AxiosError) if needed
      throw error;
    }
  }
};

