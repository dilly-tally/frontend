"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/studentTask.css"
import { TabBar } from "./tabBar"
import ScrollHeader from "./Header/ScrollHeader"
import { useAuth } from "../context/AuthContext"

export const StudentTask = () => {
  const [activeSection, setActiveSection] = useState("overview")
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddClassModal, setShowAddClassModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [newClass, setNewClass] = useState({ name: "" })
  const [students, setStudents] = useState("")
  const [addedStudents, setAddedStudents] = useState([])
  const [createdClassId, setCreatedClassId] = useState("")

  const navigate = useNavigate()
  const { user } = useAuth()

  // Fetch classes when component mounts or when classes section is active
  useEffect(() => {
    if (activeSection === "classes" && user) {
      fetchClasses()
    }
  }, [activeSection, user])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://backend-164859304804.us-central1.run.app/v1/classes/teacher-classes?teacherId=${user.uid}&teacherFirebaseId=${user.uid}`,
      )
      const data = await response.json()
      setClasses(data.classes || [])
    } catch (error) {
      console.error("Error fetching classes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClass = async () => {
    try {
      setLoading(true)
      const response = await fetch(`https://backend-164859304804.us-central1.run.app/v1/classes/create-class`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newClass.name,
          teacherId: user.uid,
          teacherFirebaseId: user.uid,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setCreatedClassId(data.class.classId)
        setCurrentStep(2)
      } else {
        alert("Error creating class: " + data.error)
      }
    } catch (error) {
      console.error("Error creating class:", error)
      alert("Error creating class")
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudents = () => {
    if (!students.trim()) return

    const studentList = students
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s)
    const newStudents = studentList.map((name) => ({
      id: Date.now() + Math.random(),
      name: name,
    }))

    setAddedStudents([...addedStudents, ...newStudents])
    setStudents("")
  }

  const handleRemoveStudent = (studentId) => {
    setAddedStudents(addedStudents.filter((s) => s.id !== studentId))
  }

  const handleSubmitStudents = async () => {
    try {
      setLoading(true)
      const studentNames = addedStudents.map((s) => s.name)

      const response = await fetch(`https://backend-164859304804.us-central1.run.app/v1/classes/add-students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: createdClassId,
          students: studentNames,
          teacherId: user.uid,
        }),
      })

      if (response.ok) {
        // Reset modal state
        setShowAddClassModal(false)
        setCurrentStep(1)
        setNewClass({ name: "" })
        setAddedStudents([])
        setCreatedClassId("")
        // Refresh classes list
        fetchClasses()
        alert("Class and students created successfully!")
      } else {
        const data = await response.json()
        alert("Error adding students: " + data.error)
      }
    } catch (error) {
      console.error("Error adding students:", error)
      alert("Error adding students")
    } finally {
      setLoading(false)
    }
  }

  const renderOverview = () => (
    <div className="student-task-overview">
      <div className="task-buttons-grid">
        <button className="task-button classes-btn" onClick={() => setActiveSection("classes")}>
          <div className="task-icon">🏫</div>
          <div className="task-content">
            <h3>CLASSES</h3>
            <p>(create new class, add to existing class, assign students to class)</p>
          </div>
        </button>

        <button className="task-button library-btn">
          <div className="task-icon">📚</div>
          <div className="task-content">
            <h3>TASK LIBRARY</h3>
            <p>
              (view all tasks, create new task i.e. assign task to existing class, track assigned task, reassign/modify
              task)
            </p>
          </div>
        </button>

        <button className="task-button record-btn">
          <div className="task-icon">📊</div>
          <div className="task-content">
            <h3>STUDENT RECORD</h3>
            <p>(student view, reports→ option to download student reports)</p>
          </div>
        </button>

        <button className="task-button scorebook-btn">
          <div className="task-icon">📈</div>
          <div className="task-content">
            <h3>SCOREBOOK</h3>
            <p>(marks, completion i.e. progress report)</p>
          </div>
        </button>

        <button className="task-button settings-btn">
          <div className="task-icon">⚙️</div>
          <div className="task-content">
            <h3>SETTINGS</h3>
            <p>(change username password, download class data)</p>
          </div>
        </button>
      </div>
    </div>
  )

  const renderClasses = () => (
    <div className="classes-section">
      <div className="classes-header">
        <button className="back-btn" onClick={() => setActiveSection("overview")}>
          ← Back to Overview
        </button>
        <h2>My Classes</h2>
        <button className="add-class-btn" onClick={() => setShowAddClassModal(true)}>
          + Add Class
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading classes...</p>
        </div>
      ) : classes.length > 0 ? (
        <div className="classes-grid">
          {classes.map((classItem) => (
            <div key={classItem.classId} className="class-card">
              <div className="class-header">
                <div className="class-icon">🏫</div>
                <div className="class-badge">Class</div>
              </div>
              <div className="class-content">
                <h3 className="class-title">{classItem.name}</h3>
                <p className="class-meta">Created: {new Date(classItem.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="class-footer">
                <span className="manage-text">Manage Class</span>
                <div className="arrow-icon">&gt;</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🏫</div>
          <h3>No created classes</h3>
          <p>You haven't created any classes yet. Click "Add Class" to get started.</p>
        </div>
      )}
    </div>
  )

  const renderAddClassModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Class</h2>
          <button
            className="close-btn"
            onClick={() => {
              setShowAddClassModal(false)
              setCurrentStep(1)
              setNewClass({ name: "" })
              setAddedStudents([])
              setCreatedClassId("")
            }}
          >
            ✕
          </button>
        </div>

        <div className="steps-indicator">
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
            <span className="step-number">1</span>
            <span className="step-label">Class Details</span>
          </div>
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <span className="step-number">2</span>
            <span className="step-label">Add Students</span>
          </div>
        </div>

        {currentStep === 1 && (
          <div className="step-content">
            <div className="form-group">
              <label>Class Name</label>
              <input
                type="text"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                placeholder="Enter class name"
                className="form-input"
              />
            </div>
            <div className="step-actions">
              <button className="next-btn" onClick={handleCreateClass} disabled={!newClass.name.trim() || loading}>
                {loading ? "Creating..." : "Next"}
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content">
            <div className="students-section">
              <div className="input-container">
                <label>Add Students (comma separated)</label>
                <div className="input-group">
                  <textarea
                    value={students}
                    onChange={(e) => setStudents(e.target.value)}
                    placeholder="Enter student names separated by commas (e.g., John Doe, Jane Smith, Mike Johnson)"
                    className="students-input"
                    rows="3"
                  />
                  <button className="add-students-btn" onClick={handleAddStudents} disabled={!students.trim()}>
                    Add
                  </button>
                </div>
              </div>

              <div className="added-students-container">
                <h4>Added Students ({addedStudents.length})</h4>
                {addedStudents.length > 0 ? (
                  <div className="students-list">
                    {addedStudents.map((student) => (
                      <div key={student.id} className="student-item">
                        <span className="student-name">{student.name}</span>
                        <button className="remove-btn" onClick={() => handleRemoveStudent(student.id)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-students">No students added yet</p>
                )}
              </div>
            </div>

            <div className="step-actions">
              <button className="back-btn" onClick={() => setCurrentStep(1)}>
                Back
              </button>
              <button
                className="submit-btn"
                onClick={handleSubmitStudents}
                disabled={addedStudents.length === 0 || loading}
              >
                {loading ? "Creating..." : "Create Class"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="modern-student-task">
      <ScrollHeader />

      {/* Fixed Header Section */}
      <div className="student-task-fixed-header">
        <div className="student-task-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              Hi, <span className="highlight">{user?.displayName || "User"}</span>
            </h1>
            <p className="hero-subtitle">Manage your student tasks and classes</p>
          </div>
        </div>

        <div className="navigation-section">
          <TabBar className="modern-tab-bar" activePage="student-task" onNavigate={navigate} />
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="student-task-scrollable-content">
        {activeSection === "overview" && renderOverview()}
        {activeSection === "classes" && renderClasses()}
      </div>

      {/* Add Class Modal */}
      {showAddClassModal && renderAddClassModal()}
    </div>
  )
}
