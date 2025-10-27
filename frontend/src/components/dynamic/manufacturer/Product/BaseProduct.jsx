import React, { useState } from 'react';
import Breadcrumbs from '../../../custom/Breadcrumb.jsx';
import AddProductForm from './AddProductForm';
import SelectProductForm from './SelectProductForm';

// Assuming you have an index.css or similar file where Tailwind is imported
// import './index.css';

function BaseProduct() {
  // 'initial', 'addProduct', 'selectProduct', 'addBatchDetails' (if batch has more steps)
  const [currentView, setCurrentView] = useState('initial');
  const [breadcrumbs, setBreadcrumbs] = useState(['Home']);

  const handleAddProductClick = () => {
    setCurrentView('addProduct');
    setBreadcrumbs(['Home', 'Add Product']);
  };

  const handleAddBatchClick = () => {
    setCurrentView('selectProduct');
    setBreadcrumbs(['Home', 'Add Batch']);
  };

  const handleBack = () => {
    if (currentView === 'addProduct' || currentView === 'selectProduct') {
      setCurrentView('initial');
      setBreadcrumbs(['Home']);
    }
    // Add more complex breadcrumb logic here for multi-step forms
  };

  const handleSubmitProduct = () => {
    alert('Product Submitted!');
    setCurrentView('initial');
    setBreadcrumbs(['Home']);
  };

  const handleSubmitSelectProduct = () => {
    alert('Product Selected for Batch!');
    // If 'Add Batch' has more steps, you'd change currentView here
    // For now, let's go back to initial
    setCurrentView('initial');
    setBreadcrumbs(['Home']);
  };

  const handleCrumbClick = (index) => {
    if (index === 0) { // Clicked Home
      setCurrentView('initial');
      setBreadcrumbs(['Home']);
    }
    // Implement more specific logic if you have deeper navigation paths
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-8">
        <Breadcrumbs crumbs={breadcrumbs} onCrumbClick={handleCrumbClick} />
      </div>

      {currentView === 'initial' && (
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleAddProductClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
          >
            Add New Product
          </button>
          <button
            onClick={handleAddBatchClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
          >
            Add New Batch
          </button>
        </div>
      )}

      {currentView === 'addProduct' && (
        <AddProductForm onBack={handleBack} onSubmit={handleSubmitProduct} />
      )}

      {currentView === 'selectProduct' && (
        <SelectProductForm onBack={handleBack} onSubmit={handleSubmitSelectProduct} />
      )}
    </div>
  );
}

export default BaseProduct;
