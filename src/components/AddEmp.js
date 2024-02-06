import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
// import { CountryService } from '../services/CountryService';
// import './FormDemo.css';

import { InputMask } from 'primereact/inputmask';
import { useNavigate } from 'react-router-dom';
        
export const AddEmp = () => {
    let navigate = useNavigate();
    const [gender, setGender] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});



    const validate = (data) => {
        let errors = {};

        if (!data.name) {
            errors.name = 'Name is required.';
        }
        
        if (!data.cnic) {
            errors.cnic = 'CNIC Required.';
        }

        if (!data.phone_number) {
            errors.phone_number = 'CNIC Required.';
        }

        if (!data.job_title) {
            errors.job_title = 'Title Required.';
        }
       
        if (!data.department) {
            errors.department = 'Department Required.';
        }

        if (!data.salary) {
            errors.salary = 'Department Required.';
        }
        
        return errors;
    };

    const onSubmit = async(data, form) => {
        setFormData(data);
        setShowMessage(true);
        const { name,cmpName,salary, gender, phone_number,cnic, department, dob, date_of_hire, job_title } = data;

        try {
            var response = await fetch("http://localhost:3500/api/emp/addemp", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name,cmpName,salary, gender, phone_number,cnic, department, dob, date_of_hire, job_title })
            });

            
        } catch (error) {
            console.error('Network error:', error.message);
        }
        if (response.ok) {
            const json = await response.json();
            console.log(json);

            // Reset the form
            form.restart();
            ;
            
            navigate('/employee')
        }


        form.restart();
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false) } /></div>;
  
    //gender options
    const genderOptions = [
      
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'other' },
      ];

      const statusOptions = [
      
        { label: 'Active', value: 'active' },
        { label: 'Inacive', value: 'Inactive' },
        
      ];
    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Registration Successful!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Your account is registered under name <b>{formData.name}</b> ; it'll be valid next 30 days without activation. Please check <b>{formData.email}</b> for activation instructions.
                    </p>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card ">
                    <h5 className="text-center">Register</h5>
                    <Form onSubmit={onSubmit} initialValues={{ name: '',  cmpName: '',salary: '', department: '',phone_number: '', date_of_hire: null, employee_status: null,   cnic: '', job_title: '', date: null, gender: null}} validate={validate} render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="p-fluid">
                                    <div className="p-grid p-formgrid">
                              <div className="p-col">

                            <Field name="name" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="name" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Name*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field name="cmpName" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="cmpName" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="cmpName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Company*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            </div>
                            <Field name="salary" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="salary" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="salry" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Salary*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field name="job_title" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="job_title" {...input}  className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="job_title" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Job Title*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field name="department" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="department" {...input}  className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="department" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Department*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field name="employee_status" render={({ input }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Dropdown id="employee_status" {...input}  options={statusOptions} optionLabel="label" />
                                        <label htmlFor="employee_status">Status</label>
                                    </span>
                                </div>
                            )} />
                            <Field
                            name="cnic"
                            render={({ input, meta }) => (
                              <div className="field">
                                <span className="p-float-label">
                                  <InputText
                                    id="cnic"
                                    {...input}
                                    // autoFocus
                                    // onBlur={onBlur}
                                    className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                    // mask="99999-9999999-9"
                                  />
                                  <label htmlFor="cnic" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                                    CNIC*
                                  </label>
                                </span>
                                {getFormErrorMessage(meta)}
                              </div>
                            )}
                          />
                          <Field
                            name="phone_number"
                            render={({ input, meta }) => (
                              <div className="field">
                                <span className="p-float-label">
                                  <InputText
                                    id="phone_number"
                                    {...input}
                                    
                                    // onBlur={onBlur}
                                    className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                    // mask="999-9999999"
                                  />
                                  <label htmlFor="phone_number" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                                    Number*
                                  </label>
                                </span>
                                {getFormErrorMessage(meta)}
                              </div>
                            )}
                          />
                            <Field name="dob" render={({ input }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Calendar id="dob" {...input} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                                        <label htmlFor="dob">Date of Birth</label>
                                    </span>
                                </div>
                            )} />
                            <Field name="date_of_hire" render={({ input }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Calendar id="date_of_hire" {...input} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                                        <label htmlFor="date_of_hire">Date of Hire</label>
                                    </span>
                                </div>
                            )} />
                            <Field name="gender" render={({ input }) => (
                            <div className="field">
                                <span className="p-float-label">
                                    <Dropdown id="gender" {...input} options={genderOptions} optionLabel="label" />
                                    <label htmlFor="country">Gender</label>
                                </span>
                            </div>
                            )} />
                            </div>
                           
                            <Button type="submit" label="Submit" className="mt-2" />
                        </form>
                    )} />
                </div>
            </div>
        </div>
    );
}