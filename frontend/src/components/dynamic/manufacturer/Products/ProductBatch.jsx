import React, { useState } from "react";
import SelectProductForm from "./SelectProductForm";
import BatchForm from "./BatchForm";

export default function ProductBatchPage() {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showBatchForm, setShowBatchForm] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    if (selectedProductId) setShowBatchForm(true);
  };

  const handleBack = () => {
    setShowBatchForm(false);
  };

  return (
    <div>
      {!showBatchForm ? (
        <SelectProductForm
          selectedProductId={selectedProductId}
          setSelectedProductId={setSelectedProductId}
          onBack={() => {}}
          onSubmit={handleNext}
        />
      ) : (
        <BatchForm
          productId={selectedProductId}
          onRegisterBatch={(cid, merkleRoot) =>
            console.log("Batch Registered:", cid, merkleRoot)
          }
          onBack={handleBack}
        />
      )}
    </div>
  );
}
