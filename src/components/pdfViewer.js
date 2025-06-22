import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/auth";
import "../styles/pdfView.css";

export const PdfViewer = () => {
  const { tid } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawColor, setDrawColor] = useState("#000");
  const [isErasing, setIsErasing] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const canvasRef = useRef(null);
  const pdfCanvasRef = useRef(null);

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

  const startPdfDrawing = (e) => {
    const canvas = pdfCanvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.dataset.drawing = "true";
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const drawOnPdf = (e) => {
    const canvas = pdfCanvasRef.current;
    if (canvas.dataset.drawing !== "true") return;
    const ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = isErasing ? 20 : 2;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopPdfDrawing = () => {
    const canvas = pdfCanvasRef.current;
    canvas.dataset.drawing = "false";
  };

  const handleColorChange = (color) => {
    setDrawColor(color);
    setIsErasing(false);
  };

  const handleToolChange = (tool) => {
    if (tool === "eraser") {
      setIsErasing(true);
    } else if (tool === "highlighter") {
      setIsErasing(false);
      // You can add specific highlighter logic here if needed
      // For now, it will just use the selected color with normal drawing
    } else {
      setIsErasing(false);
    }
  };

  if (loading) return <div>Loading PDF...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="model" data-model-id="159:408">
      <div className="group-wrapper">
        <div className="group">
          <div className="on-boarding-screen">
            {/* Header Section */}
            <div className="frame">
              <img
                className="logo"
                alt="Logo"
                src="https://c.animaapp.com/cPNRw0I6/img/logo@2x.png"
              />

              <p className="simplify-teaching">
                <span className="text-wrapper">Simplify </span>
                <span className="span">Teaching</span>
                <span className="text-wrapper">, Inspiring </span>
                <span className="span">Learning</span>
              </p>

              <img
                className="ellipse"
                alt="Ellipse"
                src="https://c.animaapp.com/cPNRw0I6/img/ellipse-35.svg"
              />
            </div>

            {/* Content Section */}
            <div className="content-title">{topicTitle}</div>
            <div className="content-tabs">
              <div 
                className={`tab-wrapper ${activeTab === "content" ? "tab-active" : "tab-inactive"}`}
                onClick={() => setActiveTab("content")}
              >
                <div className="tab-text">
                  Content
                </div>
              </div>
              <div 
                className={`tab-wrapper ${activeTab === "resources" ? "tab-active" : "tab-inactive"}`}
                onClick={() => setActiveTab("resources")}
              >
                <div className="tab-text">
                  Additional Resources
                </div>
              </div>
              <div 
                className={`tab-wrapper ${activeTab === "test" ? "tab-active" : "tab-inactive"}`}
                onClick={() => setActiveTab("test")}
              >
                <div className="tab-text">
                  Test
                </div>
              </div>
            </div>

            {/* Drawing Toolbar - With Backend Integration */}
            {activeTab === "content" && (
              <div className="div">
                <div 
                  className="solar-pen-bold-wrapper"
                  onClick={() => handleToolChange("pen")}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    className="img"
                    alt="Solar pen bold"
                    src="https://c.animaapp.com/CJmPfwmA/img/solar-pen-bold.svg"
                  />
                </div>
                <input
                  type="color"
                  value={drawColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="color-picker"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "2px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    outline: "none"
                  }}
                />
                <div 
                  className="solar-eraser-bold-wrapper"
                  onClick={() => handleToolChange("eraser")}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    className="img"
                    alt="Solar eraser bold"
                    src="https://c.animaapp.com/CJmPfwmA/img/solar-eraser-bold.svg"
                  />
                </div>
                <div 
                  className="fa-solid-highlighter-wrapper"
                  onClick={() => handleToolChange("highlighter")}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    className="img"
                    alt="Fa solid highlighter"
                    src="https://c.animaapp.com/CJmPfwmA/img/fa-solid-highlighter.svg"
                  />
                </div>
              </div>
            )}

            {/* Content Areas */}
            {activeTab === "content" && (
              <>
                <div className="content-frame">
                  <div className="content-box">
                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={591}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 2,
                        backgroundColor: "transparent"
                      }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                  </div>
                </div>
                <iframe 
                  className="pdf-iframe"
                  src={pdfUrl ? `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0` : ""}
                  title="PDF Viewer"
                  frameBorder="0"
                />
                <canvas
                  ref={pdfCanvasRef}
                  width={798}
                  height={591}
                  style={{
                    position: "absolute",
                    top: "280px",
                    left: "56px",
                    zIndex: 3,
                    backgroundColor: "transparent",
                    pointerEvents: "auto"
                  }}
                  onMouseDown={startPdfDrawing}
                  onMouseMove={drawOnPdf}
                  onMouseUp={stopPdfDrawing}
                  onMouseLeave={stopPdfDrawing}
                />
              </>
            )}

            {/* Additional Resources Tab */}
            {activeTab === "resources" && (
              <div className="resources-iframe-container" style={{
                position: "absolute",
                top: "280px",
                left: "56px",
                width: "1328px",
                height: "591px",
                backgroundColor: "#ffffff",
                padding: "2rem",
                display: "flex",
                justifyContent: "center"
              }}>
                <iframe
                  src="https://www.visnos.com/demos/fraction-wall"
                  title="External Resource"
                  style={{
                    width: "80%",
                    height: "600px",
                    border: "none",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
                  }}
                />
              </div>
            )}

            {/* Test Tab */}
            {activeTab === "test" && pdfUrl && (
              <div className="test-iframe-container" style={{
                position: "absolute",
                top: "280px",
                left: "56px",
                width: "1328px",
                height: "591px",
                backgroundColor: "#ffffff",
                padding: "2rem",
                display: "flex",
                justifyContent: "center"
              }}>
                <iframe 
                  src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  title="PDF Test Viewer"
                  style={{
                    width: "80%",
                    height: "600px",
                    border: "none",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};