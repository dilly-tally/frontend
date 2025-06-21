// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import axios from "../api/auth";
// import "../styles/pdfView.css";

// const PdfViewer = () => {
//   const { tid } = useParams();
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [topicTitle, setTopicTitle] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [drawColor, setDrawColor] = useState("#000");
//   const [isErasing, setIsErasing] = useState(false);
//   const [activeTab, setActiveTab] = useState("content");
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const fetchPDF = async () => {
//       try {
//         if (!tid) throw new Error("Topic ID is missing");

//         const res = await axios.get(
//           `https://backend-937324960970.us-central1.run.app/v1/teacherResource/topic/${tid}`
//         );
//         const { pdfPath, TNAME } = res.data.topic;
//         if (!pdfPath) throw new Error("PDF path not found in response");

//         setPdfUrl(`https://backend-937324960970.us-central1.run.app/${pdfPath}`);
//         setTopicTitle(TNAME || "Untitled Topic");
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching PDF:", err);
//         setError(err.message || "Failed to load PDF");
//         setLoading(false);
//       }
//     };

//     fetchPDF();
//   }, [tid]);

//   const startDrawing = (e) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     canvas.dataset.drawing = "true";
//     ctx.beginPath();
//     ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//   };

//   const draw = (e) => {
//     const canvas = canvasRef.current;
//     if (canvas.dataset.drawing !== "true") return;
//     const ctx = canvas.getContext("2d");
//     ctx.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
//     ctx.strokeStyle = drawColor;
//     ctx.lineWidth = isErasing ? 20 : 2;
//     ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//     ctx.stroke();
//   };

//   const stopDrawing = () => {
//     const canvas = canvasRef.current;
//     canvas.dataset.drawing = "false";
//   };

//   if (loading) return <div>Loading PDF...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="on-boarding-screen">
//       <div className="div">
//         <div className="frame">
//           <img className="logo" alt="Logo" src="https://cdn.animaapp.com/projects/67dde619fa923ddb4432e99b/releases/682bf5f2f8d416f983b09342/img/logo.png" />
//           <p className="simplify-teaching">
//             <span className="text-wrapper">Simplify </span>
//             <span className="span">Teaching</span>
//             <span className="text-wrapper">, Inspiring </span>
//             <span className="span">Learning</span>
//           </p>
//           <img className="ellipse" alt="Ellipse" src="https://cdn.animaapp.com/projects/67dde619fa923ddb4432e99b/releases/682bf5f2f8d416f983b09342/img/ellipse-35.svg" />
//         </div>

//         <div className="text-wrapper-2">{topicTitle}</div>

//         <div className="frame-2">
//           <div className={`div-wrapper ${activeTab === "content" ? "active" : ""}`} onClick={() => setActiveTab("content")}>Content</div>
//           <div className={`div-wrapper ${activeTab === "resources" ? "active" : ""}`} onClick={() => setActiveTab("resources")}>Additional Resources</div>
//           <div className={`div-wrapper ${activeTab === "test" ? "active" : ""}`} onClick={() => setActiveTab("test")}>Test</div>
//         </div>

//         <div className="main-content">
//           <div className="pdf-container">
//             {(activeTab === "content" || activeTab === "test") && (
//               <iframe
//                 src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
//                 title="PDF Viewer"
//                 className="pdf-iframe"
//               />
//             )}
//             {activeTab === "resources" && (
//               <div className="resources-iframe-container">
//               <iframe
//                 src="https://www.visnos.com/demos/fraction-wall"
//                 title="External Resource"
//                 className="resources-iframe"
//               />
//             </div>
//             )}
//           </div>

//           {activeTab === "content" && (
//             <div className="group-wrapper">
//               <div className="group">
//                 <div className="overlap-group">
//                   <div className="rectangle" />
//                   <div className="group-2">
//                     <div className="text-wrapper-5">[Whiteboard]</div>
//                     <div className="frame-3">
//                       <img className="img" alt="Undo" src="https://cdn.animaapp.com/projects/67dde619fa923ddb4432e99b/releases/682bf5f2f8d416f983b09342/img/material-symbols-undo.svg" />
//                       <img className="img" alt="Redo" src="https://cdn.animaapp.com/projects/67dde619fa923ddb4432e99b/releases/682bf5f2f8d416f983b09342/img/material-symbols-redo.svg" />
//                     </div>
//                     <div className="frame-4">
//                       <img className="img" alt="Pen" src="https://cdn.animaapp.com/projects/67dde619fa923ddb4432e99b/releases/682bf5f2f8d416f983b09342/img/famicons-text-outline.svg" onClick={() => setIsErasing(false)} />
//                       <img className="img" alt="Eraser" src="https://cdn.animaapp.com/projects/67dde619fa923ddb4432e99b/releases/682bf5f2f8d416f983b09342/img/jam-rubber.svg" onClick={() => setIsErasing(true)} />
//                       <img className="img" alt="Black" src="https://dummyimage.com/24x24/000/fff&text=B" onClick={() => { setDrawColor("#000"); setIsErasing(false); }} />
//                       <img className="img" alt="Red" src="https://dummyimage.com/24x24/f00/fff&text=R" onClick={() => { setDrawColor("red"); setIsErasing(false); }} />
//                       <img className="img" alt="Green" src="https://dummyimage.com/24x24/0f0/fff&text=G" onClick={() => { setDrawColor("green"); setIsErasing(false); }} />
//                       <img className="img" alt="Blue" src="https://dummyimage.com/24x24/00f/fff&text=B" onClick={() => { setDrawColor("blue"); setIsErasing(false); }} />
//                     </div>
//                   </div>
//                   <canvas
//                     ref={canvasRef}
//                     width={500}
//                     height={591}
//                     className="whiteboard-canvas"
//                     onMouseDown={startDrawing}
//                     onMouseMove={draw}
//                     onMouseUp={stopDrawing}
//                     onMouseLeave={stopDrawing}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default PdfViewer;


import React from "react";
import "../styles/pdfView.css"

export const PdfViewer = () => {
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
            <div className="content-title">Like and Unlike Terms</div>
            <div className="content-tabs">
              <div className="tab-wrapper">
                <div className="tab-active">Content</div>
              </div>
              <div className="tab-inactive">Additional Resources</div>
              <div className="tab-inactive">Test</div>
            </div>

            {/* Drawing Toolbar - Exact Anima Code Integration */}
            <div className="div">
              <div className="frame">
                <div className="text-wrapper">B</div>
              </div>
              <div className="div-wrapper">
                <div className="text-wrapper">B</div>
              </div>
              <div className="frame-2">
                <div className="text-wrapper">R</div>
              </div>
              <div className="frame-3">
                <div className="text-wrapper">G</div>
              </div>
              <div className="solar-pen-bold-wrapper">
                <img
                  className="img"
                  alt="Solar pen bold"
                  src="https://c.animaapp.com/CJmPfwmA/img/solar-pen-bold.svg"
                />
              </div>
              <div className="solar-eraser-bold-wrapper">
                <img
                  className="img"
                  alt="Solar eraser bold"
                  src="https://c.animaapp.com/CJmPfwmA/img/solar-eraser-bold.svg"
                />
              </div>
              <div className="fa-solid-highlighter-wrapper">
                <img
                  className="img"
                  alt="Fa solid highlighter"
                  src="https://c.animaapp.com/CJmPfwmA/img/fa-solid-highlighter.svg"
                />
              </div>
            </div>

            {/* Content Areas */}
            <div className="content-frame">
              <div className="content-box" />
            </div>
            <iframe 
              className="pdf-iframe"
              src=""
              title="PDF Viewer"
              frameBorder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
