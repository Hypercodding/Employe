import { useEffect, useState } from 'react';
import LoanData from './LoansData';

const Leaves = () => {
    //set state to update data
  const [loanData, setLoanData] = useState([]);

  const loadData = () => {
    fetch("http://localhost:3500/api/loan/loan") 
    .then(resp => resp.json())
     .then(data => setLoanData(data))
  }
  
    useEffect(loadData, []);
  
  return (
    <>
    <LoanData LoanData={loanData} loadData={loadData}/>
    

    </>
  )
}

export default Leaves
