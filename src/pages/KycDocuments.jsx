import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getDocuments,
  uploadDocument,
  deleteDocument,
} from "../services/kycService";

export default function KycDocuments() {
  const { id } = useParams();

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    const res = await getDocuments(id);
    setDocuments(res.data || []);
  };

  const handleUpload = async (type, file) => {
    await uploadDocument(id, type, file);
    fetchDocs();
  };

  const handleDelete = async (docId) => {
    await deleteDocument(id, docId);
    fetchDocs();
  };

  return (
    <div className="dash-content">
      <h2>KYC Documents</h2>

      {documents.map((doc) => (
        <div key={doc.id}>
          <p>{doc.name}</p>

          <button onClick={() => handleDelete(doc.id)}>
            Delete
          </button>
        </div>
      ))}

      <input
        type="file"
        onChange={(e) =>
          handleUpload("aadhaar", e.target.files[0])
        }
      />
    </div>
  );
}
