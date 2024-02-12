import { useEffect, useState } from 'react';
import LeavesData from './LeavesData';
import AddLeave from './AddLeaves';

const Leaves = () => {
    //set state to update data
  const [leavesData, setLeavesData] = useState([]);

  const loadData = () => {
    fetch("http://localhost:3500/api/leave/leaves") 
    .then(resp => resp.json())
     .then(data => setLeavesData(data))
  }
  
  
    useEffect(loadData, []);
  
  return (
    <>
    <LeavesData LeavesData={leavesData} loadData={loadData}/>
    


    </>
  )
}

export default Leaves
