"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../api/auth"
import "../styles/pdfView.css"
import ScrollHeader from "./Header/ScrollHeader"
import { Pen, Eraser, Type, Minus, Circle, Trash2, Ban, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"

export const PdfViewer = () => {
  const { tid } = useParams()
  const navigate = useNavigate()
  const [pdfUrl, setPdfUrl] = useState(null)
  const [topicTitle, setTopicTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("content")
  const [showAnswers, setShowAnswers] = useState(false)
  const [drawColor, setDrawColor] = useState("#000000")
  const [activeTool, setActiveTool] = useState("none")
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Add after existing state declarations (around line 30)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Additional states for resource and test data
  const [topicData, setTopicData] = useState(null)
  const [resourceUrl, setResourceUrl] = useState(null)
  const [testPdfUrl, setTestPdfUrl] = useState(null)
  const [testPdfAnswersUrl, setTestPdfAnswersUrl] = useState(null)

  // PDF Book specific states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [pageImageUrl, setPageImageUrl] = useState(null)
  const [pageLoading, setPageLoading] = useState(false)
  const pdfCanvasRef = useRef(null)
  const pdfImageRef = useRef(null)

  // Store drawing start position for line tool
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  // States for text boxes and lines
  const [textBoxes, setTextBoxes] = useState([])
  const [editingTextBox, setEditingTextBox] = useState(null)
  const [drawnLines, setDrawnLines] = useState([])
  const [currentLine, setCurrentLine] = useState(null)

  // NEW: States for connected dots
  const [connectedDots, setConnectedDots] = useState([])
  const [lastDotPosition, setLastDotPosition] = useState(null)

  // Drag state for text boxes
  const [draggingTextBox, setDraggingTextBox] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Check PDF.js availability
  useEffect(() => {
    if (typeof window !== "undefined" && !window.pdfjsLib) {
      console.error("PDF.js not found. Please include PDF.js in your HTML:")
      console.error("Add this to your index.html:")
      console.error('<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>')
      setError("PDF.js library not loaded. Please include PDF.js script in your HTML file.")
    }
  }, [])

  // Fetch topic data including all fields including testpdfanswers
  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        if (!tid) throw new Error("Topic ID is missing")

        const res = await axios.get(`https://backend-844313246496.europe-west1.run.app/v1/teacherResource/topic/${tid}`)

        const { pdfPath, TNAME, resource, testpdf, testpdfanswers } = res.data.topic

        console.log("Fetched topic data:", res.data.topic)

        // Store all topic data
        setTopicData(res.data.topic)
        setTopicTitle(TNAME || "Untitled Topic")

        // Set URLs
        if (pdfPath) {
          setPdfUrl(`https://backend-844313246496.europe-west1.run.app/${pdfPath}`)
        }

        if (resource) {
          setResourceUrl(resource)
        }

        if (testpdf) {
          setTestPdfUrl(`https://backend-844313246496.europe-west1.run.app/${testpdf}`)
        }

        if (testpdfanswers) {
          setTestPdfAnswersUrl(`https://backend-844313246496.europe-west1.run.app/${testpdfanswers}`)
          console.log(
            "Test PDF answers URL set:",
            `https://backend-844313246496.europe-west1.run.app/${testpdfanswers}`,
          )
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching topic data:", err)
        setError(err.message || "Failed to load topic data")
        setLoading(false)
      }
    }

    fetchTopicData()
  }, [tid])

  // Initialize PDF.js and load first page
  useEffect(() => {
    if (pdfUrl && activeTab === "content") {
      console.log("PDF URL:", pdfUrl)
      if (window.pdfjsLib) {
        console.log("PDF.js loaded, attempting to load document")
        loadPdfDocument(pdfUrl)
      } else {
        console.error("PDF.js not loaded. Make sure to include PDF.js script in your HTML")
      }
    }
  }, [pdfUrl, activeTab])

  // Handle tab changes and load appropriate content
  useEffect(() => {
    if (activeTab === "test") {
      const pdfToLoad = showAnswers && testPdfAnswersUrl ? testPdfAnswersUrl : testPdfUrl

      if (pdfToLoad && window.pdfjsLib) {
        console.log("Loading test PDF:", pdfToLoad)
        loadPdfDocument(pdfToLoad)
      }
    } else if (activeTab === "content" && pdfUrl) {
      if (window.pdfjsLib) {
        loadPdfDocument(pdfUrl)
      }
    }

    clearAllDrawings()
  }, [activeTab, pdfUrl, testPdfUrl, testPdfAnswersUrl, showAnswers])

  // Load PDF document and render first page
  const loadPdfDocument = async (documentUrl) => {
    try {
      console.log("Loading PDF document from:", documentUrl)

      if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${window.pdfjsLib.version}/pdf.worker.min.js`
      }

      const loadingTask = window.pdfjsLib.getDocument({
        url: documentUrl,
        withCredentials: false,
        httpHeaders: {
          Accept: "application/pdf",
        },
      })

      const pdf = await loadingTask.promise
      console.log("PDF loaded successfully. Pages:", pdf.numPages)
      setPdfDoc(pdf)
      setTotalPages(pdf.numPages)
      setCurrentPage(1)

      await renderPage(pdf, 1)
    } catch (error) {
      console.error("Error loading PDF document:", error)
      setError(`Failed to load PDF: ${error.message}`)
    }
  }

  // Render a specific page to canvas and return as image URL
  const renderPage = async (pdf, pageNumber) => {
    setPageLoading(true)
    try {
      console.log("Rendering page:", pageNumber)

      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      const page = await pdf.getPage(pageNumber)

      // Increased scale for better readability
      const scale = 2.0
      const viewport = page.getViewport({ scale })
      canvas.width = viewport.width
      canvas.height = viewport.height

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      }

      await page.render(renderContext).promise
      console.log("Page rendered successfully")

      const imageUrl = canvas.toDataURL("image/png")
      setPageImageUrl(imageUrl)
      setPageLoading(false)

      return imageUrl
    } catch (error) {
      console.error("Error rendering page:", error)
      setError(`Failed to render page: ${error.message}`)
      setPageLoading(false)
      return null
    }
  }

  // Resize drawing canvas to match PDF image
  const resizeCanvas = () => {
    const canvas = canvasRef.current
    const pdfImage = pdfImageRef.current

    if (canvas && pdfImage) {
      // Wait for image to be fully loaded
      const checkImageLoaded = () => {
        if (pdfImage.complete && pdfImage.naturalWidth > 0 && pdfImage.naturalHeight > 0) {
          const rect = pdfImage.getBoundingClientRect()
          console.log("Resizing canvas to match image:", rect.width, "x", rect.height)

          if (rect.width > 0 && rect.height > 0) {
            canvas.width = rect.width
            canvas.height = rect.height
            canvas.style.width = `${rect.width}px`
            canvas.style.height = `${rect.height}px`
            canvas.style.position = "absolute"
            canvas.style.top = "0"
            canvas.style.left = "0"
            canvas.style.zIndex = "10"
            canvas.style.pointerEvents = "auto"

            redrawCanvas()
            console.log("Canvas resized successfully")
          } else {
            // Retry after a short delay if dimensions are still 0
            setTimeout(checkImageLoaded, 100)
          }
        } else {
          // Retry if image is not loaded yet
          setTimeout(checkImageLoaded, 100)
        }
      }

      checkImageLoaded()
    }
  }

  // NEW: Redraw all existing lines and connected dots on the canvas
  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw regular lines
    drawnLines.forEach((line) => {
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = line.color
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      ctx.moveTo(line.startX, line.startY)
      ctx.lineTo(line.endX, line.endY)
      ctx.stroke()
    })

    // Draw connected dots and their connecting lines
    connectedDots.forEach((dotData, index) => {
      ctx.globalCompositeOperation = "source-over"

      // Draw the dot
      ctx.fillStyle = dotData.color
      ctx.beginPath()
      ctx.arc(dotData.x, dotData.y, 4, 0, 2 * Math.PI)
      ctx.fill()

      // Draw line to next dot if it exists
      if (index < connectedDots.length - 1) {
        const nextDot = connectedDots[index + 1]
        ctx.strokeStyle = dotData.color
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        ctx.beginPath()
        ctx.moveTo(dotData.x, dotData.y)
        ctx.lineTo(nextDot.x, nextDot.y)
        ctx.stroke()
      }
    })
  }

  // Resize canvas when PDF image loads
  useEffect(() => {
    if (pageImageUrl && pdfImageRef.current) {
      const img = pdfImageRef.current

      const handleImageLoad = () => {
        console.log("PDF image loaded, resizing canvas")
        // Add a small delay to ensure the image is fully rendered
        setTimeout(() => {
          resizeCanvas()
        }, 50)
      }

      if (img.complete && img.naturalHeight !== 0) {
        handleImageLoad()
      } else {
        img.onload = handleImageLoad
        // Also add error handling
        img.onerror = (error) => {
          console.error("Error loading PDF image:", error)
        }
      }

      const handleResize = () => {
        setTimeout(resizeCanvas, 100)
      }

      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
        if (img.onload) img.onload = null
        if (img.onerror) img.onerror = null
      }
    }
  }, [pageImageUrl, drawnLines, connectedDots]) // Added connectedDots to dependencies

  // Add fullscreen handlers after the existing useEffect hooks
  const enterFullscreen = () => {
    setIsFullscreen(true)
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen()
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen()
    }
  }

  const exitFullscreen = () => {
    setIsFullscreen(false)
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      )
      if (!isCurrentlyFullscreen && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("msfullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("msfullscreenchange", handleFullscreenChange)
    }
  }, [isFullscreen])

  // Page navigation functions
  const nextPage = async () => {
    console.log("Next page clicked. Current:", currentPage, "Total:", totalPages, "Loading:", pageLoading)
    if (currentPage < totalPages && pdfDoc && !pageLoading) {
      const newPage = currentPage + 1
      console.log("Navigating to page:", newPage)
      setCurrentPage(newPage)
      clearAllDrawings()
      await renderPage(pdfDoc, newPage)
    } else {
      console.log("Cannot go to next page - at end or loading")
    }
  }

  const prevPage = async () => {
    console.log("Previous page clicked. Current:", currentPage, "Loading:", pageLoading)
    if (currentPage > 1 && pdfDoc && !pageLoading) {
      const newPage = currentPage - 1
      console.log("Navigating to page:", newPage)
      setCurrentPage(newPage)
      clearAllDrawings()
      await renderPage(pdfDoc, newPage)
    } else {
      console.log("Cannot go to previous page - at beginning or loading")
    }
  }

  const goToPage = async (pageNum) => {
    console.log("Go to page:", pageNum)
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage && pdfDoc && !pageLoading) {
      setCurrentPage(pageNum)
      clearAllDrawings()
      await renderPage(pdfDoc, pageNum)
    }
  }

  // Drawing functions
  const startDrawing = (e) => {
    if (activeTool === "none") return

    console.log("Starting to draw with tool:", activeTool)

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()

    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    console.log("Drawing at coordinates:", x, y)

    if (activeTool === "text") {
      createTextBox(x, y)
      return
    }

    if (activeTool === "dot") {
      // NEW: Handle connected dots
      const newDot = { x, y, color: drawColor }

      // Add the new dot to the connected dots array
      setConnectedDots((prev) => [...prev, newDot])

      // If there was a previous dot, draw a line to it immediately
      if (lastDotPosition) {
        const newLine = {
          startX: lastDotPosition.x,
          startY: lastDotPosition.y,
          endX: x,
          endY: y,
          color: drawColor,
        }

        // Draw the line on canvas immediately
        ctx.globalCompositeOperation = "source-over"
        ctx.strokeStyle = drawColor
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        ctx.beginPath()
        ctx.moveTo(lastDotPosition.x, lastDotPosition.y)
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      // Draw the new dot
      drawDot(ctx, x, y)

      // Update last dot position for next connection
      setLastDotPosition({ x, y })

      return
    }

    setIsDrawing(true)
    setStartPos({ x, y })

    ctx.beginPath()
    ctx.moveTo(x, y)

    if (activeTool === "line") {
      setCurrentLine({ startX: x, startY: y, endX: x, endY: y, color: drawColor })
    }
  }

  const draw = (e) => {
    if (!isDrawing || activeTool === "none" || activeTool === "dot" || activeTool === "text") return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()

    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    if (activeTool === "line") {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drawnLines.forEach((line) => {
        ctx.globalCompositeOperation = "source-over"
        ctx.strokeStyle = line.color
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        ctx.beginPath()
        ctx.moveTo(line.startX, line.startY)
        ctx.lineTo(line.endX, line.endY)
        ctx.stroke()
      })

      // Redraw connected dots when drawing lines
      connectedDots.forEach((dotData, index) => {
        ctx.globalCompositeOperation = "source-over"

        // Draw the dot
        ctx.fillStyle = dotData.color
        ctx.beginPath()
        ctx.arc(dotData.x, dotData.y, 4, 0, 2 * Math.PI)
        ctx.fill()

        // Draw line to next dot if it exists
        if (index < connectedDots.length - 1) {
          const nextDot = connectedDots[index + 1]
          ctx.strokeStyle = dotData.color
          ctx.lineWidth = 2
          ctx.lineCap = "round"
          ctx.lineJoin = "round"

          ctx.beginPath()
          ctx.moveTo(dotData.x, dotData.y)
          ctx.lineTo(nextDot.x, nextDot.y)
          ctx.stroke()
        }
      })

      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = drawColor
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      ctx.moveTo(startPos.x, startPos.y)
      ctx.lineTo(x, y)
      ctx.stroke()

      setCurrentLine((prev) => ({ ...prev, endX: x, endY: y }))
    } else {
      ctx.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over"
      ctx.strokeStyle = drawColor
      ctx.lineWidth = activeTool === "eraser" ? 20 : activeTool === "pen" ? 3 : 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    if (activeTool === "line" && currentLine && isDrawing) {
      setDrawnLines((prev) => [...prev, currentLine])
      setCurrentLine(null)
    }
    setIsDrawing(false)
  }

  const drawDot = (ctx, x, y) => {
    ctx.globalCompositeOperation = "source-over"
    ctx.fillStyle = drawColor
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
    console.log("Drew dot at:", x, y)
  }

  // Text box functions
  const createTextBox = (x, y) => {
    const newTextBox = {
      id: Date.now(),
      x: x,
      y: y,
      text: "",
      color: drawColor,
      fontSize: 16,
      isEditing: true,
    }

    setTextBoxes((prev) => [...prev, newTextBox])
    setEditingTextBox(newTextBox.id)
  }

  const updateTextBox = (id, newText) => {
    setTextBoxes((prev) => prev.map((box) => (box.id === id ? { ...box, text: newText } : box)))
  }

  const finishEditingTextBox = (id) => {
    setTextBoxes((prev) => prev.map((box) => (box.id === id ? { ...box, isEditing: false } : box)))
    setEditingTextBox(null)
  }

  const deleteTextBox = (id) => {
    setTextBoxes((prev) => prev.filter((box) => box.id !== id))
    if (editingTextBox === id) {
      setEditingTextBox(null)
    }
  }

  // Drag functions for text boxes
  const handleTextBoxMouseDown = (e, textBoxId) => {
    if (activeTool !== "text") return

    e.preventDefault()
    e.stopPropagation()

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const textBox = textBoxes.find((box) => box.id === textBoxId)
    if (!textBox) return

    const textBoxX = (textBox.x / canvas.width) * rect.width
    const textBoxY = (textBox.y / canvas.height) * rect.height

    setDraggingTextBox(textBoxId)
    setDragOffset({
      x: mouseX - textBoxX,
      y: mouseY - textBoxY,
    })
  }

  const handleTextBoxMouseMove = (e) => {
    if (!draggingTextBox || activeTool !== "text") return

    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const newX = ((mouseX - dragOffset.x) / rect.width) * canvas.width
    const newY = ((mouseY - dragOffset.y) / rect.height) * canvas.height

    const constrainedX = Math.max(0, Math.min(newX, canvas.width - 50))
    const constrainedY = Math.max(0, Math.min(newY, canvas.height - 20))

    setTextBoxes((prev) =>
      prev.map((box) => (box.id === draggingTextBox ? { ...box, x: constrainedX, y: constrainedY } : box)),
    )
  }

  const handleTextBoxMouseUp = () => {
    setDraggingTextBox(null)
    setDragOffset({ x: 0, y: 0 })
  }

  // Add global mouse event listeners for text box dragging
  useEffect(() => {
    if (draggingTextBox) {
      document.addEventListener("mousemove", handleTextBoxMouseMove)
      document.addEventListener("mouseup", handleTextBoxMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleTextBoxMouseMove)
        document.removeEventListener("mouseup", handleTextBoxMouseUp)
      }
    }
  }, [draggingTextBox, dragOffset])

  const handleToolChange = (tool) => {
    setActiveTool(tool)
    if (editingTextBox) {
      finishEditingTextBox(editingTextBox)
    }

    // NEW: Reset dot connection when switching tools
    if (tool !== "dot") {
      setLastDotPosition(null)
    }
  }

  const handleColorChange = (color) => {
    setDrawColor(color)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  // NEW: Updated clearAllDrawings to include connected dots
  const clearAllDrawings = () => {
    clearCanvas()
    setTextBoxes([])
    setDrawnLines([])
    setCurrentLine(null)
    setEditingTextBox(null)
    setDraggingTextBox(null)
    setDragOffset({ x: 0, y: 0 })
    // Clear connected dots and reset last position
    setConnectedDots([])
    setLastDotPosition(null)
  }

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setShowAnswers(false)
    clearAllDrawings()
  }

  // Handle showing answers - now loads the answers PDF
  const handleShowAnswers = () => {
    console.log("Show answers clicked")
    console.log("testPdfAnswersUrl:", testPdfAnswersUrl)

    if (testPdfAnswersUrl && window.pdfjsLib) {
      setShowAnswers(true)
      loadPdfDocument(testPdfAnswersUrl)
    } else if (!testPdfAnswersUrl) {
      console.log("No answers PDF available")
      alert("No answer sheet available for this test.")
    }
  }

  // Handle hiding answers - loads the original test PDF
  const handleResetAnswers = () => {
    console.log("Reset answers clicked")
    console.log("testPdfUrl:", testPdfUrl)

    if (testPdfUrl && window.pdfjsLib) {
      setShowAnswers(false)
      loadPdfDocument(testPdfUrl)
    }
  }

  // Handle back navigation
  const handleBackClick = () => {
    navigate(-1) // Go back to previous page
  }

  if (loading)
    return (
      <div className="modern-pdf-viewer">
        <ScrollHeader />
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <h3>Loading Topic Data...</h3>
            <p>Please wait while we fetch your topic information.</p>
          </div>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="modern-pdf-viewer">
        <ScrollHeader />
        <div className="error-container">
          <div className="error-content">
            <h3>Error Loading Topic</h3>
            <p>{error}</p>
            <details className="error-details">
              <summary>Troubleshooting Steps:</summary>
              <ol>
                <li>
                  Make sure PDF.js is included in your index.html:
                  <pre>
                    {`<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>`}
                  </pre>
                </li>
                <li>
                  Check if the PDF URL is accessible:{" "}
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    {pdfUrl}
                  </a>
                </li>
                <li>Verify CORS settings on your server</li>
                <li>Check browser console for additional error messages</li>
              </ol>
            </details>
          </div>
        </div>
      </div>
    )

  return (
    <div style={{ background: "white" }} className="modern-pdf-viewer">
      <ScrollHeader />

      {/* Main Content Wrapper - Fixed positioning to start after header */}
      <div className="pdf-viewer-wrapper">
        {/* Back Navigation */}
        

        {/* Main Content Container - Fixed height to fit viewport */}
        <div className="pdf-viewer-container">
          {/* Header Section - Compact */}
          <div className="pdf-viewer-header">
            <div className="topic-info">
              <h1 className="topic-title">{topicTitle}</h1>
              <p className="topic-subtitle">Interactive Learning Content</p>
            </div>
          </div>

          {/* Tab Navigation - Compact */}
          <div className="tab-navigation">
            <div className="tab-container">
              <div className="back-navigation">
          <button className="back-btn" onClick={handleBackClick}>
            <ArrowLeft size={18} />
            Back to Topics
          </button>
        </div>
              <button
                className={`tab-button ${activeTab === "content" ? "active" : ""}`}
                onClick={() => handleTabChange("content")}
              >
                📚 Content
              </button>
              <button
                className={`tab-button ${activeTab === "resources" ? "active" : ""}`}
                onClick={() => handleTabChange("resources")}
              >
                🔗 Resources
              </button>
              <button
                className={`tab-button ${activeTab === "test" ? "active" : ""}`}
                onClick={() => handleTabChange("test")}
              >
                📝 Test
              </button>
            </div>
          </div>

          {/* Content Area - Fixed height */}
          {activeTab === "content" && (
            <div className="content-area">
              <div className="content-tab">
                {/* Page Navigation - Moved to Top Above PDF Container */}
                {totalPages > 0 && (
                  <div className="page-navigation-above-pdf">
                    <button className="nav-btn prev-btn" onClick={prevPage} disabled={currentPage === 1 || pageLoading}>
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <div className="page-info">
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

                    <button
                      className="nav-btn next-btn"
                      onClick={nextPage}
                      disabled={currentPage === totalPages || pageLoading}
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>

                    {/* Fullscreen Button */}
                    <button
                      className="fullscreen-btn"
                      onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v3" />
                      </svg>
                      Fullscreen
                    </button>
                  </div>
                )}

                {/* Fullscreen Content */}
                {isFullscreen ? (
                  <div className="fullscreen-content">
                    {/* Fullscreen Header with Exit and Page Navigation */}
                    <div className="fullscreen-header">
                      <button className="exit-fullscreen-btn" onClick={exitFullscreen} title="Exit Fullscreen">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3" />
                        </svg>
                        Exit Fullscreen
                      </button>

                      {/* Page Navigation in Fullscreen */}
                      {totalPages > 0 && (
                        <div className="fullscreen-page-navigation">
                          <button
                            className="nav-btn prev-btn"
                            onClick={prevPage}
                            disabled={currentPage === 1 || pageLoading}
                          >
                            <ChevronLeft size={16} />
                            Previous
                          </button>

                          <div className="page-info">
                            <span>
                              Page {currentPage} of {totalPages}
                            </span>
                          </div>

                          <button
                            className="nav-btn next-btn"
                            onClick={nextPage}
                            disabled={currentPage === totalPages || pageLoading}
                          >
                            Next
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Tools Sidebar - Compact for fullscreen */}
                    <div className="tools-sidebar-fullscreen">
                      <div className="tool-section">
                        <div
                          className="color-picker-rectangle"
                          style={{ backgroundColor: drawColor }}
                          onClick={() => document.getElementById("fullscreen-color-input").click()}
                          title="Click to change color"
                        >
                          <input
                            id="fullscreen-color-input"
                            type="color"
                            value={drawColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            style={{ display: "none" }}
                          />
                        </div>
                      </div>

                      <div className="tool-buttons-horizontal">
                        <button
                          className={`tool-btn ${activeTool === "none" ? "active" : ""}`}
                          onClick={() => handleToolChange("none")}
                          title="Disable Drawing"
                        >
                          <Ban size={14} />
                        </button>

                        <button
                          className={`tool-btn ${activeTool === "pen" ? "active" : ""}`}
                          onClick={() => handleToolChange("pen")}
                          title="Pen Tool"
                        >
                          <Pen size={14} />
                        </button>

                        <button
                          className={`tool-btn ${activeTool === "eraser" ? "active" : ""}`}
                          onClick={() => handleToolChange("eraser")}
                          title="Eraser Tool"
                        >
                          <Eraser size={14} />
                        </button>

                        <button
                          className={`tool-btn ${activeTool === "text" ? "active" : ""}`}
                          onClick={() => handleToolChange("text")}
                          title="Text Tool"
                        >
                          <Type size={14} />
                        </button>

                        <button
                          className={`tool-btn ${activeTool === "line" ? "active" : ""}`}
                          onClick={() => handleToolChange("line")}
                          title="Line Tool"
                        >
                          <Minus size={14} />
                        </button>

                        <button
                          className={`tool-btn ${activeTool === "dot" ? "active" : ""}`}
                          onClick={() => handleToolChange("dot")}
                          title="Connected Dots Tool"
                        >
                          <Circle size={14} />
                        </button>

                        <button className="tool-btn clear-btn" onClick={clearAllDrawings} title="Clear All">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* PDF Viewer - Fullscreen */}
                    <div className="pdf-viewer-fullscreen">
                      <div className="pdf-container-fullscreen">
                        {pageLoading && (
                          <div className="page-loading-overlay">
                            <div className="loading-spinner"></div>
                            <p>Loading page {currentPage}...</p>
                          </div>
                        )}

                        {pageImageUrl && !pageLoading && (
                          <div className="pdf-page-wrapper">
                            <img
                              ref={pdfImageRef}
                              src={pageImageUrl || "/placeholder.svg"}
                              alt={`Page ${currentPage}`}
                              className="pdf-page-image-fullscreen"
                              onLoad={() => resizeCanvas()}
                            />

                            {/* Drawing Canvas Overlay */}
                            <canvas
                              ref={canvasRef}
                              className="drawing-canvas"
                              style={{
                                pointerEvents: activeTool === "none" ? "none" : "auto",
                                cursor:
                                  activeTool === "pen"
                                    ? "crosshair"
                                    : activeTool === "eraser"
                                      ? "grab"
                                      : activeTool === "line"
                                        ? "crosshair"
                                        : activeTool === "dot"
                                          ? "pointer"
                                          : activeTool === "text"
                                            ? "text"
                                            : "default",
                              }}
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                            />

                            {/* Text Boxes Overlay */}
                            {textBoxes.map((textBox) => (
                              <div
                                key={textBox.id}
                                className="text-box-overlay"
                                style={{
                                  position: "absolute",
                                  left: `${(textBox.x / (canvasRef.current?.width || 1)) * 100}%`,
                                  top: `${(textBox.y / (canvasRef.current?.height || 1)) * 100}%`,
                                  zIndex: 15,
                                  minWidth: "100px",
                                  minHeight: "25px",
                                  cursor:
                                    draggingTextBox === textBox.id
                                      ? "grabbing"
                                      : activeTool === "text" && !textBox.isEditing
                                        ? "grab"
                                        : "default",
                                }}
                                onMouseDown={(e) => {
                                  if (!textBox.isEditing) {
                                    handleTextBoxMouseDown(e, textBox.id)
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
                                      if (e.key === "Enter") {
                                        finishEditingTextBox(textBox.id)
                                      } else if (e.key === "Escape") {
                                        deleteTextBox(textBox.id)
                                      }
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    autoFocus
                                    className="text-input"
                                    placeholder="Type text..."
                                  />
                                ) : (
                                  <div
                                    className="text-display"
                                    style={{
                                      color: textBox.color,
                                      fontSize: `${textBox.fontSize}px`,
                                      border:
                                        draggingTextBox === textBox.id ? "2px dashed #4CAF50" : "1px solid transparent",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (activeTool === "text" && !draggingTextBox) {
                                        setTextBoxes((prev) =>
                                          prev.map((box) =>
                                            box.id === textBox.id ? { ...box, isEditing: true } : box,
                                          ),
                                        )
                                        setEditingTextBox(textBox.id)
                                      }
                                    }}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation()
                                      deleteTextBox(textBox.id)
                                    }}
                                    title="Click to edit, double-click to delete"
                                  >
                                    {textBox.text || "Empty text"}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Normal Content Layout */
                  <div className="content-main">
                    {/* Tools Sidebar - Compact */}
                    <div className="tools-sidebar">
                      <div className="tools-header">
                        <h3>Tools</h3>
                      </div>

                      <div className="tool-section">
                        <label className="tool-label">Color</label>
                        <div
                          className="color-picker-rectangle"
                          style={{ backgroundColor: drawColor }}
                          onClick={() => document.getElementById("normal-color-input").click()}
                          title="Click to change color"
                        >
                          <input
                            id="normal-color-input"
                            type="color"
                            value={drawColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            style={{ display: "none" }}
                          />
                        </div>
                      </div>

                      <div className="tool-buttons">
                        <button
                          className={`tool-btn ${activeTool === "none" ? "active" : ""}`}
                          onClick={() => handleToolChange("none")}
                          title="Disable Drawing"
                        >
                          <Ban size={16} />
                        </button>

                        <button
                          className={`tool-btn ${activeTool === "pen" ? "active" : ""}`}
                          onClick={() => handleToolChange("pen")}
                          title="Pen Tool"
                        >
                          <Pen size={16} />
                        </button>

                        <button
                          className={`tool-btn ${activeTool === "eraser" ? "active" : ""}`}
                          onClick={() => handleToolChange("eraser")}
                          title="Eraser Tool"
                        >
                          <Eraser size={16} />
                        </button>

                        <button
                          className={`tool-btn ${activeTool === "text" ? "active" : ""}`}
                          onClick={() => handleToolChange("text")}
                          title="Text Tool"
                        >
                          <Type size={16} />
                        </button>

                        <button
                          className={`tool-btn ${activeTool === "line" ? "active" : ""}`}
                          onClick={() => handleToolChange("line")}
                          title="Line Tool"
                        >
                          <Minus size={16} />
                        </button>

                        <button
                          className={`tool-btn ${activeTool === "dot" ? "active" : ""}`}
                          onClick={() => handleToolChange("dot")}
                          title="Connected Dots Tool"
                        >
                          <Circle size={16} />
                        </button>

                        <button className="tool-btn clear-btn" onClick={clearAllDrawings} title="Clear All">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* PDF Viewer - Optimized height */}
                    <div className="pdf-viewer-main">
                      <div className="pdf-container">
                        {pageLoading && (
                          <div className="page-loading-overlay">
                            <div className="loading-spinner"></div>
                            <p>Loading page {currentPage}...</p>
                          </div>
                        )}

                        {pageImageUrl && !pageLoading && (
                          <div className="pdf-page-wrapper">
                            <img
                              ref={pdfImageRef}
                              src={pageImageUrl || "/placeholder.svg"}
                              alt={`Page ${currentPage}`}
                              className="pdf-page-image"
                              onLoad={() => resizeCanvas()}
                            />

                            {/* Drawing Canvas Overlay */}
                            <canvas
                              ref={canvasRef}
                              className="drawing-canvas"
                              style={{
                                pointerEvents: activeTool === "none" ? "none" : "auto",
                                cursor:
                                  activeTool === "pen"
                                    ? "crosshair"
                                    : activeTool === "eraser"
                                      ? "grab"
                                      : activeTool === "line"
                                        ? "crosshair"
                                        : activeTool === "dot"
                                          ? "pointer"
                                          : activeTool === "text"
                                            ? "text"
                                            : "default",
                              }}
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                            />

                            {/* Text Boxes Overlay */}
                            {textBoxes.map((textBox) => (
                              <div
                                key={textBox.id}
                                className="text-box-overlay"
                                style={{
                                  position: "absolute",
                                  left: `${(textBox.x / (canvasRef.current?.width || 1)) * 100}%`,
                                  top: `${(textBox.y / (canvasRef.current?.height || 1)) * 100}%`,
                                  zIndex: 15,
                                  minWidth: "100px",
                                  minHeight: "25px",
                                  cursor:
                                    draggingTextBox === textBox.id
                                      ? "grabbing"
                                      : activeTool === "text" && !textBox.isEditing
                                        ? "grab"
                                        : "default",
                                }}
                                onMouseDown={(e) => {
                                  if (!textBox.isEditing) {
                                    handleTextBoxMouseDown(e, textBox.id)
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
                                      if (e.key === "Enter") {
                                        finishEditingTextBox(textBox.id)
                                      } else if (e.key === "Escape") {
                                        deleteTextBox(textBox.id)
                                      }
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    autoFocus
                                    className="text-input"
                                    placeholder="Type text..."
                                  />
                                ) : (
                                  <div
                                    className="text-display"
                                    style={{
                                      color: textBox.color,
                                      fontSize: `${textBox.fontSize}px`,
                                      border:
                                        draggingTextBox === textBox.id ? "2px dashed #4CAF50" : "1px solid transparent",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (activeTool === "text" && !draggingTextBox) {
                                        setTextBoxes((prev) =>
                                          prev.map((box) =>
                                            box.id === textBox.id ? { ...box, isEditing: true } : box,
                                          ),
                                        )
                                        setEditingTextBox(textBox.id)
                                      }
                                    }}
                                    onDoubleClick={(e) => {
                                      e.stopPropagation()
                                      deleteTextBox(textBox.id)
                                    }}
                                    title="Click to edit, double-click to delete"
                                  >
                                    {textBox.text || "Empty text"}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {!pageImageUrl && !pageLoading && pdfUrl && (
                          <div className="no-content">
                            <h3>Loading PDF Content</h3>
                            <p>Please wait while the PDF content loads...</p>
                          </div>
                        )}

                        {!pdfUrl && !pageLoading && (
                          <div className="no-content">
                            <h3>No Content Available</h3>
                            <p>No PDF content available for this topic.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "resources" && (
            <div className="resources-tab">
              <div className="resources-container">
                {resourceUrl ? (
                  <iframe src={resourceUrl} title="Additional Resource" className="resource-iframe" />
                ) : (
                  <div className="no-content">
                    <h3>No Additional Resources</h3>
                    <p>No additional resource available for this topic.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "test" && (
            <div className="content-area">
              <div className="test-tab">
                {testPdfUrl ? (
                  <>
                    {/* Test Controls - Compact */}
                    <div className="test-controls">
                      <button
                        className={`control-btn show-answers-btn ${!testPdfAnswersUrl ? "disabled" : ""}`}
                        onClick={handleShowAnswers}
                        disabled={!testPdfAnswersUrl || showAnswers}
                      >
                        {testPdfAnswersUrl ? "Show Answers" : "No Answers Available"}
                      </button>
                      <button
                        className={`control-btn hide-answers-btn ${!showAnswers ? "disabled" : ""}`}
                        onClick={handleResetAnswers}
                        disabled={!showAnswers}
                      >
                        Hide Answers
                      </button>
                    </div>

                    {/* Page Navigation for Test - Moved to Top */}
                    {totalPages > 0 && (
                      <div className="page-navigation-above-pdf">
                        <button
                          className="nav-btn prev-btn"
                          onClick={prevPage}
                          disabled={currentPage === 1 || pageLoading}
                        >
                          <ChevronLeft size={16} />
                          Previous
                        </button>

                        <div className="page-info">
                          <span>
                            Page {currentPage} of {totalPages}
                          </span>
                        </div>

                        <button
                          className="nav-btn next-btn"
                          onClick={nextPage}
                          disabled={currentPage === totalPages || pageLoading}
                        >
                          Next
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}

                    {/* PDF Viewer for Test - Optimized height */}
                    <div className="test-pdf-container">
                      {pageLoading && (
                        <div className="page-loading-overlay">
                          <div className="loading-spinner"></div>
                          <p>Loading page {currentPage}...</p>
                        </div>
                      )}

                      {pageImageUrl && !pageLoading && (
                        <div className="pdf-page-wrapper">
                          <img
                            src={pageImageUrl || "/placeholder.svg"}
                            alt={`Test Page ${currentPage}${showAnswers ? " (Answers)" : ""}`}
                            className="pdf-page-image"
                            style={{
                              border: showAnswers ? "3px solid #4CAF50" : "none",
                            }}
                          />

                          {showAnswers && <div className="answer-indicator">✓ Answer Sheet</div>}
                        </div>
                      )}

                      {!pageImageUrl && !pageLoading && testPdfUrl && (
                        <div className="no-content">
                          <h3>Loading Test Content</h3>
                          <p>Please wait while the test content loads...</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="no-content">
                    <h3>No Test Available</h3>
                    <p>No test PDF available for this topic.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
