import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './common/http-common';
import { getCurrentUser } from "../services/auth.service";
import { Form, Input, Button } from 'antd';

const AddDog: React.FC = () => {
  
  const [dog, setDog] = useState({ name: '', age: 0, breed: '', description:'', imageUrl: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  console.log('current user' + JSON.stringify(currentUser))
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDog({ ...dog, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      console.log('Submitting dog:', dog); // Debug statement

      // Make POST request to add dog
      const response = await api.post('api/v1/dogs', dog);

      // Check if the request was successful
      if (response.status === 200) {
        console.log('Dog added successfully:', response.data); // Debug statement
        navigate('/dogs'); // Navigate to dogs page on success
      } else {
        // Handle unexpected response status
        console.error('Unexpected response:', response);
        setError('Failed to add dog. Please try again.');
      }
    } catch (error) {
      // Handle errors from the API request
      console.error('Error adding dog:', error);
      setError('Failed to add dog. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input type="text" name="name" value={dog.name} onChange={handleChange} placeholder="Name" required />
        <Input type="number" name="age" value={dog.age} onChange={handleChange} placeholder="Age" required />
        <Input type="text" name="breed" value={dog.breed} onChange={handleChange} placeholder="Breed" required />
        <Input type="text" name="description" value={dog.description} onChange={handleChange} placeholder="description" required />
        <Input type="text" name="imageUrl" value={dog.imageUrl} onChange={handleChange} placeholder="Image URL" required />
        <Button type="primary" htmlType="submit" className="login-form-button">
          Register
        </Button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddDog;
