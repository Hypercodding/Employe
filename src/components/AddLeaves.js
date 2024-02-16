import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';


const AddLeave = ({employees, onSubmit, loadData }) => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    days: 0,
    month: 0,
    isDeducted: true,
  });

  let navigate = useNavigate();
  const monthOptions = [
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
    // Add more months as needed
  ];
  
  const [employee, setEmployee] = useState([]);

  useEffect(() => {
    // Fetch the list of companies when the component mounts
    const fetchEmployee = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/employee/empplyeeName');
        if (response.ok) {
          const json = await response.json();
          setEmployee(json);
        }
      } catch (error) {
        console.error('Error fetching Employee:', error.message);
      }
    };

    fetchEmployee();
  }, []);

  const monthNameToNumber = {
    'January': '1',
    'February': '2',
    'March': '3',
    'April': '4',
    'May': '5',
    'June': '6',
    'July': '7',
    'August': '8',
    'September': '9',
    'October': '10',
    'November': '11',
    'December': '12',
  };

  const handleSubmit = async (data, form) => {
    setFormData(data);
    console.log('Request Body:', data);

    const {  employeeId, startDate, endDate, isDeducted } = data;

    try {
      var response = await fetch("http://localhost:3500/api/leave/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, startDate, endDate, isDeducted })

      });

    } catch (error) {
      console.error('Network error:', error.message);
    }
    if (response.ok) {
      const json = await response.json();
      console.log(json);
      setVisible(false);
      // Reset the form
      form.restart();
      loadData()
      navigate('/Leaves');
    }

  };

  return (
    <>
      <Button label="Add Leave" icon="pi pi-plus" onClick={() => setVisible(true)} />

      <Dialog
        header="Add Leave"
        visible={visible}
        style={{ width: '300px' }}
        onHide={() => setVisible(false)}
        breakpoints={{ '960px': '80vw' }}
      >
        <Form
          onSubmit={handleSubmit}
          initialValues={{ employeeId: '', days: 0, month: '1', isDeducted: true }}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="p-fluid">
              <Field
  name="employeeId"
  render={({ input, meta }) => (
    <div className="field">
      <span className="p-float-label">
        <Dropdown id="employeeId" {...input} options={employee} optionLabel={(option) => `${option.name} - ${option.designation}`} optionValue="_id" />
        <label htmlFor="employeeId">
          Employee*
        </label>
      </span>
      {/* {getFormErrorMessage(meta)} */}
    </div>
  )}
/>
<Field name="startDate" render={({ input }) => (
  <div className="field">
      <span className="p-float-label">
          <Calendar id="startDate" {...input} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
          <label htmlFor="startDate">Start Date</label>
      </span>
  </div>
)} />

<Field name="endDate" render={({ input }) => (
  <div className="field">
      <span className="p-float-label">
          <Calendar id="endDate" {...input} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
          <label htmlFor="endDate">End Date</label>
      </span>
  </div>
)} />
              
              <div className="p-mt-4">
                <Button label="Submit" onClick={handleSubmit} className="p-button-success mt-3" />
                <Button label="Cancel" onClick={() => setVisible(false)} className="p-button-secondary p-ml-2 mt-2" />
              </div>
            </form>
          )}
        />
      </Dialog>
    </>
  );
};

export default AddLeave;
