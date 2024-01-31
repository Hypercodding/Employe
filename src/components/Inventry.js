// components/Inventry.jsx
import React, { useEffect, useState } from 'react';
import Inventry_item from './Inventry_item';

const Inventry = () => {
  const [items, setItems] = useState([]);

  const loadData = () => {
    fetch("http://localhost:3500/api/items/getItems") 
      .then(resp => resp.json())
      .then(data => {
        console.log(data); // Log the data here

        setItems(data)});
      
  };

  useEffect(loadData, []);

  return (
    <>
      <Inventry_item Items={items} loadData={loadData} />
    </>
  );
}

export default Inventry;
