import { useEffect, useState } from 'react';
import CmpData from './CmpData';

const Company = () => {
    //set state to update data
  const [cmpData, setcmpData] = useState([]);

  const loadData = () => {
    fetch("http://localhost:3500/api/company/getCmp") 
    .then(resp => resp.json())
     .then(data => setcmpData(data))
  }
  
    useEffect(loadData, []);
  
  return (
    <>
    <CmpData CmpData={cmpData} loadData={loadData}/>
    

    </>
  )
}

export default Company
