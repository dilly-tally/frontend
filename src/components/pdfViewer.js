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
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
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

  useEffect(() => {
    const adjustCanvasSize = () => {
      const iframe = document.getElementById("pdf-iframe");
      const canvas = canvasRef.current;
      if (iframe && canvas) {
        canvas.width = iframe.clientWidth;
        canvas.height = iframe.scrollHeight;
      }
    };

    setTimeout(adjustCanvasSize, 1000); // Give time for PDF to load
    window.addEventListener("resize", adjustCanvasSize);
    return () => window.removeEventListener("resize", adjustCanvasSize);
  }, [pdfUrl]);

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
    canvasRef.current.dataset.drawing = "false";
  };

  if (loading) return <div>Loading PDF...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div style={{ padding: "1rem" }}>
        <h3>{topicTitle}</h3>
        <button onClick={() => setDrawColor("#000")}>Black</button>
        <button onClick={() => setDrawColor("red")}>Red</button>
        <button onClick={() => setDrawColor("green")}>Green</button>
        <button onClick={() => setDrawColor("blue")}>Blue</button>
        <button onClick={() => setIsErasing(!isErasing)}>
          {isErasing ? "Switch to Pen" : "Eraser"}
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        style={{ position: "relative", height: "calc(100vh - 100px)", overflowY: "scroll" }}
      >
        {/* PDF iframe */}
        <iframe
          id="pdf-iframe"
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          title="PDF Viewer"
          style={{
            width: "100%",
            border: "none",
          }}
        />

        {/* Canvas overlay */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            pointerEvents: "auto",
            backgroundColor: "transparent",
            cursor: isErasing ? "cell" : "crosshair",
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
};

export default PdfViewer;
