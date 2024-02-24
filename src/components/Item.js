import { useEffect, useState } from 'react';
import ItemData from './ItemData';

const Item = () => {
    //set state to update data
  const [itemData, setItemData] = useState([]);

  //loadData or refresh Data
  const loadData = () => {
    fetch("http://localhost:3500/api/item/getItem") 
    .then(resp => resp.json())
     .then(data => setItemData(data))
  }
  
  
    useEffect(loadData, []);
  
  return (
    <>
    <ItemData ItemData={itemData} loadData={loadData}/>
    </>
  )
}

export default Item
