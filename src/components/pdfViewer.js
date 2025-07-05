import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/auth";
import "../styles/pdfView.css";
import { 
  Pen, 
  Eraser, 
  Type, 
  Minus, 
  Circle, 
  Trash2, 
  Ban,
  Palette
} from "lucide-react";

export const PdfViewer = () => {
  const { tid } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("content");
  const [showAnswers, setShowAnswers] = useState(false);
  const [drawColor, setDrawColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState("none");
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // PDF Book specific states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageImageUrl, setPageImageUrl] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const pdfCanvasRef = useRef(null);
  const pdfImageRef = useRef(null);

  // Store drawing start position for line tool
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Placeholder URL for PDF with answers
  const answersUrl = "PLACEHOLDER_ANSWERS_PDF_URL";

  // Check PDF.js availability
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.pdfjsLib) {
      console.error("PDF.js not found. Please include PDF.js in your HTML:");
      console.error("Add this to your index.html:");
      console.error('<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>');
      setError("PDF.js library not loaded. Please include PDF.js script in your HTML file.");
    }
  }, []);

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
    if (pdfUrl) {
      console.log("PDF URL:", pdfUrl);
      if (window.pdfjsLib) {
        console.log("PDF.js loaded, attempting to load document");
        loadPdfDocument();
      } else {
        console.error("PDF.js not loaded. Make sure to include PDF.js script in your HTML");
      }
    }
  }, [pdfUrl]);

  // Load PDF document and render first page
  const loadPdfDocument = async () => {
    try {
      console.log("Loading PDF document from:", pdfUrl);
      
      if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${window.pdfjsLib.version}/pdf.worker.min.js`;
      }
      
      const loadingTask = window.pdfjsLib.getDocument({
        url: pdfUrl,
        withCredentials: false,
        httpHeaders: {
          'Accept': 'application/pdf'
        }
      });
      
      const pdf = await loadingTask.promise;
      console.log("PDF loaded successfully. Pages:", pdf.numPages);
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      
      await renderPage(pdf, 1);
    } catch (error) {
      console.error("Error loading PDF document:", error);
      setError(`Failed to load PDF: ${error.message}`);
    }
  };

  // Render a specific page to canvas and return as image URL
  const renderPage = async (pdf, pageNumber) => {
    setPageLoading(true);
    try {
      console.log("Rendering page:", pageNumber);
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      const page = await pdf.getPage(pageNumber);
      
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      console.log("Page rendered successfully");
      
      const imageUrl = canvas.toDataURL('image/png');
      setPageImageUrl(imageUrl);
      setPageLoading(false);
      
      return imageUrl;
    } catch (error) {
      console.error("Error rendering page:", error);
      setError(`Failed to render page: ${error.message}`);
      setPageLoading(false);
      return null;
    }
  };

  // Resize drawing canvas to match PDF image
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const pdfImage = pdfImageRef.current;
    
    if (canvas && pdfImage) {
      setTimeout(() => {
        const rect = pdfImage.getBoundingClientRect();
        console.log("Resizing canvas to match image:", rect.width, "x", rect.height);
        
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '10';
        canvas.style.pointerEvents = 'auto';
        
        console.log("Canvas resized successfully");
      }, 100);
    }
  };

  // Resize canvas when PDF image loads
  useEffect(() => {
    if (pageImageUrl && pdfImageRef.current) {
      const img = pdfImageRef.current;
      
      const handleImageLoad = () => {
        console.log("PDF image loaded, resizing canvas");
        resizeCanvas();
      };
      
      if (img.complete && img.naturalHeight !== 0) {
        handleImageLoad();
      } else {
        img.onload = handleImageLoad;
        setTimeout(resizeCanvas, 200);
      }
      
      const handleResize = () => {
        setTimeout(resizeCanvas, 100);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [pageImageUrl]);

  // Page navigation functions
  const nextPage = async () => {
    console.log("Next page clicked. Current:", currentPage, "Total:", totalPages, "Loading:", pageLoading);
    if (currentPage < totalPages && pdfDoc && !pageLoading) {
      const newPage = currentPage + 1;
      console.log("Navigating to page:", newPage);
      setCurrentPage(newPage);
      clearCanvas();
      await renderPage(pdfDoc, newPage);
    } else {
      console.log("Cannot go to next page - at end or loading");
    }
  };

  const prevPage = async () => {
    console.log("Previous page clicked. Current:", currentPage, "Loading:", pageLoading);
    if (currentPage > 1 && pdfDoc && !pageLoading) {
      const newPage = currentPage - 1;
      console.log("Navigating to page:", newPage);
      setCurrentPage(newPage);
      clearCanvas();
      await renderPage(pdfDoc, newPage);
    } else {
      console.log("Cannot go to previous page - at beginning or loading");
    }
  };

  const goToPage = async (pageNum) => {
    console.log("Go to page:", pageNum);
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage && pdfDoc && !pageLoading) {
      setCurrentPage(pageNum);
      clearCanvas();
      await renderPage(pdfDoc, pageNum);
    }
  };

  // Drawing functions
  const startDrawing = (e) => {
    if (activeTool === "none") return;
    
    console.log("Starting to draw with tool:", activeTool);
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    console.log("Drawing at coordinates:", x, y);
    
    setStartPos({ x, y });
    
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
    
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    ctx.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = activeTool === "eraser" ? 20 : (activeTool === "pen" ? 3 : 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    if (activeTool === "line") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
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
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
    console.log("Drew dot at:", x, y);
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

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h3>Loading PDF...</h3>
      <p>Please wait while we fetch your PDF document.</p>
    </div>
  );
  
  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
      <h3>Error Loading PDF</h3>
      <p>{error}</p>
      <details style={{ marginTop: '1rem', textAlign: 'left' }}>
        <summary>Troubleshooting Steps:</summary>
        <ol>
          <li>Make sure PDF.js is included in your index.html:
            <pre style={{ background: '#f0f0f0', padding: '0.5rem', margin: '0.5rem 0' }}>
{`<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>`}
            </pre>
          </li>
          <li>Check if the PDF URL is accessible: <a href={pdfUrl} target="_blank" rel="noopener noreferrer">{pdfUrl}</a></li>
          <li>Verify CORS settings on your server</li>
          <li>Check browser console for additional error messages</li>
        </ol>
      </details>
    </div>
  );

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

            {/* Content Areas */}
            {activeTab === "content" && (
              <>
                {/* Editing Tools - Positioned as vertical row with icons */}
                <div className="editing-tools-overlay">
                  <div className="tool-section">
                    <div className="tool-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* <Palette size={14} style={{ marginRight: '2px' }} />
                      Color */}
                    </div>
                    <input
                      type="color"
                      value={drawColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="color-picker-tool"
                    />
                  </div>
                  
                  <div 
                    className={`tool-button ${activeTool === "none" ? "tool-active" : ""}`}
                    onClick={() => handleToolChange("none")}
                    title="None - Disable Drawing"
                    style={{ backgroundColor: activeTool === "none" ? "#a1caac" : "" }}
                  >
                    <Ban size={18} />
                  </div>
                  
                  <div 
                    className={`tool-button ${activeTool === "pen" ? "tool-active" : ""}`}
                    onClick={() => handleToolChange("pen")}
                    title="Pen Tool"
                  >
                    <Pen size={18} />
                  </div>
                  
                  <div 
                    className={`tool-button ${activeTool === "eraser" ? "tool-active" : ""}`}
                    onClick={() => handleToolChange("eraser")}
                    title="Eraser Tool"
                  >
                    <Eraser size={18} />
                  </div>
                  
                  <div 
                    className={`tool-button ${activeTool === "text" ? "tool-active" : ""}`}
                    onClick={() => handleToolChange("text")}
                    title="Text Tool"
                  >
                    <Type size={18} />
                  </div>
                  
                  <div 
                    className={`tool-button ${activeTool === "line" ? "tool-active" : ""}`}
                    onClick={() => handleToolChange("line")}
                    title="Line Tool"
                  >
                    <Minus size={18} />
                  </div>
                  
                  <div 
                    className={`tool-button ${activeTool === "dot" ? "tool-active" : ""}`}
                    onClick={() => handleToolChange("dot")}
                    title="Dot Tool"
                  >
                    <Circle size={18} />
                  </div>
                  
                  <div 
                    className="tool-button tool-clear"
                    onClick={clearCanvas}
                    title="Clear Canvas"
                  >
                    <Trash2 size={18} />
                  </div>
                </div>

                {/* PDF Book Container */}
                <div className="pdf-book-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* PDF Book Pages */}
                  <div className="book-wrapper" style={{ position: 'relative' }}>
                    <div className="book-page" style={{ position: 'relative', display: 'inline-block' }}>
                      {/* Loading indicator */}
                      {pageLoading && (
                        <div className="page-loading" style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          padding: '30px',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                          zIndex: 50,
                          textAlign: 'center',
                          border: '2px solid #28a745'
                        }}>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                            Loading page {currentPage}...
                          </div>
                          <div style={{ fontSize: '14px', color: '#666' }}>
                            Please wait while the page renders
                          </div>
                        </div>
                      )}
                      
                      {/* Current page image */}
                      {pageImageUrl && !pageLoading && (
                        <img 
                          ref={pdfImageRef}
                          src={pageImageUrl}
                          alt={`Page ${currentPage}`}
                          className="pdf-page-image"
                          style={{
                            display: 'block',
                            maxWidth: '100%',
                            height: 'auto',
                            userSelect: 'none',
                            pointerEvents: 'none',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            borderRadius: '8px'
                          }}
                          onLoad={() => {
                            console.log("Image onLoad triggered");
                            resizeCanvas();
                          }}
                        />
                      )}
                      
                      {/* Drawing Canvas Overlay */}
                      {pageImageUrl && !pageLoading && (
                        <canvas
                          ref={canvasRef}
                          className="drawing-canvas"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 10,
                            pointerEvents: activeTool === 'none' ? 'none' : 'auto',
                            cursor: activeTool === "pen" ? "crosshair" : 
                                    activeTool === "eraser" ? "grab" : 
                                    activeTool === "line" ? "crosshair" : 
                                    activeTool === "dot" ? "pointer" : "default",
                            border: '2px solid rgba(0,123,255,0.3)',
                            borderRadius: '8px'
                          }}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onClick={(e) => {
                            console.log("Canvas clicked at:", e.clientX, e.clientY);
                            console.log("Canvas dimensions:", canvasRef.current?.width, "x", canvasRef.current?.height);
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Page Navigation Below PDF */}
                  <div className="page-controls" style={{ 
                    marginTop: '15px', 
                    zIndex: 100, 
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '15px'
                  }}>
                    <button 
                      className="page-arrow-btn" 
                      onClick={prevPage}
                      disabled={currentPage === 1 || pageLoading}
                      style={{
                        width: '50px',
                        height: '35px',
                        fontSize: '18px',
                        backgroundColor: (currentPage === 1 || pageLoading) ? '#f5f5f5' : '#ffffff',
                        color: (currentPage === 1 || pageLoading) ? '#bbb' : '#666',
                        cursor: (currentPage === 1 || pageLoading) ? 'not-allowed' : 'pointer',
                        fontWeight: 'normal',
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.backgroundColor = '#f8f9fa';
                          e.target.style.borderColor = '#ccc';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.backgroundColor = '#ffffff';
                          e.target.style.borderColor = '#e0e0e0';
                        }
                      }}
                    >
                      &lt;
                    </button>
                    
                    <button 
                      className="page-arrow-btn" 
                      onClick={nextPage}
                      disabled={currentPage === totalPages || pageLoading}
                      style={{
                        width: '50px',
                        height: '35px',
                        fontSize: '18px',
                        backgroundColor: (currentPage === totalPages || pageLoading) ? '#f5f5f5' : '#a8d5a8',
                        color: (currentPage === totalPages || pageLoading) ? '#bbb' : '#ffffff',
                        border: (currentPage === totalPages || pageLoading) ? '0px solid #e0e0e0' : '0px solid #28a745',
                        borderRadius: '6px',
                        cursor: (currentPage === totalPages || pageLoading) ? 'not-allowed' : 'pointer',
                        fontWeight: 'normal',
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.backgroundColor = '#28a745';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.backgroundColor = '#a8d5a8';
                        }
                      }}
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