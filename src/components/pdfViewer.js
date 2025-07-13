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
  Ban
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
  
  // NEW: Additional states for resource and test data
  const [topicData, setTopicData] = useState(null);
  const [resourceUrl, setResourceUrl] = useState(null);
  const [testPdfUrl, setTestPdfUrl] = useState(null);
  const [testPdfAnswersUrl, setTestPdfAnswersUrl] = useState(null); // NEW: For answers PDF
  
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
  
  // New states for text boxes and lines
  const [textBoxes, setTextBoxes] = useState([]);
  const [editingTextBox, setEditingTextBox] = useState(null);
  const [drawnLines, setDrawnLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  
  // Drag state for text boxes
  const [draggingTextBox, setDraggingTextBox] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Check PDF.js availability
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.pdfjsLib) {
      console.error("PDF.js not found. Please include PDF.js in your HTML:");
      console.error("Add this to your index.html:");
      console.error('<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>');
      setError("PDF.js library not loaded. Please include PDF.js script in your HTML file.");
    }
  }, []);

  // UPDATED: Fetch topic data including all fields including testpdfanswers
  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        if (!tid) throw new Error("Topic ID is missing");

        const res = await axios.get(
          `https://backend-937324960970.us-central1.run.app/v1/teacherResource/topic/${tid}`
        );
        
        const { pdfPath, TNAME, resource, testpdf, testpdfanswers } = res.data.topic;
        
        console.log("Fetched topic data:", res.data.topic); // Debug log
        
        // Store all topic data
        setTopicData(res.data.topic);
        setTopicTitle(TNAME || "Untitled Topic");
        
        // Set URLs
        if (pdfPath) {
          // Remove the "public/uploads/" prefix and use Cloud Storage URL
          const filename = pdfPath.replace('public/uploads/', '');
          setPdfUrl(`https://storage.googleapis.com/dilly-tally-pdfs/${filename}`);
        }
        
        if (testpdf) {
          const filename = testpdf.replace('public/uploads/', '');
          setTestPdfUrl(`https://storage.googleapis.com/dilly-tally-pdfs/${filename}`);
        }
        
        if (testpdfanswers) {
          const filename = testpdfanswers.replace('public/uploads/', '');
          setTestPdfAnswersUrl(`https://storage.googleapis.com/dilly-tally-pdfs/${filename}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching topic data:", err);
        setError(err.message || "Failed to load topic data");
        setLoading(false);
      }
    };

    fetchTopicData();
  }, [tid]);

  // Initialize PDF.js and load first page
  useEffect(() => {
    if (pdfUrl && activeTab === "content") {
      console.log("PDF URL:", pdfUrl);
      if (window.pdfjsLib) {
        console.log("PDF.js loaded, attempting to load document");
        loadPdfDocument(pdfUrl);
      } else {
        console.error("PDF.js not loaded. Make sure to include PDF.js script in your HTML");
      }
    }
  }, [pdfUrl, activeTab]);

  // UPDATED: Handle tab changes and load appropriate content
  useEffect(() => {
    if (activeTab === "test") {
      // Determine which PDF to load based on showAnswers state
      const pdfToLoad = showAnswers && testPdfAnswersUrl ? testPdfAnswersUrl : testPdfUrl;
      
      if (pdfToLoad && window.pdfjsLib) {
        console.log("Loading test PDF:", pdfToLoad);
        loadPdfDocument(pdfToLoad);
      }
    } else if (activeTab === "content" && pdfUrl) {
      // Load main content PDF when switching to content tab
      if (window.pdfjsLib) {
        loadPdfDocument(pdfUrl);
      }
    }
    
    // Clear drawings when switching tabs
    clearAllDrawings();
  }, [activeTab, pdfUrl, testPdfUrl, testPdfAnswersUrl, showAnswers]);

  // UPDATED: Load PDF document and render first page
  const loadPdfDocument = async (documentUrl) => {
    try {
      console.log("Loading PDF document from:", documentUrl);
      
      if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${window.pdfjsLib.version}/pdf.worker.min.js`;
      }
      
      const loadingTask = window.pdfjsLib.getDocument({
        url: documentUrl,
        withCredentials: false,
        httpHeaders: {
          'Accept': 'application/pdf'
        }
      });
      
      const pdf = await loadingTask.promise;
      console.log("PDF loaded successfully. Pages:", pdf.numPages);
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1); // Reset to first page when loading new document
      
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
        
        // Redraw all lines on canvas resize
        redrawCanvas();
        
        console.log("Canvas resized successfully");
      }, 100);
    }
  };

  // Redraw all existing lines on the canvas
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw all stored lines
    drawnLines.forEach(line => {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      ctx.beginPath();
      ctx.moveTo(line.startX, line.startY);
      ctx.lineTo(line.endX, line.endY);
      ctx.stroke();
    });
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
  }, [pageImageUrl, drawnLines]);

  // Page navigation functions
  const nextPage = async () => {
    console.log("Next page clicked. Current:", currentPage, "Total:", totalPages, "Loading:", pageLoading);
    if (currentPage < totalPages && pdfDoc && !pageLoading) {
      const newPage = currentPage + 1;
      console.log("Navigating to page:", newPage);
      setCurrentPage(newPage);
      clearAllDrawings();
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
      clearAllDrawings();
      await renderPage(pdfDoc, newPage);
    } else {
      console.log("Cannot go to previous page - at beginning or loading");
    }
  };

  const goToPage = async (pageNum) => {
    console.log("Go to page:", pageNum);
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage && pdfDoc && !pageLoading) {
      setCurrentPage(pageNum);
      clearAllDrawings();
      await renderPage(pdfDoc, pageNum);
    }
  };

  // Drawing functions
  const startDrawing = (e) => {
    if (activeTool === "none") return;
    
    console.log("Starting to draw with tool:", activeTool);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    console.log("Drawing at coordinates:", x, y);
    
    if (activeTool === "text") {
      createTextBox(x, y);
      return;
    }
    
    setIsDrawing(true);
    setStartPos({ x, y });
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    if (activeTool === "dot") {
      drawDot(ctx, x, y);
      setIsDrawing(false);
    } else if (activeTool === "line") {
      // Start drawing the current line
      setCurrentLine({ startX: x, startY: y, endX: x, endY: y, color: drawColor });
    }
  };

  const draw = (e) => {
    if (!isDrawing || activeTool === "none" || activeTool === "dot" || activeTool === "text") return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    if (activeTool === "line") {
      // Clear canvas and redraw all existing lines plus current line
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Redraw all stored lines
      drawnLines.forEach(line => {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        ctx.beginPath();
        ctx.moveTo(line.startX, line.startY);
        ctx.lineTo(line.endX, line.endY);
        ctx.stroke();
      });
      
      // Draw current line
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // Update current line end position
      setCurrentLine(prev => ({ ...prev, endX: x, endY: y }));
    } else {
      // Regular pen or eraser drawing
      ctx.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over";
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = activeTool === "eraser" ? 20 : (activeTool === "pen" ? 3 : 2);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (activeTool === "line" && currentLine && isDrawing) {
      // Save the completed line
      setDrawnLines(prev => [...prev, currentLine]);
      setCurrentLine(null);
    }
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

  // Text box functions
  const createTextBox = (x, y) => {
    const newTextBox = {
      id: Date.now(),
      x: x,
      y: y,
      text: "",
      color: drawColor,
      fontSize: 16,
      isEditing: true
    };
    
    setTextBoxes(prev => [...prev, newTextBox]);
    setEditingTextBox(newTextBox.id);
  };

  const updateTextBox = (id, newText) => {
    setTextBoxes(prev => 
      prev.map(box => 
        box.id === id ? { ...box, text: newText } : box
      )
    );
  };

  const finishEditingTextBox = (id) => {
    setTextBoxes(prev => 
      prev.map(box => 
        box.id === id ? { ...box, isEditing: false } : box
      )
    );
    setEditingTextBox(null);
  };

  const deleteTextBox = (id) => {
    setTextBoxes(prev => prev.filter(box => box.id !== id));
    if (editingTextBox === id) {
      setEditingTextBox(null);
    }
  };

  // Drag functions for text boxes
  const handleTextBoxMouseDown = (e, textBoxId) => {
    if (activeTool !== 'text') return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const textBox = textBoxes.find(box => box.id === textBoxId);
    if (!textBox) return;
    
    const textBoxX = (textBox.x / canvas.width) * rect.width;
    const textBoxY = (textBox.y / canvas.height) * rect.height;
    
    setDraggingTextBox(textBoxId);
    setDragOffset({
      x: mouseX - textBoxX,
      y: mouseY - textBoxY
    });
  };

  const handleTextBoxMouseMove = (e) => {
    if (!draggingTextBox || activeTool !== 'text') return;
    
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const newX = ((mouseX - dragOffset.x) / rect.width) * canvas.width;
    const newY = ((mouseY - dragOffset.y) / rect.height) * canvas.height;
    
    // Constrain to canvas bounds
    const constrainedX = Math.max(0, Math.min(newX, canvas.width - 50));
    const constrainedY = Math.max(0, Math.min(newY, canvas.height - 20));
    
    setTextBoxes(prev =>
      prev.map(box =>
        box.id === draggingTextBox
          ? { ...box, x: constrainedX, y: constrainedY }
          : box
      )
    );
  };

  const handleTextBoxMouseUp = () => {
    setDraggingTextBox(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Add global mouse event listeners for text box dragging
  useEffect(() => {
    if (draggingTextBox) {
      document.addEventListener('mousemove', handleTextBoxMouseMove);
      document.addEventListener('mouseup', handleTextBoxMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleTextBoxMouseMove);
        document.removeEventListener('mouseup', handleTextBoxMouseUp);
      };
    }
  }, [draggingTextBox, dragOffset]);

  const handleToolChange = (tool) => {
    setActiveTool(tool);
    // Stop editing any text box when switching tools
    if (editingTextBox) {
      finishEditingTextBox(editingTextBox);
    }
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

  const clearAllDrawings = () => {
    clearCanvas();
    setTextBoxes([]);
    setDrawnLines([]);
    setCurrentLine(null);
    setEditingTextBox(null);
    setDraggingTextBox(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // UPDATED: Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAnswers(false); // Reset answers when switching tabs
    clearAllDrawings(); // Clear any drawings when switching tabs
  };

  // UPDATED: Handle showing answers - now loads the answers PDF
  const handleShowAnswers = () => {
    console.log("Show answers clicked");
    console.log("testPdfAnswersUrl:", testPdfAnswersUrl);
    
    if (testPdfAnswersUrl && window.pdfjsLib) {
      setShowAnswers(true);
      loadPdfDocument(testPdfAnswersUrl);
    } else if (!testPdfAnswersUrl) {
      console.log("No answers PDF available");
      // You could show a message to the user here
      alert("No answer sheet available for this test.");
    }
  };

  // UPDATED: Handle hiding answers - loads the original test PDF
  const handleResetAnswers = () => {
    console.log("Reset answers clicked");
    console.log("testPdfUrl:", testPdfUrl);
    
    if (testPdfUrl && window.pdfjsLib) {
      setShowAnswers(false);
      loadPdfDocument(testPdfUrl);
    }
  };

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h3>Loading Topic Data...</h3>
      <p>Please wait while we fetch your topic information.</p>
    </div>
  );
  
  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
      <h3>Error Loading Topic</h3>
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
                onClick={() => handleTabChange("content")}
              >
                <div className="tab-text">Content</div>
              </div>
              <div 
                className={`tab-wrapper ${activeTab === "resources" ? "tab-active" : "tab-inactive"}`}
                onClick={() => handleTabChange("resources")}
              >
                <div className="tab-text">Additional Resources</div>
              </div>
              <div 
                className={`tab-wrapper ${activeTab === "test" ? "tab-active" : "tab-inactive"}`}
                onClick={() => handleTabChange("test")}
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
                    onClick={clearAllDrawings}
                    title="Clear All"
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
                                    activeTool === "dot" ? "pointer" :
                                    activeTool === "text" ? "text" : "default",
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
                      
                      {/* Text Boxes Overlay */}
                      {textBoxes.map(textBox => (
                        <div
                          key={textBox.id}
                          className="text-box-overlay"
                          style={{
                            position: 'absolute',
                            left: `${(textBox.x / (canvasRef.current?.width || 1)) * 100}%`,
                            top: `${(textBox.y / (canvasRef.current?.height || 1)) * 100}%`,
                            zIndex: 15,
                            minWidth: '100px',
                            minHeight: '25px',
                            cursor: draggingTextBox === textBox.id ? 'grabbing' : 
                                   (activeTool === 'text' && !textBox.isEditing ? 'grab' : 'default')
                          }}
                          onMouseDown={(e) => {
                            if (!textBox.isEditing) {
                              handleTextBoxMouseDown(e, textBox.id);
                            }
                          }}
                        >
                          {textBox.isEditing ? (
                            <input
                              type="text"
                              value={textBox.text}
                              onChange={(e) => updateTextBox(textBox.id, e.target.value)}
                              onBlur={() => finishEditingTextBox(textBox.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  finishEditingTextBox(textBox.id);
                                } else if (e.key === 'Escape') {
                                  deleteTextBox(textBox.id);
                                }
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                              autoFocus
                              style={{
                                border: '2px dashed rgba(161, 202, 172, 0.8)',
                                background: 'transparent',
                                color: textBox.color,
                                fontSize: `${textBox.fontSize}px`,
                                padding: '4px 6px',
                                outline: 'none',
                                borderRadius: '3px',
                                minWidth: '100px',
                                boxShadow: 'none',
                                cursor: 'text'
                              }}
                              placeholder="Type text..."
                            />
                          ) : (
                            <div
                              style={{
                                color: textBox.color,
                                fontSize: `${textBox.fontSize}px`,
                                background: 'transparent',
                                padding: '4px 6px',
                                borderRadius: '3px',
                                cursor: activeTool === 'text' ? 'grab' : 'pointer',
                                border: draggingTextBox === textBox.id ? '2px dashed rgba(161, 202, 172, 1)' : '1px solid transparent',
                                minHeight: '20px',
                                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
                                userSelect: 'none'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (activeTool === 'text' && !draggingTextBox) {
                                  setTextBoxes(prev => 
                                    prev.map(box => 
                                      box.id === textBox.id ? { ...box, isEditing: true } : box
                                    )
                                  );
                                  setEditingTextBox(textBox.id);
                                }
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                deleteTextBox(textBox.id);
                              }}
                              title={draggingTextBox === textBox.id ? "Dragging..." : "Drag to move, click to edit, double-click to delete"}
                            >
                              {textBox.text || 'Empty text'}
                            </div>
                          )}
                        </div>
                      ))}
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
                        backgroundColor: (currentPage === 1 || pageLoading) ? '#f5f5f5' : '#a8d5a8',
                        color: (currentPage === 1 || pageLoading) ? '#bbb' : '#ffffff',
                        border: (currentPage === 1 || pageLoading) ? '0px solid #e0e0e0' : '0px solid #28a745',
                        borderRadius: '6px',
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
                          e.target.style.backgroundColor = '#8bb896';
                          e.target.style.borderColor = '#8bb896';
                          e.target.style.color = '#ffffff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.backgroundColor = '#a8d5a8';
                          e.target.style.borderColor = '#28a745';
                          e.target.style.color = '#ffffff';
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
                          e.target.style.backgroundColor = '#8bb896';
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

            {/* UPDATED: Additional Resources Tab */}
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
                justifyContent: "center",
                alignItems: "center"
              }}>
                {resourceUrl ? (
                  <iframe
                    src={resourceUrl}
                    title="Additional Resource"
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px"
                    }}
                  />
                ) : (
                  <div style={{
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '18px',
                    padding: '2rem'
                  }}>
                    <p>No additional resource available for this topic.</p>
                    <p style={{ fontSize: '14px', marginTop: '1rem' }}>
                      The resource will be displayed here when available.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* UPDATED: Test Tab with Real PDF Switching */}
            {activeTab === "test" && (
              <>
                {testPdfUrl ? (
                  <>
                    {/* Test Tab Buttons */}
                    <div className="test-buttons-overlay">
                      <div 
                        className="test-button-wrapper show-button"
                        onClick={handleShowAnswers}
                        style={{
                          opacity: testPdfAnswersUrl ? 1 : 0.5,
                          cursor: testPdfAnswersUrl ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <div className="test-button-text">
                          {testPdfAnswersUrl ? 'Show Answers' : 'No Answers Available'}
                        </div>
                      </div>
                      <div 
                        className="test-button-wrapper reset-button"
                        onClick={handleResetAnswers}
                        style={{
                          opacity: showAnswers ? 1 : 0.5,
                          cursor: showAnswers ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <div className="test-button-text">Hide Answers</div>
                      </div>
                    </div>

                    {/* PDF Book Container - Same as Content Tab but without editing */}
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
                          
                          {/* Current page image - Shows different PDF based on showAnswers state */}
                          {pageImageUrl && !pageLoading && (
                            <img 
                              src={pageImageUrl}
                              alt={`Test Page ${currentPage}${showAnswers ? ' (Answers)' : ''}`}
                              className="pdf-page-image"
                              style={{
                                display: 'block',
                                maxWidth: '100%',
                                height: 'auto',
                                userSelect: 'none',
                                pointerEvents: 'none',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                borderRadius: '8px',
                                border: showAnswers ? '3px solid #28a745' : 'none'
                              }}
                            />
                          )}
                          
                          {/* Show visual indicator when answers are displayed */}
                          {showAnswers && pageImageUrl && !pageLoading && (
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              backgroundColor: 'rgba(40, 167, 69, 0.9)',
                              color: 'white',
                              padding: '8px 16px',
                              borderRadius: '20px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                              zIndex: 5
                            }}>
                              ✓ Answer Sheet
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Page Navigation Below PDF - Same as Content Tab */}
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
                            backgroundColor: (currentPage === 1 || pageLoading) ? '#f5f5f5' : '#a8d5a8',
                            color: (currentPage === 1 || pageLoading) ? '#bbb' : '#ffffff',
                            border: (currentPage === 1 || pageLoading) ? '0px solid #e0e0e0' : '0px solid #28a745',
                            borderRadius: '6px',
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
                              e.target.style.backgroundColor = '#8bb896';
                              e.target.style.borderColor = '#8bb896';
                              e.target.style.color = '#ffffff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.backgroundColor = '#a8d5a8';
                              e.target.style.borderColor = '#28a745';
                              e.target.style.color = '#ffffff';
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
                              e.target.style.backgroundColor = '#8bb896';
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
                ) : (
                  <div style={{
                    position: "absolute",
                    top: "280px",
                    left: "56px",
                    width: "1328px",
                    height: "591px",
                    backgroundColor: "#ffffff",
                    padding: "2rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '18px'
                  }}>
                    <div>
                      <p>No test PDF available for this topic.</p>
                      <p style={{ fontSize: '14px', marginTop: '1rem' }}>
                        The test content will be displayed here when available.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};