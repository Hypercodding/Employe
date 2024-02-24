import { useEffect, useState } from 'react';
import InventoryData from './InventoryData';

const Inventory = () => {
    //set state to update data
  const [inventory, setInventory] = useState([]);

  const loadData = () => {
    fetch("http://localhost:3500/api/inventory/getInventory") 
    .then(resp => resp.json())
     .then(data => setInventory(data))
  }
  
    useEffect(loadData, []);
  
  return (
    <>
    <InventoryData InventoryData={inventory} loadData={loadData}/>

    </>
  )
}

export default Inventory
