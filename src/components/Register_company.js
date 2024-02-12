import React, {  useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
        

export const Register_company = () => {
    let navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const [company, setCompany] = useState([]);
    useEffect(() => {
        // Fetch the list of companies when the component mounts
        const fetchCompany = async () => {
          try {
            const response = await fetch('http://localhost:3500/api/auth/userName');
            if (response.ok) {
              const json = await response.json();
              setCompany(json);
            }
          } catch (error) {
            console.error('Error fetching Employee:', error.message);
          }
        };
    
        fetchCompany();
      }, []);


    const validate = (data) => {
        let errors = {};

        if (!data.name) {
            errors.name = 'Name is required.';
        }
        

        
        return errors;
    };

    const onSubmit = async (data, form) => {
        // event.preventDefault(); // Add this line to prevent the default form submission behavior
    
        setFormData(data);
        const { name, companyStatus, managerId} = data;
    
        try {
            var response = await fetch("http://localhost:3500/api/company/create", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, companyStatus, managerId })
            });
            console.log('Backend response:', response);
    
        } catch (error) {
            console.error('Network error:', error.message);
        }
    
        if (response && response.ok) {
            const json = await response.json();
            console.log('JSON response:', json);
    
            // Reset the form
            form.restart();
    
            navigate('/company'); // Ensure this is the correct route
        }
    
        form.restart();
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false) } /></div>;
  
    const statusOption = [
        { label: 'Active', value: 'Active' },
        { label: 'InActive', value: 'InActive' },
    ]
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
                    <h5 className="text-center">Register Company</h5>
                    <Form onSubmit={onSubmit} initialValues={{ name: '', companyStatus: '', managerId: ''}} validate={validate} render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="p-fluid">
                                    <div className="p-grid p-formgrid">
            <div className="p-col">
                        <Field
                            name="managerId"
                            render={({ input, meta }) => (
                                <div className="field">
                                <span className="p-float-label">
                                    <Dropdown id="manager" {...input} options={company} optionLabel={(option) => `${option.firstName}  ${option.lastName}`} optionValue="_id" />
                                    <label htmlFor="manager">
                                    Manager*
                                    </label>
                                </span>
                                {/* {getFormErrorMessage(meta)} */}
                                </div>
                            )}
                        />
                        <Field
                            name="companyStatus"
                            render={({ input, meta }) => (
                                <div className="field">
                                <span className="p-float-label">
                                    <Dropdown id="companyStatus" {...input} options={statusOption} optionLabel="label" />
                                    <label htmlFor="companyStatus">
                                    Status*
                                    </label>
                                </span>
                                {/* {getFormErrorMessage(meta)} */}
                                </div>
                            )}
                        />

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
                            
                            
                            </div>
                           
                            <Button type="submit" label="Submit" className="mt-2" />
                        </form>
                    )} />
                </div>
            </div>
        </div>
    );
}