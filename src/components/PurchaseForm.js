import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';

const PurchaseForm = () => {
  const [account, setAccount] = useState([]);
  const [toastData, setToastData] = useState(null);
  const navigate = useNavigate();
  let toast;

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/account/AccountName');
        if (response.ok) {
          const json = await response.json();
          setAccount(json);
        }
      } catch (error) {
        console.error('Error fetching Employee:', error.message);
      }
    };

    fetchAccount();
  }, []);

  const showToast = (severity, summary, detail) => {
    setToastData({ severity, summary, detail });
  };

  useEffect(() => {
    if (toastData) {
      toast.show({ ...toastData, life: 5000 });
      setToastData(null);
    }
  }, [toastData]);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      const fileInput = document.getElementById('receipt');
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        formData.append('receipt', fileInput.files[0]);
      }

      const response = await fetch('http://localhost:3500/api/purchase/add', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        navigate('/Purchase');
      } else {
        console.error('Failed to add purchase:', response.status, response.statusText);
        showToast('error', 'Upload Failed', 'Failed to upload purchase.');
      }
    } catch (error) {
      console.error('Error adding purchase:', error.message);
      showToast('error', 'Error', 'An error occurred while adding the purchase.');
    }
  };

  return (
    <div className="formgrid grid block bg-primary-100 font-bold text-center p-4 border-round mb-3">
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="purchase-form">
            <div className="field col">
              <Field
                name="itemName"
                render={({ input }) => <InputText id="itemName" {...input} placeholder="Item Name" className="p-inputtext-sm" />}
              />
            </div>
            <div className="field col">
              <Field
                name="quantity"
                render={({ input }) => <InputText id="quantity" type="number" {...input} placeholder="Quantity" className="p-inputtext-sm" />}
              />
            </div>
            <div className="field col">
              <Field
                name="amountPerPiece"
                render={({ input }) => <InputText id="amountPerPiece" type="number" {...input} placeholder="Amount Per Pice" className="p-inputtext-sm" />}
              />
            </div>
            <div className="field col">
              <Field
                name="vendorName"
                render={({ input }) => <InputText id="vendorName" {...input} placeholder="Vendor Name" className="p-inputtext-sm" />}
              />
            </div>
            <div className="field col">
              <Field
                name="bankName"
                render={({ input }) => (
                  <Dropdown
                    id="bankName"
                    {...input}
                    options={account}
                    optionLabel="bankName"
                    optionValue="_id"
                    placeholder="Select a Bank"
                    className="p-dropdown-sm"
                  />
                )}
              />
            </div>
            <div className="field col">
              <label htmlFor="receipt">Receipt</label>
              <input
                id="receipt"
                name="receipt"
                type="file"
                className="p-fileupload-sm"
                accept=".pdf, .jpg, .jpeg, .png"
              />
            </div>
            <div className="field col">
              <Button type="submit" label="Add Purchase" className="p-button-sm" />
            </div>
          </form>
        )}
      />
      <Toast ref={(el) => (toast = el)} />
    </div>
  );
};

export default PurchaseForm;
