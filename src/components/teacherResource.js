// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../api/auth";
// //import ellipse35 from "../assets/ellipse-35.svg";
// //import iconamoonSearchLight from "../assets/iconamoon-search-light.svg";
// //import image from "../assets/image.svg";
// //import line71 from "../assets/line-71.svg";
// //import logo from "../assets/logo.png";
// import { StateHoverWrapper } from "../components/stateHoverWrapper";
// import { TabBar } from "../components/tabBar";
// import "../styles/teacherResource.css";

// const TeacherResource = () => {
//   const [curriculumList, setCurriculumList] = useState([]);
//   const [gradeList, setGradeList] = useState([]);
//   const [lessons, setLessons] = useState([]);
//   const [selectedCurriculum, setSelectedCurriculum] = useState("");
//   const [selectedGrade, setSelectedGrade] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFilters = async () => {
//       try {
//         const [curriculaRes, gradesRes] = await Promise.all([
//           axios.get("https://backend-937324960970.us-central1.run.app/v1/teacherResource/curricula"),
//           axios.get("https://backend-937324960970.us-central1.run.app/v1/teacherResource/grades"),
//         ]);
//         setCurriculumList(curriculaRes.data);
//         setGradeList(gradesRes.data.grades);
//       } catch (error) {
//         console.error("Error fetching dropdown data:", error);
//       }
//     };
//     fetchFilters();
//   }, []);

//   useEffect(() => {
//     const fetchLessons = async () => {
//       if (!selectedCurriculum || !selectedGrade) return;
//       try {
//         const res = await axios.get("https://backend-937324960970.us-central1.run.app/v1/teacherResource/lessons", {
//           params: { curriculum: selectedCurriculum, grade: selectedGrade },
//         });
//         setLessons(res.data.lessons);
//       } catch (error) {
//         console.error("Error fetching lessons:", error);
//       }
//     };
//     fetchLessons();
//   }, [selectedCurriculum, selectedGrade]);

//   return (
//     <div className="teacher-resource">
//       <div className="group-wrapper">
//         <div className="group">
//           <div className="on-boarding-screen">
//             <div className="div">
//               <img className="logo" alt="Logo" src="https://c.animaapp.com/8sQwfhRM/img/logo@2x.png"/>
//               <p className="simplify-teaching">
//                 <span className="span">Simplify </span>
//                 <span className="text-wrapper-2">Teaching</span>
//                 <span className="span">, Inspiring </span>
//                 <span className="text-wrapper-3">Learning</span>
//               </p>
//               <img className="ellipse" alt="Ellipse" src="https://cdn.animaapp.com/projects/67dde619fa923ddb4432e99b/releases/682bf5f2f8d416f983b09342/img/ellipse-35.svg"/>
//             </div>
//             <div className="text-wrapper-4">Hi, Uzma</div>
//             <div className="text-wrapper-5">Teacher Resource</div>
//             <div className="frame-2">
//               <div className="frame-3">
//                 <div className="text-wrapper-6">Search resource...</div>
//                 <img className="img" alt="Search" src="https://c.animaapp.com/8sQwfhRM/img/iconamoon-search-light.svg" />
//               </div>
//               <div className="frame-4">
//                 <select
//                   className="text-wrapper-7"
//                   value={selectedGrade}
//                   onChange={(e) => setSelectedGrade(e.target.value)}
//                 >
//                   <option value="">Select Grade</option>
//                   {gradeList.map((grade, idx) => (
//                     <option key={idx} value={grade}>{grade}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="frame-5">
//                 <select
//                   className="text-wrapper-7"
//                   value={selectedCurriculum}
//                   onChange={(e) => setSelectedCurriculum(e.target.value)}
//                 >
//                   <option value="">Select Curriculum</option>
//                   {curriculumList.map((c) => (
//                     <option key={c.CID} value={c.CNAME}>{c.CNAME}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <TabBar
//               className="tab-bar-instance"
//               override={
//                 <StateHoverWrapper
//                   className="tab-3"
//                   stateProp="hover"
//                   text="Teacher Resources"
//                 />
//               }
//             />
//             <img className="line" alt="Line" src="https://c.animaapp.com/8sQwfhRM/img/line-71.svg"/>

//             <div className="lessons-grid">
//               {lessons.length > 0 ? (
//                 lessons.map((lesson) => (
//                   <div
//                     key={lesson.LID}
//                     className="lesson-card"
//                     onClick={() =>
//                       navigate(
//                         `/topics?query=${encodeURIComponent(lesson.LNAME)}&grade=${encodeURIComponent(selectedGrade)}&curriculum=${encodeURIComponent(selectedCurriculum)}`
//                       )
//                     }
//                   >
//                     {lesson.LNAME}
//                   </div>
//                 ))
//               ) : (
//                 <p className="no-lessons-text">No lessons available for this selection.</p>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherResource;


import React from "react";
import { StateHoverWrapper } from "./stateHoverWrapper";
import { TabBar } from "./tabBar";
import "../styles/teacherResource.css";

export const TeacherResource = () => {
  return (
    <div className="teacher-resource" data-model-id="114:112">
      <div className="group-wrapper">
        <div className="group">
          <div className="on-boarding-screen">
            <div className="div">
              <img
                className="logo"
                alt="Logo"
                src="https://c.animaapp.com/8sQwfhRM/img/logo@2x.png"
              />

              <p className="simplify-teaching">
                <span className="span">Simplify </span>
                <span className="text-wrapper-2">Teaching</span>
                <span className="span">, Inspiring </span>
                <span className="text-wrapper-3">Learning</span>
              </p>

              <img
                className="ellipse"
                alt="Ellipse"
                src="https://c.animaapp.com/8sQwfhRM/img/ellipse-35.svg"
              />
            </div>

            <div className="text-wrapper-4">Hi, Uzma</div>

            <TabBar
              className="tab-bar-instance"
              override={
                <StateHoverWrapper
                  className="tab-3"
                  stateProp="hover"
                  text="Teacher Resources"
                />
              }
            />

            <img
              className="line"
              alt="Line"
              src="https://c.animaapp.com/8sQwfhRM/img/line-71.svg"
            />

            <div className="text-wrapper-5">Teacher Resource</div>

            <div className="frame-2">
              <div className="frame-3">
                <div className="text-wrapper-6">Search resource...</div>
                <img
                  className="img"
                  alt="Iconamoon search"
                  src="https://c.animaapp.com/8sQwfhRM/img/iconamoon-search-light.svg"
                />
              </div>

              <div className="frame-4">
                <div className="text-wrapper-7">Grade 7</div>
                <img
                  className="img"
                  alt="Ri arrow drop down"
                  src="https://c.animaapp.com/8sQwfhRM/img/ri-arrow-drop-down-line.svg"
                />
              </div>

              <div className="frame-5">
                <div className="text-wrapper-7">CBSE</div>
                <img
                  className="img"
                  alt="Ri arrow drop down"
                  src="https://c.animaapp.com/8sQwfhRM/img/ri-arrow-drop-down-line-1.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
