import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';

export const Add_item = () => {
    let navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});

    const validate = (data) => {
        let errors = {};

        if (!data.itemName) {
            errors.itemName = 'Item Name is required.';
        }

        return errors;
    };

    const onSubmit = async (data, form) => {
        setFormData(data);

        try {
            const response = await fetch("http://localhost:3500/api/items/addItem", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            console.log(data);

            if (!response.ok) {
                throw new Error('Failed to add item');
            }

            const json = await response.json();
            console.log(json);

            // Reset the form
            form.restart();

            navigate('/inventry');
        } catch (error) {
            console.error('Network error:', error.message);
        }

        setShowMessage(true);
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
                        Your account is registered under name <b>{formData.name}</b> ; it'll be valid next 30 days without activation. Please check <b>{formData.email}</b> for activation instructions.
                    </p>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">Register Company</h5>
                    <Form
                        onSubmit={onSubmit}
                        initialValues={{ itemName: '', itemQuantity: '', cmpName: '', vendor: '', amount: '' }}
                        validate={validate}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="p-fluid">
                                <div className="p-grid p-formgrid">
                                    <div className="p-col">
                                        <Field name="itemName" render={({ input, meta }) => (
                                            <div className="field">
                                                <span className="p-float-label">
                                                    <InputText id="itemName" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                    <label htmlFor="itemName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Item Name*</label>
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )} />
                                    </div>

                                    <div className="p-col">
                                        <Field name="itemQuantity" render={({ input, meta }) => (
                                            <div className="field">
                                                <span className="p-float-label">
                                                    <InputText id="itemQuantity" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                    <label htmlFor="itemQuantity" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Quantity*</label>
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )} />
                                    </div>

                                    <div className="p-col">
                                        <Field name="amount" render={({ input, meta }) => (
                                            <div className="field">
                                                <span className="p-float-label">
                                                    <InputText id="amount" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                    <label htmlFor="amount" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Price*</label>
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )} />
                                    </div>

                                   

                                    <div className="p-col">
                                        <Field name="vendor" render={({ input, meta }) => (
                                            <div className="field">
                                                <span className="p-float-label">
                                                    <InputText id="vendor" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                    <label htmlFor="vendor" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Vendor*</label>
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )} />
                                    </div>
                                </div>

                                <Button type="submit" label="Submit" className="mt-2" />
                            </form>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
