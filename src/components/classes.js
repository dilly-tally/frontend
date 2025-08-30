"use client"

import { useEffect, useState } from "react"
import "../styles/studentTask.css"
import "../App.css"
import { useAuth } from "../context/AuthContext"

export const Classes = ({ onBack }) => {
  const { user, userLoginId } = useAuth()

  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const [showAddClassModal, setShowAddClassModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [newClass, setNewClass] = useState({ name: "" })
  const [studentsText, setStudentsText] = useState("")
  const [addedStudents, setAddedStudents] = useState([])
  const [createdClassId, setCreatedClassId] = useState("")
  const [view, setView] = useState("list") // list | students
  const [selectedClass, setSelectedClass] = useState(null)
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [selectedClassStudents, setSelectedClassStudents] = useState([])

  const [showAddStudentsModal, setShowAddStudentsModal] = useState(false)
  const [studentsTextExisting, setStudentsTextExisting] = useState("")
  const [addedStudentsExisting, setAddedStudentsExisting] = useState([])

  const [deletingId, setDeletingId] = useState(null)

  const backendBase = "https://backend-164859304804.us-central1.run.app/v1/classes"

  useEffect(() => {
    if (user && userLoginId) {
      fetchClasses()
    }
  }, [user, userLoginId]) // remove eslint-disable-next-line to avoid missing rule error

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const resp = await fetch(
        `${backendBase}/teacher-classes?teacherId=${encodeURIComponent(
          userLoginId,
        )}&teacherFirebaseId=${encodeURIComponent(user?.uid || "")}`,
      )
      const data = await resp.json()
      setClasses(Array.isArray(data.classes) ? data.classes : [])
    } catch (e) {
      console.error("[v0] Error fetching classes:", e)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClass = async () => {
    if (!user || !userLoginId) {
      alert("Please wait for authentication to complete and try again.")
      return
    }
    try {
      setLoading(true)
      const resp = await fetch(`${backendBase}/create-class`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClass.name,
          teacherId: userLoginId, // integer id from userLogin
          teacherFirebaseId: user.uid, // firebase uid kept separately
        }),
      })
      const data = await resp.json()
      if (!resp.ok) {
        alert(data?.error || "Error creating class")
        return
      }
      setCreatedClassId(data.class.classId)
      setCurrentStep(2)
    } catch (e) {
      console.error("[v0] Error creating class:", e)
      alert("Error creating class")
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudents = () => {
    if (!studentsText.trim()) return
    const names = studentsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const newOnes = names.map((name) => ({ id: crypto.randomUUID(), name }))
    setAddedStudents((prev) => [...prev, ...newOnes])
    setStudentsText("")
  }

  const handleRemoveTempStudent = (id) => {
    setAddedStudents((prev) => prev.filter((s) => s.id !== id))
  }

  const handleSubmitStudents = async () => {
    if (!userLoginId || !createdClassId) {
      alert("Missing teacher or class information. Please try again.")
      return
    }
    try {
      setLoading(true)
      const studentNames = addedStudents.map((s) => s.name)
      const resp = await fetch(`${backendBase}/add-students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: createdClassId,
          students: studentNames,
          teacherId: userLoginId, // integer
        }),
      })
      const data = await resp.json()
      if (!resp.ok) {
        alert(data?.error || "Error adding students")
        return
      }
      setShowAddClassModal(false)
      setCurrentStep(1)
      setNewClass({ name: "" })
      setAddedStudents([])
      setCreatedClassId("")
      await fetchClasses()
      alert("Class and students created successfully!")
    } catch (e) {
      console.error("[v0] Error adding students:", e)
      alert("Error adding students")
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentsForClass = async (classId) => {
    try {
      setStudentsLoading(true)
      const resp = await fetch(`${backendBase}/class-students/${encodeURIComponent(classId)}`)
      const data = await resp.json()
      setSelectedClassStudents(Array.isArray(data.students) ? data.students : [])
    } catch (e) {
      console.error("[v0] Error fetching class students:", e)
      setSelectedClassStudents([])
    } finally {
      setStudentsLoading(false)
    }
  }

  const openClassStudents = async (classItem) => {
    setSelectedClass(classItem)
    setView("students")
    await fetchStudentsForClass(classItem.classId)
  }

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    id: "",
    sname: "",
    username: "",
    password: "",
    classId: "",
    teacherId: "",
  })

  const onEdit = (student) => {
    setEditForm({
      id: student.id,
      sname: student.sname,
      username: student.username,
      password: student.password,
      classId: student.classId,
      teacherId: student.teacherId,
    })
    setEditOpen(true)
  }

  const onSaveEdit = async () => {
    if (!editForm.id) return
    const ok = window.confirm("Save changes to this student?")
    if (!ok) return
    try {
      setStudentsLoading(true)
      const resp = await fetch(`${backendBase}/update-student/${encodeURIComponent(editForm.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sname: editForm.sname,
          password: editForm.password,
        }),
      })
      const data = await resp.json()
      if (!resp.ok) {
        alert(data?.error || "Failed to update student")
        return
      }
      setEditOpen(false)
      // refresh current class students
      if (selectedClass?.classId) {
        await fetchStudentsForClass(selectedClass.classId)
      }
      alert("Student updated successfully")
    } catch (e) {
      console.error("[v0] Error updating student:", e)
      alert("Error updating student")
    } finally {
      setStudentsLoading(false)
    }
  }

  const handleExistingAddParse = () => {
    if (!studentsTextExisting.trim()) return
    const names = studentsTextExisting
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const items = names.map((name) => ({ id: crypto.randomUUID(), name }))
    setAddedStudentsExisting((prev) => [...prev, ...items])
    setStudentsTextExisting("")
  }

  const handleRemoveTempExisting = (id) => {
    setAddedStudentsExisting((prev) => prev.filter((s) => s.id !== id))
  }

  const submitAddStudentsExisting = async () => {
    if (!selectedClass?.classId || !userLoginId) {
      alert("Missing class or teacher information.")
      return
    }
    const ok = window.confirm("Add these students to this class?")
    if (!ok) return
    try {
      setStudentsLoading(true)
      const names = addedStudentsExisting.map((s) => s.name)
      const resp = await fetch(`${backendBase}/add-students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClass.classId,
          students: names,
          teacherId: userLoginId, // integer
        }),
      })
      const data = await resp.json()
      if (!resp.ok) {
        alert(data?.error || "Failed to add students")
        return
      }
      setShowAddStudentsModal(false)
      setAddedStudentsExisting([])
      setStudentsTextExisting("")
      await fetchStudentsForClass(selectedClass.classId)
      alert("Students added successfully")
    } catch (e) {
      console.error("[v0] Error adding students to existing class:", e)
      alert("Error adding students")
    } finally {
      setStudentsLoading(false)
    }
  }

  const onDeleteStudent = async (studentId) => {
    const ok = window.confirm("Are you sure you want to delete this student?")
    if (!ok) return
    try {
      setDeletingId(studentId)
      const resp = await fetch(`${backendBase}/remove-student/${encodeURIComponent(studentId)}`, {
        method: "DELETE",
      })
      const data = await resp.json()
      if (!resp.ok) {
        alert(data?.error || "Failed to delete student")
        return
      }
      if (selectedClass?.classId) {
        await fetchStudentsForClass(selectedClass.classId)
      }
      alert("Student deleted")
    } catch (e) {
      console.error("[v0] Error deleting student:", e)
      alert("Error deleting student")
    } finally {
      setDeletingId(null)
    }
  }

  const classesGrid = (
    <div className="classes-grid">
      {classes.map((classItem) => (
        <button
          key={classItem.classId}
          className={`class-card ${selectedClass?.classId === classItem.classId ? "active" : ""}`}
          onClick={() => openClassStudents(classItem)}
        >
          <div className="class-header">
            <div className="class-icon">🏫</div>
            <div className="class-badge">Class</div>
          </div>
          <div className="class-content">
            <h3 className="class-title">{classItem.name}</h3>
            <p className="class-meta">Created: {new Date(classItem.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="class-footer">
            <span className="manage-text">View Students</span>
            <div className="arrow-icon">&gt;</div>
          </div>
        </button>
      ))}
    </div>
  )

  const studentsTable = (
    <div className="students-section">
      <div className="classes-header">
        <button className="back-btn" onClick={() => setView("list")}>
          ← Back to Classes
        </button>
        <h3>Students in {selectedClass?.name || "Class"}</h3>
        <button
          className="add-class-btn"
          onClick={() => {
            setShowAddStudentsModal(true)
            setAddedStudentsExisting([])
            setStudentsTextExisting("")
          }}
        >
          + Add Students
        </button>
      </div>
      {studentsLoading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading students...</p>
        </div>
      ) : selectedClassStudents.length > 0 ? (
        <div className="students-table-wrapper classes-card table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Username</th>
                <th>Password</th>
                <th>Class ID</th>
                <th>Teacher ID</th>
                <th className="col-actions">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedClassStudents.map((st) => (
                <tr key={st.id}>
                  <td>{st.id}</td>
                  <td>{st.sname}</td>
                  <td>{st.username}</td>
                  <td>{st.password}</td>
                  <td>{st.classId}</td>
                  <td>{st.teacherId}</td>
                  <td className="col-actions">
                    <button className="add-class-btn edit-pill-btn" onClick={() => onEdit(st)}>
                      Edit
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => onDeleteStudent(st.id)}
                      disabled={deletingId === st.id}
                      style={{ marginLeft: 8 }}
                    >
                      {deletingId === st.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">👨‍🎓</div>
          <h4>No students found</h4>
          <p>This class does not have any students yet.</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="classes-section">
      <div className="classes-header">
        <button className="back-btn" onClick={onBack}>
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
        view === "list" ? (
          classesGrid
        ) : (
          studentsTable
        )
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🏫</div>
          <h3>No created classes</h3>
          <p>You haven't created any classes yet. Click "Add Class" to get started.</p>
        </div>
      )}

      {showAddClassModal && (
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
                        value={studentsText}
                        onChange={(e) => setStudentsText(e.target.value)}
                        placeholder="Enter student names separated by commas (e.g., John Doe, Jane Smith, Mike Johnson)"
                        className="students-input"
                        rows="3"
                      />
                      <button className="add-students-btn" onClick={handleAddStudents} disabled={!studentsText.trim()}>
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
                            <button className="remove-btn" onClick={() => handleRemoveTempStudent(student.id)}>
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
      )}

      {showAddStudentsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Students to {selectedClass?.name || "Class"}</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowAddStudentsModal(false)
                  setAddedStudentsExisting([])
                  setStudentsTextExisting("")
                }}
              >
                ✕
              </button>
            </div>

            <div className="step-content">
              <div className="students-section">
                <div className="input-container">
                  <label>Add Students (comma separated)</label>
                  <div className="input-group">
                    <textarea
                      value={studentsTextExisting}
                      onChange={(e) => setStudentsTextExisting(e.target.value)}
                      placeholder="Enter student names separated by commas (e.g., John Doe, Jane Smith)"
                      className="students-input"
                      rows="3"
                    />
                    <button
                      className="add-students-btn"
                      onClick={handleExistingAddParse}
                      disabled={!studentsTextExisting.trim()}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="added-students-container">
                  <h4>New Students ({addedStudentsExisting.length})</h4>
                  {addedStudentsExisting.length > 0 ? (
                    <div className="students-list">
                      {addedStudentsExisting.map((s) => (
                        <div key={s.id} className="student-item">
                          <span className="student-name">{s.name}</span>
                          <button className="remove-btn" onClick={() => handleRemoveTempExisting(s.id)}>
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
                <button
                  className="back-btn"
                  onClick={() => {
                    setShowAddStudentsModal(false)
                    setAddedStudentsExisting([])
                    setStudentsTextExisting("")
                  }}
                >
                  Cancel
                </button>
                <button
                  className="submit-btn"
                  onClick={submitAddStudentsExisting}
                  disabled={addedStudentsExisting.length === 0 || studentsLoading}
                >
                  {studentsLoading ? "Saving..." : "Add to Class"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Student</h2>
              <button className="close-btn" onClick={() => setEditOpen(false)}>
                ✕
              </button>
            </div>

            <div className="step-content">
              <div className="form-group">
                <label>Student ID</label>
                <input type="text" value={editForm.id} className="form-input" disabled />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={editForm.username} className="form-input" disabled />
              </div>
              <div className="form-group">
                <label>Class ID</label>
                <input type="text" value={editForm.classId} className="form-input" disabled />
              </div>
              <div className="form-group">
                <label>Teacher ID</label>
                <input type="text" value={editForm.teacherId} className="form-input" disabled />
              </div>

              <div className="form-group">
                <label>Student Name</label>
                <input
                  type="text"
                  value={editForm.sname}
                  onChange={(e) => setEditForm((f) => ({ ...f, sname: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="text"
                  value={editForm.password}
                  onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="step-actions">
                <button className="back-btn" onClick={() => setEditOpen(false)}>
                  Cancel
                </button>
                <button className="submit-btn" onClick={onSaveEdit} disabled={studentsLoading}>
                  {studentsLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
