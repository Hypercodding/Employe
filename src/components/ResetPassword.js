import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';


const ResetPassword = () => {

  let navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [company, setCompany] = useState([]);

  
  const validate = (data) => {
    let errors = {};

    if (!data.mobileNumber) {
      errors.mobileNumber = 'Mobile is required.';
    }
    if (!data.newPassword) {
        errors.newPassword = 'Password is required.';
    }

    return errors;
  };

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

    const onSubmit = async (data, form) => {
        setFormData(data);
        const { mobileNumber, verificationCode, newPassword } = data;
    
        try {
          var response = await fetch("http://localhost:3500/api/auth/verify-code-reset-password", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobileNumber, verificationCode, newPassword })
          });
          console.log('Backend response:', response);
    
        } catch (error) {
          console.error('Network error:', error.message);
        }
    
        if (response && response.ok) {
          const json = await response.json();
          console.log('JSON response:', json);
    
          form.restart();
    
          navigate('/login');
        }
    
        form.restart();
      };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
  };

  const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;


  return (
    <div className="form-demo">
    

      <div className="flex justify-content-center mt-8">
        <div className="">
          <h5 className="text-center">Enter Mobile Number To get Verification code</h5>
          <Form onSubmit={onSubmit} initialValues={{ mobileNumber: '', verificationCode: '', newPassword: '' }} validate={validate} render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="p-fluid">
              
                <div className="card">
                <div className="field col-11 md:col-6">
                <Field name="mobileNumber" render={({ input, meta }) => (
                            <div className="field">
                                <span className="p-float-label p-input-icon-right">
                                    <PhoneInput
                                        inputProps={{
                                            name: 'mobileNumber',
                                            required: true, // Add any other input props you may need
                                        }}
                                        placeholder="Enter phone number"
                                        {...input}
                                        country={'PK'}
                                    />
                                    <label htmlFor="mobileNumber" className={classNames({ 'p-error': isFormFieldValid(meta) })}></label>
                                </span>
                                {getFormErrorMessage(meta)}
                            </div>
                        )} />
                        </div>
                        <div className="field col-11 md:col-12">
                          <Field name="verificationCode" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="verificationCode" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="verificationCode" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Code*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                        </div>
                        <div className="field col-11 md:col-12">
                        <Field name="newPassword" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Password id="newPassword " {...input} toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })} header={passwordHeader} footer={passwordFooter} />
                                        <label htmlFor="newPassword" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Password*</label>
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
};

export default ResetPassword;
