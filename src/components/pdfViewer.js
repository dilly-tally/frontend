import React, { useEffect, useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
import axios from "../api/auth";
import "../styles/pdfView.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const PdfViewer = () => {
  // Make sure we're getting the parameter name exactly as defined in the route
  const { tid } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Received TID from route:", tid); // Debug log

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        if (!tid) {
          throw new Error("Topic ID is missing");
        }
        
        console.log(`Fetching data for topic ID: ${tid}`);
        const res = await axios.get(`http://localhost:3000/v1/teacherResource/topic/${tid}`);
        
        console.log("API response:", res.data);
        const { pdfPath, TNAME } = res.data.topic;
        
        // Make sure pdfPath exists
        if (!pdfPath) {
          throw new Error("PDF path not found in response");
        }
        
        setPdfUrl(`http://localhost:3000/${pdfPath}`);
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

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  if (loading) return <div className="loading">Loading PDF data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="topic-detail-container">
      <div className="left-panel">
        <h3>{topicTitle}</h3>
        {pdfUrl ? (
          <Document 
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error("Error loading PDF:", error)}
          >
            {Array.from(new Array(numPages || 1), (el, index) => (
              <Page 
                key={`page_${index + 1}`} 
                pageNumber={index + 1} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        ) : (
          <p>PDF not available</p>
        )}
      </div>
      <div className="right-panel">
        <h3>Whiteboard Area</h3>
        {/* You can add canvas or drawing tools here */}
      </div>
    </div>
  );
};

export default PdfViewer;