import React, { useEffect, useState, useRef } from "react";
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
  const canvasRef = useRef(null);

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
        console.error("Error fetching PDF:", err);
        setError(err.message || "Failed to load PDF");
        setLoading(false);
      }
    };

    fetchPDF();
  }, [tid]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.dataset.drawing = "true";
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    const canvas = canvasRef.current;
    if (canvas.dataset.drawing !== "true") return;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = isErasing ? 20 : 2;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    canvas.dataset.drawing = "false";
  };

  if (loading) return <div>Loading PDF...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="topic-detail-container" style={{ display: "flex" }}>
      <div className="left-panel" style={{ flex: 3, position: "relative", height: "100vh" }}>
        <h3 style={{ padding: "10px" }}>{topicTitle}</h3>

        {/* PDF iframe */}
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          title="PDF Viewer"
          className="pdf-iframe"
          style={{
            width: "100%",
            height: "calc(100% - 60px)",
            position: "absolute",
            top: "60px",
            left: 0,
            zIndex: 1,
            border: "none",
          }}
        />

        {/* Drawing Canvas */}
        <canvas
          ref={canvasRef}
          width={window.innerWidth * 0.6}
          height={window.innerHeight - 60}
          style={{
            position: "absolute",
            top: "60px",
            left: 0,
            zIndex: 2,
            backgroundColor: "transparent",
            pointerEvents: "auto",
            cursor: isErasing ? "cell" : "crosshair",
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      {/* Tools Panel */}
      <div className="right-panel" style={{ flex: 1, padding: "1rem" }}>
        <h3>Drawing Tools</h3>
        <button onClick={() => setDrawColor("#000")}>Black</button>
        <button onClick={() => setDrawColor("red")}>Red</button>
        <button onClick={() => setDrawColor("green")}>Green</button>
        <button onClick={() => setDrawColor("blue")}>Blue</button>
        <button onClick={() => setIsErasing((prev) => !prev)}>
          {isErasing ? "Switch to Pen" : "Eraser"}
        </button>
      </div>
    </div>
  );
};


export default PdfViewer;
