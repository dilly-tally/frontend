import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/auth";
import "../styles/pdfView.css";

const PdfViewer = () => {
  const { tid } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        if (!tid) throw new Error("Topic ID is missing");

        const res = await axios.get(`https://backend-937324960970.us-central1.run.app/v1/teacherResource/topic/${tid}`);
        const { pdfPath, TNAME } = res.data.topic;

        if (!pdfPath) throw new Error("PDF path not found in response");

        setPdfUrl(`https://backend-937324960970.us-central1.run.app/${pdfPath}`);
        setTopicTitle(TNAME || "Untitled Topic");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching topic PDF path:", err);
        setError(err.message || "Failed to load PDF");
        setLoading(false);
      }
    };

    fetchPDF();
  }, [tid]);

  if (loading) return <div className="loading">Loading PDF data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="topic-detail-container">
      <div className="left-panel">
        <h3>{topicTitle}</h3>
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            style={{ border: "1px solid #ccc" }}
            title="PDF Viewer"
          />
        ) : (
          <p>PDF not available</p>
        )}
      </div>
      <div className="right-panel">
        <h3>Whiteboard Area</h3>
        {/* Whiteboard will go here */}
      </div>
    </div>
  );
};

export default PdfViewer;
