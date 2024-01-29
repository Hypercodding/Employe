import React, { useState } from 'react';
import empContext from './empContext';

const EmpStates = (props) => {
  const empInit=[
    {
      "_id": "65aff93f8faff0056b0c90d0",
      "user": "65af850e23176b5d5961eb6f",
      "name": "harry",
      "dob": "1990-01-01T00:00:00.000Z",
      "gender": "Male",
      "cnic": "1234567890123",
      "job_title": "Developer",
      "department": "IT",
      "date_of_hire": "2022-01-01T00:00:00.000Z",
      "employee_status": "Active",
      "phone_number": "123-456-7890",
      "leave_balance": 199,
      "employee_photo": "a",
      "__v": 0
    },
    {
      "_id": "65aff9518faff0056b0c90d3",
      "user": "65af850e23176b5d5961eb6f",
      "name": "hammad",
      "dob": "1990-01-01T00:00:00.000Z",
      "gender": "Male",
      "cnic": "1234567890123",
      "job_title": "Developer",
      "department": "IT",
      "date_of_hire": "2022-01-01T00:00:00.000Z",
      "employee_status": "Active",
      "phone_number": "123-456-7890",
      "leave_balance": 199,
      "employee_photo": "a",
      "__v": 0
    },
    {
      "_id": "65b25da15c6627acfae35a07",
      "user": "65af850e23176b5d5961eb6f",
      "name": "hammad",
      "dob": "1990-01-01T00:00:00.000Z",
      "gender": "Male",
      "cnic": "1234567890123",
      "job_title": "Developer",
      "department": "IT",
      "date_of_hire": "2022-01-01T00:00:00.000Z",
      "employee_status": "Active",
      "phone_number": "123-456-7890",
      "leave_balance": 199,
      "employee_photo": "a",
      "__v": 0
    }
  ]


  const [emps, setEmp] = useState(empInit);
  

  return (
    <empContext.Provider value={{emps, setEmp}}>
      {props.children}
    </empContext.Provider>
  );
};

export default EmpStates;
