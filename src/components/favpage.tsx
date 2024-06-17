import 'antd/dist/reset.css';
import '../App.css';
import FavCard from './FavCard'
import React, { useEffect, useState } from 'react';


const FavPage = ({ userId }: { userId: number }) => {
  const [favoriteDogs, setFavoriteDogs] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const favorites = await fetchFavorites(userId);
      setFavoriteDogs(favorites);
    };

    loadFavorites();
  }, [userId]);

  const handleAddFavorite = async (dogId: number) => {
    await addFavorite(userId, dogId);
    const updatedFavorites = await fetchFavorites(userId);
    setFavoriteDogs(updatedFavorites);
  };

  return (
    <div>
      <h2>Favorite Dogs</h2>
      <ul>
        {favoriteDogs.map((dog) => (
          <li key={dog.id}>{dog.name}</li>
        ))}
      </ul>
      <h3>Add a Dog to Favorites</h3>
      {/* Add the logic to list dogs and a button to add them to favorites */}
      {/* For example, assuming you have a list of all dogs */}
      {allDogs.map((dog) => (
        <div key={dog.id}>
          <span>{dog.name}</span>
          <button onClick={() => handleAddFavorite(dog.id)}>Add to Favorites</button>
        </div>
      ))}
    </div>
  );
};

export default FavPage;
