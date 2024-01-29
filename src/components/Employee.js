import { useEffect, useState } from 'react';
import Emp from './Emp';

const Employee = () => {
    //set state to update data
  const [emp, setEmp] = useState([]);

  const loadData = () => {
    fetch("http://localhost:3500/api/emp/fetchallemp") 
    .then(resp => resp.json())
     .then(data => setEmp(data))
  }
  
    useEffect(loadData, []);
  
  return (
    <>
    <Emp Emp={emp} loadData={loadData}/>

    </>
  )
}

export default Employee
