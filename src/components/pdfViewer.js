// PdfViewer.js
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/auth";
import "../styles/pdfView.css";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

// Set the worker source
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js`;

const PdfViewer = () => {
  const { tid } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawColor, setDrawColor] = useState("#000");
  const [isErasing, setIsErasing] = useState(false);
  const containerRef = useRef(null);

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
    if (!pdfUrl || !containerRef.current) return;

    const renderPDF = async () => {
      const loadingTask = getDocument(pdfUrl);
      const pdf = await loadingTask.promise;

      const container = containerRef.current;
      container.innerHTML = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        // Render PDF page
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        container.appendChild(canvas);

        await page.render({ canvasContext: context, viewport }).promise;

        // Add drawing overlay
        const drawCanvas = document.createElement("canvas");
        drawCanvas.width = viewport.width;
        drawCanvas.height = viewport.height;
        drawCanvas.style.position = "absolute";
        drawCanvas.style.left = canvas.offsetLeft + "px";
        drawCanvas.style.top = canvas.offsetTop + "px";
        drawCanvas.style.cursor = isErasing ? "cell" : "crosshair";
        drawCanvas.dataset.drawing = "false";
        drawCanvas.className = "draw-layer";
        container.appendChild(drawCanvas);

        const ctx = drawCanvas.getContext("2d");

        drawCanvas.addEventListener("mousedown", (e) => {
          drawCanvas.dataset.drawing = "true";
          ctx.beginPath();
          ctx.moveTo(e.offsetX, e.offsetY);
        });

        drawCanvas.addEventListener("mousemove", (e) => {
          if (drawCanvas.dataset.drawing !== "true") return;
          ctx.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
          ctx.strokeStyle = drawColor;
          ctx.lineWidth = isErasing ? 20 : 2;
          ctx.lineTo(e.offsetX, e.offsetY);
          ctx.stroke();
        });

        drawCanvas.addEventListener("mouseup", () => {
          drawCanvas.dataset.drawing = "false";
        });

        drawCanvas.addEventListener("mouseleave", () => {
          drawCanvas.dataset.drawing = "false";
        });
      }
    };

    renderPDF();
  }, [pdfUrl, drawColor, isErasing]);

  if (loading) return <div>Loading PDF...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h3>{topicTitle}</h3>
      <button onClick={() => setDrawColor("#000")}>Black</button>
      <button onClick={() => setDrawColor("red")}>Red</button>
      <button onClick={() => setDrawColor("green")}>Green</button>
      <button onClick={() => setDrawColor("blue")}>Blue</button>
      <button onClick={() => setIsErasing((prev) => !prev)}>
        {isErasing ? "Switch to Pen" : "Eraser"}
      </button>

      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: "calc(100vh - 150px)",
          overflowY: "scroll",
        }}
      />
    </div>
  );
};

export default PdfViewer;
