// PurchaseTable.jsx
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const PurchaseTable = () => {
  const [purchaseData, setPurchaseData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const fetchPurchaseData = async () => {
    try {
      const response = await fetch('http://localhost:3500/api/purchase/getPurchase');
      if (response.ok) {
        const json = await response.json();
        setPurchaseData(json);
      }
    } catch (error) {
      console.error('Error fetching purchase data:', error.message);
    }
  };

  const loadData = () => {
    fetchPurchaseData();
  };

  const renderActions = (rowData) => {
    return (
      <div>
        <i className="pi pi-trash" onClick={() => handleDelete(rowData)}></i>
      </div>
    );
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async (data) => {
    const { _id } = data;

    try {
      const response = await fetch(`http://localhost:3500/api/purchase/deletePurchase/${_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Purchase deleted successfully');
        // Reload data after deletion
        loadData();
      } else {
        console.error('Failed to delete purchase:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error deleting purchase:', error.message);
    }
  };

  return (
    <div>
      <h2 style={{textAlign: 'center'}}>Purchase Records</h2>
      <DataTable value={purchaseData} responsive>
      <Column field="itemDetails" header="Item Name" body={(rowData) => rowData.itemDetails.itemName } />
        <Column field="quantity" header="Quantity" />
        <Column field="amountPerPiece" header="Amount Per Piece" />
        <Column field="TotalAmount" header="Total Amount" />
        <Column field="vendorName" header="Vendor Name" />
        <Column field="bankName" header="Bank Name" />
        <Column field="expiryDate" header="Expiry Date"   body={(rowData) => rowData.expiryDate != null ? formatDate(rowData.expiryDate) : ""} />
        
        <Column
          body={(rowData) => (
            <img
              src={`http://localhost:3500/api/purchase/${rowData._id}`}
              alt={`Receipt for ${rowData.itemName}`}
              style={{ width: '100px' }}
            />
          )}
          header="Receipt"
        />
        <Column body={renderActions} header="Actions" />
      </DataTable>
    </div>
  );
};

export default PurchaseTable;
