import React, { useRef, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Toast } from 'primereact/toast';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


export const Login = () => {
    const toast = useRef(null);
    let navigate = useNavigate();
    const [formData, setFormData] = useState({});

    const validate = (data) => {
        let errors = {};

        if (!data.phoneNumber) {
            errors.phoneNumber = 'Number is required.';
        }

        if (!data.password) {
            errors.password = 'Password is required.';
        }

        return errors;
    };

    const onSubmit = async (data, form) => {
        setFormData(data);

        const { phoneNumber, password } = data;

        try {
            var response = await fetch('http://localhost:3500/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, password }),
            });
        } catch (error) {
            console.error('Network error:', error.message);
        }

        if (response.ok) {
            const json = await response.json();
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Login successful',
                life: 3000,
            });

            sessionStorage.setItem('token', json.authData);
            let decoded = jwtDecode(json.authData);
            let username = decoded.user;
            // console.log('username', username);

            navigate('/home');
            form.restart();
        } else {
            // console.error('Login failed:', response.status, response.statusText);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Login failed. Please check your credentials.',
                life: 3000,
            });
        }
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };
    const handleForgotPasswordClick = () => {
        // Navigate to the 'forgotPassword' route
        navigate('/forgotPassword');
      };

    const dialogFooter = (
        <div className="flex justify-content-center">
            <Button label="OK" className="p-button-text" autoFocus  />
        </div>
    );

    return (
        <div className="form-demo">
            <Toast ref={toast} position="top-center" />

            <div className="flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#1A2745' }}>
                <div className="card ml-5 style={{ border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}">
                    <h5 className="text-center text-blue-200 text-xl fadein animation-duration-1000 ">LOG IN</h5>
                    <Form
                        onSubmit={onSubmit}
                        initialValues={{ phoneNumber: '', password: '' }}
                        validate={validate}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="p-fluid">
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
                                <Field
                                    name="password"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <Password id="password" {...input} toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })} feedback={false} />
                                                <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                                                    Password*
                                                </label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />

                                <Button type="submit" label="Submit" className="mt-2" />
                                
                            </form>
                            
                        )}
                    />
                     <p onClick={handleForgotPasswordClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
      Forget Password
    </p>
                </div>
            </div>
        </div>
    );
};
