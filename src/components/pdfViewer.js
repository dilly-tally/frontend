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
  const [activeTab, setActiveTab] = useState("content");
  const [showAnswers, setShowAnswers] = useState(false);
  const [drawColor, setDrawColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState("pen");
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // PDF Book specific states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageImageUrl, setPageImageUrl] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const pdfCanvasRef = useRef(null);

  // Placeholder URL for PDF with answers
  const answersUrl = "PLACEHOLDER_ANSWERS_PDF_URL";

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

  // Initialize PDF.js and load first page
  useEffect(() => {
    if (pdfUrl && window.pdfjsLib) {
      loadPdfDocument();
    }
  }, [pdfUrl]);

  // Load PDF document and render first page
  const loadPdfDocument = async () => {
    try {
      const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      
      // Render the first page
      await renderPage(pdf, 1);
    } catch (error) {
      console.error("Error loading PDF document:", error);
    }
  };

  // Render a specific page to canvas and return as image URL
  const renderPage = async (pdf, pageNumber) => {
    setPageLoading(true);
    try {
      const page = await pdf.getPage(pageNumber);
      const canvas = pdfCanvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas size
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // Render page
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // Convert canvas to image URL
      const imageUrl = canvas.toDataURL();
      setPageImageUrl(imageUrl);
      setPageLoading(false);
      
      return imageUrl;
    } catch (error) {
      console.error("Error rendering page:", error);
      setPageLoading(false);
      return null;
    }
  };

  // Simple page navigation functions
  const nextPage = async () => {
    if (currentPage < totalPages && pdfDoc) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      await renderPage(pdfDoc, newPage);
      clearCanvas(); // Clear annotations when changing pages
    }
  };

  const prevPage = async () => {
    if (currentPage > 1 && pdfDoc) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      await renderPage(pdfDoc, newPage);
      clearCanvas(); // Clear annotations when changing pages
    }
  };

  const goToPage = async (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage && pdfDoc) {
      setCurrentPage(pageNum);
      await renderPage(pdfDoc, pageNum);
      clearCanvas(); // Clear annotations when changing pages
    }
  };

  // Update page when currentPage changes (for other tabs)
  useEffect(() => {
    if (pdfDoc && currentPage >= 1 && currentPage <= totalPages) {
      renderPage(pdfDoc, currentPage);
    }
  }, [currentPage, pdfDoc]);

  // Drawing functions (keeping your existing drawing functionality)
  const startDrawing = (e) => {
    if (activeTool === "none") return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    if (activeTool === "dot") {
      drawDot(ctx, x, y);
      setIsDrawing(false);
    }
  };

  const draw = (e) => {
    if (!isDrawing || activeTool === "none" || activeTool === "dot") return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = activeTool === "eraser" ? 20 : (activeTool === "pen" ? 2 : 1);
    ctx.lineCap = "round";
    
    if (activeTool === "line") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(canvas.startX, canvas.startY);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const drawDot = (ctx, x, y) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = drawColor;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
  };

  const handleToolChange = (tool) => {
    setActiveTool(tool);
  };

  const handleColorChange = (color) => {
    setDrawColor(color);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleShowAnswers = () => {
    setShowAnswers(true);
  };

  const handleResetAnswers = () => {
    setShowAnswers(false);
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
                <div className="tab-text">Content</div>
              </div>
              <div 
                className={`tab-wrapper ${activeTab === "resources" ? "tab-active" : "tab-inactive"}`}
                onClick={() => setActiveTab("resources")}
              >
                <div className="tab-text">Additional Resources</div>
              </div>
              <div 
                className={`tab-wrapper ${activeTab === "test" ? "tab-active" : "tab-inactive"}`}
                onClick={() => setActiveTab("test")}
              >
                <div className="tab-text">Test</div>
              </div>
            </div>

            {/* Hidden canvas for PDF rendering */}
            <canvas 
              ref={pdfCanvasRef} 
              style={{ display: 'none' }}
            />

            {/* Content Areas */}
            {activeTab === "content" && (
              <>
                {/* Editing Tools - Positioned as vertical row */}
                <div className="editing-tools-overlay">
                  <div className="tool-section">
                    <div className="tool-label">Color</div>
                    <input
                      type="color"
                      value={drawColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="color-picker-tool"
                    />
                  </div>
                  
                  <div 
                    className={`tool-button ${activeTool === "pen" ? "tool-active" : ""}`}
                    onClick={() => handleToolChange("pen")}
                  >
                    <div className="tool-text">Pen</div>
                  </div>
                  
                  <div 
                    className={`tool-button ${activeTool === "eraser" ? "tool-active" : ""}`}
                    onClick={() => handleToolChange("eraser")}
                  >
                    <div className="tool-text">Eraser</div>
                  </div>
                  
                  <div 
                    className={`tool-button ${activeTool === "text" ? "tool-active" : ""}`}
                    onClick={() => handleToolChange("text")}
                  >
                    <div className="tool-text">Text</div>
                  </div>
                  
                  <div 
                    className={`tool-button ${activeTool === "line" ? "tool-active" : ""}`}
                    onClick={() => handleToolChange("line")}
                  >
                    <div className="tool-text">Line</div>
                  </div>
                  
                  <div 
                    className={`tool-button ${activeTool === "dot" ? "tool-active" : ""}`}
                    onClick={() => handleToolChange("dot")}
                  >
                    <div className="tool-text">Dot</div>
                  </div>
                  
                  <div 
                    className="tool-button tool-clear"
                    onClick={clearCanvas}
                  >
                    <div className="tool-text">Clear</div>
                  </div>
                </div>

                {/* PDF Book Container */}
                <div className="pdf-book-container">
                  {/* PDF Book Pages */}
                  <div className="book-wrapper">
                    <div className="book-page">
                      {/* Loading indicator */}
                      {pageLoading && (
                        <div className="page-loading">
                          Loading page {currentPage}...
                        </div>
                      )}
                      
                      {/* Current page image */}
                      {pageImageUrl && !pageLoading && (
                        <img 
                          src={pageImageUrl}
                          alt={`Page ${currentPage}`}
                          className="pdf-page-image"
                        />
                      )}
                      
                      {/* Drawing Canvas Overlay */}
                      <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        className="drawing-canvas"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                    </div>
                  </div>

                  {/* Simple Arrow Navigation Below PDF */}
                  <div className="page-controls">
                    <button 
                      className="page-arrow-btn" 
                      onClick={prevPage}
                      disabled={currentPage === 1 || pageLoading}
                    >
                      &lt;
                    </button>
                    
                    <button 
                      className="page-arrow-btn" 
                      onClick={nextPage}
                      disabled={currentPage === totalPages || pageLoading}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
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
            {activeTab === "test" && (
              <>
                {/* Test Tab Buttons */}
                <div className="test-buttons-overlay">
                  <div 
                    className="test-button-wrapper show-button"
                    onClick={handleShowAnswers}
                  >
                    <div className="test-button-text">Show</div>
                  </div>
                  <div 
                    className="test-button-wrapper reset-button"
                    onClick={handleResetAnswers}
                  >
                    <div className="test-button-text">Reset</div>
                  </div>
                </div>

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
                  {/* Use rendered page image for test tab too */}
                  <div className="book-wrapper">
                    <div className="book-page">
                      {pageLoading && (
                        <div className="page-loading">
                          Loading page {currentPage}...
                        </div>
                      )}
                      
                      {pageImageUrl && !pageLoading && (
                        <img 
                          src={showAnswers ? answersUrl : pageImageUrl}
                          alt={`Test Page ${currentPage}`}
                          className="pdf-page-image"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};