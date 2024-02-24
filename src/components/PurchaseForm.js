import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import 'C:/Users/Moham/Desktop/4nokri/src/components/PurchaseCss.css';
import { Calendar } from 'primereact/calendar';


const PurchaseForm = () => {
  const [account, setAccount] = useState([]);
  const [toastData, setToastData] = useState(null);
  const navigate = useNavigate();
  let toast;
  const [uploadedFile, setUploadedFile] = useState(null);


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
  
  const [itemDetails, setItemDetails] = useState([]);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/item/itemName');
        if (response.ok) {
          const json = await response.json();
          setItemDetails(json);
        }
      } catch (error) {
        console.error('Error fetching Item Details:', error.message);
      }
    };

    fetchItemDetails();
  }, []);

  useEffect(() => {
    if (toastData) {
      toast.show({ ...toastData, life: 5000 });
      setToastData(null);
    }
  }, [toastData]);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Extract the ID from the selected item
      const itemId = values.itemName._id;
  
      // Remove the object from the values and replace it with the ID
      const updatedValues = { ...values, itemName: itemId };
  
      Object.keys(updatedValues).forEach((key) => {
        formData.append(key, updatedValues[key]);
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
  
  const unitOptions = ['grams', 'kilograms']; // Add more options if needed


  return (
    <div className="formgrid grid block  font-bold text-center p-4 border-round mb-3 " >
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit} className="purchase-form">
              <div className="field col">
                <Field
                  name="itemName"
                  render={({ input }) => (
                    <Dropdown
                      id="itemName"
                      {...input}
                      options={itemDetails}
                      filter

                      placeholder="Select an Item"
                      optionLabel={(option) => option ? `${option.itemNo} (${option.itemName})` : ''}
                      className="p-dropdown-sm" />
                  )} />
              </div>
              <div className="field col">
                <Field
                  name="quantity"
                  render={({ input }) => (
                    <InputText
                      id="quantity"
                      type="number"
                      step="0.001" // Allow decimal values
                      {...input}
                      placeholder="Quantity in grams"
                      className="p-inputtext-sm" />
                  )} />
              </div>
              <div className="field col">
                <Field
                  name="amountPerPiece"
                  render={({ input }) => <InputText id="amountPerPiece" type="number" {...input} placeholder="Amount Per Pice" className="p-inputtext-sm" />} />
              </div>
              <div className="field col">
                <Field
                  name="vendorName"
                  render={({ input }) => <InputText id="vendorName" {...input} placeholder="Vendor Name" className="p-inputtext-sm" />} />
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
                      className="p-dropdown-sm" />
                  )} />
              </div>
              <Field name="expiryDate" render={({ input }) => (
  <div className="field">
      <span className="p-float-label">
          <Calendar id="expiryDate" {...input} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
          <label htmlFor="expiryDate"></label>
      </span>
  </div>
)} />
              <div className="field col file-input-container">
  <label htmlFor="receipt" className="file-input-button">
    Choose File
  </label>
  <input
    id="receipt"
    name="receipt"
    type="file"
    className="p-fileupload-sm file-input"
    accept=".pdf, .jpg, .jpeg, .png"
    onChange={(e) => setUploadedFile(e.target.files[0])}
  />
</div>
{uploadedFile && (
  <div className="uploaded-file-info">
    <p>File Name: {uploadedFile.name}</p>
    <p>File Size: {uploadedFile.size} bytes</p>
    <p>File Type: {uploadedFile.type}</p>
  </div>
)}
              <div className="field col">
                <Button type="submit" label="Add Purchase" className="p-button-sm" />
              </div>
            </form>
          );
        }}
      />
      <Toast ref={(el) => (toast = el)} />
    </div>
  );
};

export default PurchaseForm;
