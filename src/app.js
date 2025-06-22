import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/signup";
import Onboarding from "./components/onboarding";
import Onboarding2 from "./components/onboarding2";
import Onboarding3 from "./components/onboarding3";
import Onboarding4 from "./components/onboarding4";
import {Dashboard} from "./components/dashboard";
import {TeacherResource }from "./components/teacherResource";
import {LessonTopics} from "./components/topic";
import {PdfViewer} from "./components/pdfViewer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />  
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding2" element={<Onboarding2 />} />
        <Route path="/onboarding3" element={<Onboarding3 />} />
        <Route path="/onboarding4" element={<Onboarding4 />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teacherResource" element={<TeacherResource />} />
        <Route path="/topics" element={<LessonTopics />} />
        <Route path="/viewpdf/:tid" element={<PdfViewer />} />
        <Route path="*" element={<Navigate to="/signup" replace />} /> 
      </Routes>
    </Router>
  );
}

export default App;
