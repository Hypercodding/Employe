import React, {  useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


export const Signin = () => {
    //naviagte 
    let navigate = useNavigate();
    
    //show message on submit
    const [showMessage, setShowMessage] = useState(false);
    
    //setting form
    const [formData, setFormData] = useState({});

    //velidating data
    const validate = (data) => {
        let errors = {};

        if (!data.firstName) {
            errors.firstName = 'First Name is required.';
        }

        if (!data.phoneNumber) {
            errors.phoneNumber = 'phoneNumber is required.';
        }
        

        if (!data.password) {
            errors.password = 'Password is required.';
        }
        

        

        return errors;
    };

    // submitting form
    const onSubmit = async (data, form) => {
        setFormData(data);
        setShowMessage(true);
        const { firstName, lastName,phoneNumber, password,role,companyName } = data;

        try {
            var response = await fetch("http://localhost:3500/api/auth/createUser", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName,phoneNumber, password,role,companyName })
            });

            
        } catch (error) {
            console.error('Network error:', error.message);
        }
        if (response.ok) {
            const json = await response.json();
            console.log(json);

            // Reset the form
            form.restart();
            localStorage.setItem('token', json.authData);
        
            navigate('/signin')
        }

        form.restart();
    };
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false) } /></div>;
    const passwordHeader = <h6>Pick a password</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Registration Successful!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Your account is registered under Phone Number <b>{formData.phoneNumber}</b>.
                    </p>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card">
                    <h4 className="text-center">USER REGISTRATION</h4>
                    <Form onSubmit={onSubmit} initialValues={{ firstName: '', lastName: '', phoneNumber: '', password: '',role: '' }} validate={validate} render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="p-fluid">
                            <Field name="firstName" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="firstName" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="firstName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>First Name*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field name="lastName" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="lastName" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="lastName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Last Name*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field
                                name="role"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <Dropdown
                                                id="role"
                                                {...input}
                                                options={[
                                                    { label: 'Admin', value: 'Admin' },
                                                    { label: 'Manager', value: 'Manager' },
                                                ]}
                                            />
                                            <label htmlFor="role" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                                                Role*
                                            </label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field name="phoneNumber" render={({ input, meta }) => (
                            <div className="field">
                                <span className="p-float-label p-input-icon-right">
                                    <PhoneInput
                                        inputProps={{
                                            name: 'phoneNumber',
                                            required: true, // Add any other input props you may need
                                        }}
                                        placeholder="Enter phone number"
                                        {...input}
                                        country={'PK'}
                                    />
                                    <label htmlFor="phoneNumber" className={classNames({ 'p-error': isFormFieldValid(meta) })}></label>
                                </span>
                                {getFormErrorMessage(meta)}
                            </div>
                        )} />


    
                            <Field name="password" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Password id="password" {...input} toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })} header={passwordHeader} footer={passwordFooter} />
                                        <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Password*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                           <Field name="companyName" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="companyName" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="companyName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Company Name*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                           
                         

                            <Button type="submit" label="Submit" className="mt-2" />
                        </form>
                    )} />
                </div>
            </div>
        </div>
    );
}