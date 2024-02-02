import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
// import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


export const Login = () => {
    // const token = sessionStorage.getItem('token');
    // let history = useHistory();
    let navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});

    const validate = (data) => {
        let errors = {};

        if (!data.ph) {
            errors.ph = 'Number is required.';
        }

        if (!data.password) {
            errors.password = 'Password is required.';
        }

        return errors;
    };

    const onSubmit = async (data, form) => {
        setFormData(data);
        setShowMessage(true);
        const { ph, password } = data;

        try {
            var response = await fetch("http://localhost:3500/api/auth/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ph, password })
            });

            
        } catch (error) {
            console.error('Network error:', error.message);
        }
        if (response.ok) {
            const json = await response.json();
            console.log(json);

            // Reset the form
            form.restart();
            sessionStorage.setItem('token', json.authData);
            let decoded = jwtDecode(json.authData);
            let username = decoded.user;
            console.log('username', username);
            // await submitForm();
            // Optionally, redirect to another page after successful login
            // window.location.href = '/home';
        } else {
            console.error('Login failed:', response.status, response.statusText);
        }
        navigate('/home')
        form.restart();
    };
    
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;

    

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Registration Successful!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Hi <b>{formData.name}</b>!
                    </p>
                </div>
            </Dialog>

            <div className="flex justify-content-center align-items-center" style={{ height: '90vh',backgroundColor: 'var(--highlight-bg)' }}>
                <div className="card ml-5 style={{ border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}">
                    <h5 className="text-center">LogIn</h5>
                    <Form onSubmit={onSubmit} initialValues={{ ph: '', password: '' }} validate={validate} render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="p-fluid">
                            <Field name="ph" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="ph" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="ph" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Number*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />

                            <Field name="password" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Password id="password" {...input} toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })} feedback={false}  />
                                        <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Password*</label>
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
