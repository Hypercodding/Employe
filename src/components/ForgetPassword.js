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


const ForgetPassword = () => {

  let navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [company, setCompany] = useState([]);

  
  const validate = (data) => {
    let errors = {};

    if (!data.mobileNumber) {
      errors.mobileNumber = 'Mobile is required.';
    }

    return errors;
  };

  const onSubmit = async (data, form) => {
    setFormData(data);
    const { mobileNumber } = data;

    try {
      var response = await fetch("http://localhost:3500/api/auth/send-verification-code", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber })
      });
      console.log('Backend response:', response);

    } catch (error) {
      console.error('Network error:', error.message);
    }

    if (response && response.ok) {
      const json = await response.json();
      console.log('JSON response:', json);

      form.restart();

      navigate('/resetPassword');
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
          <Form onSubmit={onSubmit} initialValues={{ mobileNumber: '' }} validate={validate} render={({ handleSubmit }) => (
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

</div>
              <Button type="submit" label="Submit" className="mt-2" />
            </form>
          )} />
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
