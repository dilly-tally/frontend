import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/auth";
import "../styles/pdfView.css";

const PdfViewer = () => {
  const { tid } = useParams();
  const [pdfBaseUrl, setPdfBaseUrl] = useState(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [totalPages, setTotalPages] = useState(5); // You can fetch this dynamically later
  const [currentPage, setCurrentPage] = useState(1);
  const [drawColor, setDrawColor] = useState("#000");
  const [isErasing, setIsErasing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        if (!tid) throw new Error("Topic ID is missing");

        const res = await axios.get(
          `https://backend-937324960970.us-central1.run.app/v1/teacherResource/topic/${tid}`
        );
        const { pdfPath, TNAME } = res.data.topic;

        if (!pdfPath) throw new Error("PDF path not found in response");

        setPdfBaseUrl(`https://backend-937324960970.us-central1.run.app/${pdfPath}`);
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

  const goToPage = (offset) => {
    setCurrentPage((prev) => {
      const nextPage = prev + offset;
      if (nextPage < 1 || nextPage > totalPages) return prev;
      clearCanvas("pdf-canvas");
      return nextPage;
    });
  };

  function startDrawing(e, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    canvas.dataset.drawing = "true";
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }

  function draw(e, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas.dataset.drawing !== "true") return;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = isErasing ? 20 : 2;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  }

  function stopDrawing() {
    document.querySelectorAll("canvas").forEach((canvas) => {
      canvas.dataset.drawing = "false";
    });
  }

  function clearCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  if (loading) return <div className="loading">Loading PDF data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const pdfUrl = `${pdfBaseUrl}#page=${currentPage}&toolbar=0`;

  return (
    <div className="topic-detail-container">
      <div className="left-panel" style={{ position: "relative" }}>
        <h3>{topicTitle}</h3>
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <button onClick={() => goToPage(-1)} disabled={currentPage <= 1}>
            ◀ Previous
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => goToPage(1)} disabled={currentPage >= totalPages}>
            Next ▶
          </button>
        </div>
        <iframe
          src={pdfUrl}
          className="pdf-iframe"
          title="PDF Viewer"
          style={{ width: "100%", height: "600px", border: "none" }}
        />
        <canvas
          id="pdf-canvas"
          width={800}
          height={600}
          style={{
            position: "absolute",
            top: "190px",
            left: "20px",
            pointerEvents: "auto",
            zIndex: 10,
            backgroundColor: "transparent",
          }}
          onMouseDown={(e) => startDrawing(e, "pdf-canvas")}
          onMouseMove={(e) => draw(e, "pdf-canvas")}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      <div className="right-panel">
        <h3>Whiteboard Area</h3>
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={() => setDrawColor("#000")}>Black</button>
          <button onClick={() => setDrawColor("red")}>Red</button>
          <button onClick={() => setDrawColor("green")}>Green</button>
          <button onClick={() => setDrawColor("blue")}>Blue</button>
          <button onClick={() => setIsErasing(!isErasing)}>
            {isErasing ? "Switch to Pen" : "Eraser"}
          </button>
        </div>
        <canvas
          id="whiteboard-canvas"
          width={400}
          height={600}
          style={{
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "crosshair",
          }}
          onMouseDown={(e) => startDrawing(e, "whiteboard-canvas")}
          onMouseMove={(e) => draw(e, "whiteboard-canvas")}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

export default PdfViewer;
