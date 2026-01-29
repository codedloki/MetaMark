import { useState } from "react";

function AddBatch() {
  const [batchId, setBatchId] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError("");
    setSuccess("");

    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setError("Only CSV files are allowed");
      setCsvFile(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      validateCSV(text);
    };

    reader.readAsText(file);
    setCsvFile(file);
  };

  const validateCSV = (text) => {
    const lines = text.trim().split("\n");
    const headers = lines[0]
      .split(",")
      .map((h) => h.trim().toLowerCase());

    const requiredHeaders = ["mfg_date", "expiry_date", "serial_no"];

    const isValid = requiredHeaders.every((h) =>
      headers.includes(h)
    );

    if (!isValid) {
      setError(
        "CSV must contain columns: mfg_date, expiry_date, serial_no"
      );
      setCsvFile(null);
    } else {
      setSuccess("CSV file validated successfully ✔");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!batchId || !csvFile) {
      setError("All fields are required");
      return;
    }

    alert("Batch Created Successfully!");
    console.log({ batchId, csvFile });

    setBatchId("");
    setCsvFile(null);
    setSuccess("");
  };

  const isDisabled = !batchId || !csvFile;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        
        <h2 className="text-center text-xl font-semibold text-slate-900">
          Create Batch
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Upload batch details using CSV file
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
        >
          {/* Batch ID */}
          <input
            type="text"
            placeholder="Batch ID"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm
                       text-slate-900 outline-none transition
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {/* CSV Upload */}
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm
                       text-slate-900 file:mr-3 file:rounded-md file:border-0
                       file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm
                       file:font-medium file:text-blue-600 hover:file:bg-blue-100"
          />

          {/* Error */}
          {error && (
            <p className="text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Success */}
          {success && (
            <p className="text-center text-sm text-green-600">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            className={`mt-2 rounded-md px-4 py-3 text-sm font-medium text-white transition
              ${
                isDisabled
                  ? "cursor-not-allowed bg-blue-500"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
              }`}
          >
            Create Batch
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddBatch;
