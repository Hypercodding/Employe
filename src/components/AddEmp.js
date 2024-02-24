import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from 'primereact/checkbox';

 
const AddEmp = () => {
    let navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('http://localhost:3500/api/company/');
                if (response.ok) {
                    const json = await response.json();
                    setCompanies(json);
                }
            } catch (error) {
                console.error('Error fetching companies:', error.message);
            }
        };

        fetchCompanies();
    }, []);

    const validate = (data) => {
        let errors = {};

        if (!data.name) {
            errors.name = 'Name is required.';
        }

        if (!data.cnic) {
            errors.cnic = 'CNIC Required.';
        }

        if (!data.phoneNumber) {
            errors.phoneNumber = 'Number Required.';
        }

        if (!data.designation) {
            errors.designation = 'Designation Required.';
        }

        if (!data.salary) {
            errors.salary = 'Salary Required.';
        }

        return errors;
    };

    const onSubmit = async (data, form) => {
        setFormData(data);
        setShowMessage(true);
        console.log('Request Body:', data);

        const { name, cmpId,overTime, dateOfBirth, gender, salary, cnic, designation, dateOfHiring, employeeStatus, phoneNumber } = data;

        try {
            var response = await fetch("http://localhost:3500/api/employee/addemployee", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, cmpId,overTime, dateOfBirth, gender, salary, cnic, designation, dateOfHiring, employeeStatus, phoneNumber })
            });
        } catch (error) {
            console.error('Network error:', error.message);
        }

        if (response.ok) {
            const json = await response.json();
            console.log(json);

            // Reset the form
            form.restart();
            navigate('/employee');
        }

        form.restart();
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = (
        <div className="flex justify-content-center">
            <Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} />
        </div>
    );

    const genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];

    const statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'InActive', value: 'InActive' },
    ];

    return (
        
        <div className="flex items-center justify-center h-screen w-8 px-8">
            
            <div className="p-grid p-fluid rounded-lg p-p-4 bg-white " style={{
        
        alignItems: 'center',
        
      }}>
                
                <Form   onSubmit={onSubmit} initialValues={{ name: '', cmpId: '',overTime: false, salary: '', phoneNumber: '', dateOfHiring: null, dateOfBirth: null, employeeStatus: null, cnic: '', designation: '', date: null, gender: null }} validate={validate} render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="p-fluid">
                        <div className="formgroup-inline justify-content-center px-8 mt-2">
                            <div className="field col-12 md:col-5 ">
                                <Field name="name" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="name" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Name*</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                </div>
                                <div className="field col-12 md:col-5">
                                <Field name="salary" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="salary" {...input}  className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="salary" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Salary*</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                
                                </div>
                                <div className="field col-10 md:col-5 ">

                                <Field name="designation" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="designation" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="designation" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Designation*</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                            </div>
                                <div className="field col-12 md:col-5">
                                <Field
                                    name="cnic"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <InputText
                                                    id="cnic"
                                                    {...input}
                                                    className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                                />
                                                <label htmlFor="cnic" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                                                    CNIC*
                                                </label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                </div>
                                <div className="field col-10 md:col-5 ">
                                    <Field
                                        name="cmpId"
                                        render={({ input, meta }) => (
                                            <div className="field">
                                                <span className="p-float-label">
                                                    <Dropdown id="cmpId" {...input} options={companies} optionLabel="name" optionValue="_id" />
                                                    <label htmlFor="cmpId" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                                                        Company*
                                                    </label>
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="field col-10 md:col-5 ">

                                <Field name="employeeStatus" render={({ input }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <Dropdown id="employeeStatus" {...input} options={statusOptions} optionLabel="label" />
                                            <label htmlFor="employeeStatus">Status</label>
                                        </span>
                                    </div>
                                )} />
                                </div>
                                
                                
                                <div className="field col-10 md:col-5">

                                <Field name="dateOfBirth" render={({ input }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <Calendar id="dateOfBirth" {...input} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                                            <label htmlFor="dateOfBirth">Date of Birth</label>
                                        </span>
                                    </div>
                                )} />
                              </div>
                                <div className="field col-10 md:col-5 ">
                                <Field name="dateOfHiring" render={({ input }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <Calendar id="dateOfHiring" {...input} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                                            <label htmlFor="dateOfHiring">Date of Hire</label>
                                        </span>
                                    </div>
                                )} />
                                  </div>
                                  <div className="field col-10 md:col-5">
                                <Field
                                    name="phoneNumber"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <InputText
                                                    id="phoneNumber"
                                                    {...input}
                                                    className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                                />
                                                <label htmlFor="phoneNumber" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                                                    Number*
                                                </label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                 </div>
                                <div className="field col-10 md:col-5 ">

                                <Field name="gender" render={({ input }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <Dropdown id="gender" {...input} options={genderOptions} optionLabel="label" />
                                            <label htmlFor="gender">Gender</label>
                                        </span>
                                    </div>
                                )} />
                                </div>
                                <div className="field col-10 md:col-6 col-offset-3 ">
                                <Field
                                name="overTime"
                                render={({ input }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <Checkbox
                                                inputId="overTime"
                                                {...input}
                                                checked={input.value || false} // Ensure a default value of false
                                                onChange={(e) => input.onChange(e.checked)}
                                            />
                                            <label htmlFor="overTime" className="ml-3">Overtime Applied</label>
                                        </span>
                                    </div>
                                )}
                                />
                            </div>
                            </div>
                                <div className="field col-10 md:col-6 col-offset-3 ">
                            
                        <Button type="submit" label="Submit" className=" mx-auto  " />
                        </div>
                    </form>
                )} />
            </div>
        </div>
    );
};

export default AddEmp;
