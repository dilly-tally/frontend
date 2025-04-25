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

  const [drawColor, setDrawColor] = useState("#000");
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        if (!tid) throw new Error("Topic ID is missing");

        const res = await axios.get(
          `https://backend-937324960970.us-central1.run.app/v1/teacherResource/topic/${tid}`
        );
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

  function startDrawing(e, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    canvas.dataset.drawing = "true";
    canvas.style.pointerEvents = "auto"; // Enable drawing interaction
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
      canvas.style.pointerEvents = "none"; // Revert to scroll mode
    });
  }

  if (loading) return <div className="loading">Loading PDF data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="topic-detail-container">
      <div className="left-panel" style={{ position: "relative" }}>
        <h3>{topicTitle}</h3>
        {pdfUrl ? (
          <>
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="pdf-iframe"
              title="PDF Viewer"
            />
            <canvas
              id="pdf-canvas"
              width={800}
              height={600}
              style={{
                position: "absolute",
                top: "100px",
                left: "20px",
                zIndex: 10,
                backgroundColor: "transparent",
                pointerEvents: "none", // Default to allow scroll
              }}
              onMouseDown={(e) => startDrawing(e, "pdf-canvas")}
              onMouseMove={(e) => draw(e, "pdf-canvas")}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </>
        ) : (
          <p>PDF not available</p>
        )}
      </div>

      <div className="right-panel">
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
