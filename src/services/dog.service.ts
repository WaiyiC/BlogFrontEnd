import axios from 'axios';
import { api } from '../components/common/http-common';
import { Buffer } from 'buffer';


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
  return axios.get(api.uri, "/", { headers: authHeader() });
};

export const addDog = async (name: string, breed: string, age: number, description: string, image: string) => {
  try {
    const response = await api.post("dogs/", { name, breed, age: Number(age), description, image }, { headers: authHeader() });
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

export const editDog = async (id:number ,name: string, breed: string, age: number, description: string, image: string) => {
  
console.log(id,name, breed, age, description, image);
  try {
    const response = await api.put(`/dogs/${id}`, { name, breed, age, description, image},{ headers: authHeader() });
    return response.data;
  } catch (error) {
    throw new Error(`Error editing dog: ${error.message}`);
  }
};

export const deleteDog = async (id: number) => {
  try {
  
    const response = await api.delete(`/dogs/${id}`, {
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

export const searchDogsByBreed = async (breed: string) => {
  try {
    const response = await api.get(`/breed/${breed}`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    console.error('Error searching dogs by breed:', error);
    throw error;
  }
};

// Function to search dogs by age
export const searchDogsByAge = async (age: number) => {
  try {
    const response = await axios.get(`/age/${age}`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    console.error('Error searching dogs by age:', error);
    throw error;
  }
};

export const likeDogs = async (id: number, userid: number) => {
  try {
    const dog = await getDogById(id);
    const response = await api.post(`/dogs/${id}/likes`, { userid }, { headers: authHeader() });
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

export const dislikeDogs = async (id: number) => {
  try {
    const response = await api.delete(`/dogs/${id}/likes`, { headers: authHeader() });
    return response.data;
      } catch (error) {
        throw error;
      }
    };

export const commentDogs = async (id: number, userid: number, messagetxt: string) => {
  try {
    console.log(id, userid, messagetxt);
    const response = await api.post(`/dogs/${id}/comment`, { userid,messagetxt }, { headers: authHeader() });
    return response.data; // Assuming server responds with a meaningful success message or data
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

export const getDogById = async (id: number) => {
  try {
    const response = await api.get(`/dogs/${id}`, { headers: authHeader() });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const getLikeById = async (id: number) => {
  try {
    const response = await api.get({id}, { headers: authHeader() });

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


export const addFavorite = async (userId: number, dogId: number) => {
  try {
   
    const response = await api.post(`/dogs/${dogId}/fav`, { userId, dogId }, { headers: authHeader() });
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

export const getFav = () => {
  return api.get(`/dogs/fav`, { headers: authHeader() });
};

export const unFav = async (id: number) => {
  try {
    const response = await api.delete(`/dogs/${id}/fav`, { headers: authHeader() });
    return response.data;
      } catch (error) {
        throw error;
      }
    };
