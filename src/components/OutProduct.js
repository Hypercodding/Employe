import { useEffect, useState } from 'react';
import ProData from './ProData';

const Company = () => {
    //set state to update data
  const [proData, setproData] = useState([]);

  const loadData = () => {
    fetch("http://localhost:3500/api/product/get") 
    .then(resp => resp.json())
     .then(data => setproData(data))
  }
  
    useEffect(loadData, []);
  
  return (
    <>
    <ProData ProData={proData} loadData={loadData}/>
    

    </>
  )
}

export default Company
