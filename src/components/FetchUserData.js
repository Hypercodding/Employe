import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const FetchUserData = () => {
    
  const [userData, setUserData] = useState(null);

  const onSubmit = async (data, form) => {
    try {
      const response = await fetch('http://localhost:3500/api/emp/getEmpByCnic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnic: data.cnic }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const fetchedUserData = await response.json();
      setUserData(fetchedUserData);
    } catch (error) {
      console.error('Network error:', error.message);
    }
  };

  const downloadPdf = async () => {
    try {
      const response = await fetch('http://localhost:3500/api/emp/getEmpByCnicAsPdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cnic: userData.cnic }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Convert the response to a blob and create a URL
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create a link and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Employee_${userData.cnic}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Network error:', error.message);
    }
  };

  return (
    <div>
      <div className="card flex justify-content-center text-center mt-2 ">
        <Card title="Employee Data" subTitle="Enter CNIC to get Employee" className="md:w-25rem">
          {userData && (
            <div>
              <h2>User Data:</h2>
              <p><b>Name: </b> {userData.name}</p>
              <p><b>cnic: </b> {userData.cnic}</p>
              <p><b>Gender: </b> {userData.gender}</p>
              <p><b>Company: </b> {userData.cmp.name}</p>
              <p><b>Salary: </b> {userData.leave_balance > 4 ? userData.salary - (userData.leave_balance * 10) : userData.salary}</p>
              <p><b>Leaves: </b> {userData.leave_balance - 4}</p>
              <p><b>Number: </b> {userData.phone_number}</p>
              <p><b>Job Title: </b> {userData.job_title}</p>
            </div>
          )}
          <Form onSubmit={onSubmit} initialValues={{ cnic: '' }} render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="p-field">
                <Field name="cnic" component="input" type="text" />
              </div>
              <Button type="submit" label="Fetch" className="md:w-5rem mt-2" />
            </form>
          )} />
          {userData && (
            <Button type="button" label="Download PDF" className="md:w-10rem mt-2" onClick={downloadPdf} />
          )}
        </Card>
      </div>
    </div>
  );
};

export default FetchUserData;
