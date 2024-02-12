import { useEffect, useState } from 'react';

import SalData from './SalData';

const Salary = () => {
    //set state to update data
  const [salData, setsalData] = useState([]);

  const loadData = () => {
    fetch("http://localhost:3500/api/salary/") 
    .then(resp => resp.json())
     .then(data => setsalData(data))
  }
  
    useEffect(loadData, []);
  
  return (
    <>
    <SalData SalData={salData} loadData={loadData}/>
    
    

    </>
  )
}


//Route 3: get


export default Salary
