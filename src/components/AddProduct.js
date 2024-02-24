import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';

const AddProduct = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({ productName: '', items: [{ item: '', quantity: 1 }] });
  const [existingItems, setExistingItems] = useState([]);

  useEffect(() => {
    const fetchExistingItems = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/item/itemName');
        if (response.ok) {
          const json = await response.json();
          setExistingItems(json);
        }
      } catch (error) {
        console.error('Error fetching items:', error.message);
      }
    };

    fetchExistingItems();
  }, []);

  const validate = (data) => {
    let errors = {};

    if (!data.productName) {
      errors.productName = 'Product Name is required.';
    }

    return errors;
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleAddItem = () => {
    setFormData({ ...formData, items: [...formData.items, { item: '', quantity: 1 }] });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const onSubmit = async (data) => {
    setFormData(data);

    try {
      const response = await fetch('http://localhost:3500/api/product/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const json = await response.json();
        console.log('JSON response:', json);

        setShowMessage(true);
        setFormData({ productName: '', items: [{ item: '', quantity: 1 }] });
      }
    } catch (error) {
      console.error('Network error:', error.message);
    }

    // navigate('/'); // Use navigate instead of history.push
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} />
    </div>
  );

  return (
    <div className=" px-8" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }} >
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position="top"
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ '960px': '80vw' }}
        style={{ width: '30vw' }}
      >
        <div className="flex items-center justify-center h-screen w-8 px-8">
          <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
          <h5>Product Added Successfully!</h5>
        </div>
      </Dialog>

      <div className="flex items-center justify-center h-screen w-8 px-8 p-grid p-fluid rounded-lg p-p-4 bg-white " style={{
        justifyContent: 'center'
      }} >
        <div className="">
          <h5 className="text-center">Add Product</h5>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
            <div className="formgroup-inline">
              <div className="field col-12 md:col-6 col-offset-3">
                <InputText
                  id="productName"
                  placeholder="Product Name "
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>
              <div className="field col-11 md:col-6 col-offset-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="field col ">
                    <label htmlFor={`item-${index}`}>Item*</label>
                    <Dropdown
                      id={`item-${index}`}
                      value={item.item}
                      options={existingItems}
                      optionLabel="itemName"
                      optionValue="_id"
                      onChange={(e) => handleItemChange(index, 'item', e.value)}
                    />
                  
                    <label htmlFor={`quantity-${index}`}>Quantity*</label>
                    <InputText
                      id={`quantity-${index}`}
                      type="number"
                      step="0.001"
                      min="0.001"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                    />
                    <Button type="button" label="Remove" onClick={() => handleRemoveItem(index)} className="p-button-danger mt-3" />
                  </div>
                ))}
                <Button type="button" label="Add Item" onClick={handleAddItem} />
              </div>
            </div>
            <Button type="submit" label="Submit" className="mt-2" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
