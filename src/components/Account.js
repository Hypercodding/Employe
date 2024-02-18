import { useEffect, useState } from 'react';
import AccountData from './AccountData';

const Account = () => {
    //set state to update data
  const [accountData, setAccountData] = useState([]);

  const loadData = () => {
    fetch("http://localhost:3500/api/account/getAccount") 
    .then(resp => resp.json())
     .then(data => setAccountData(data))
  }
  
    useEffect(loadData, []);
  
  return (
    <>
    
    <AccountData AccountData={accountData} loadData={loadData}/>
    

    </>
  )
}

export default Account
