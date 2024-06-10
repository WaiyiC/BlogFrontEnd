import React, { useState, useEffect } from 'react';
import api from './common/http-common';

const TestApiConnection: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await api.get('/test');
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Failed to connect to API');
      }
    };

    fetchMessage();
  }, []);

  return (
    <div>
      <h1>API Connection Test</h1>
      <p>{message}</p>
    </div>
  );
};

export default TestApiConnection;