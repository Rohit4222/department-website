import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  
  const [newCourse, setNewCourse] = useState({ year: "", semester: "", courses: "" });
  const [newFaculty, setNewFaculty] = useState({ name: "", qualification: "", designation: "", image: "" });
  const [newStudyMaterial, setNewStudyMaterial] = useState({
    year: "",
    semester: "",
    type: "",
    title: "",
    description: "",
    fileURL: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/courses").then((res) => setCourses(res.data));
    axios.get("http://localhost:5000/faculty").then((res) => setFaculty(res.data));
    axios.get("http://localhost:5000/studymaterials").then((res) => setStudyMaterials(res.data));
  }, []);

  const addCourse = () => {
    // Split courses if comma separated
    const courseData = { ...newCourse, courses: newCourse.courses.split(",") };
    axios.post("http://localhost:5000/courses", courseData).then(() => {
      setCourses([...courses, courseData]);
      setNewCourse({ year: "", semester: "", courses: "" });
    });
  };

  const addFaculty = () => {
    axios.post("http://localhost:5000/faculty", newFaculty).then(() => {
      setFaculty([...faculty, newFaculty]);
      setNewFaculty({ name: "", qualification: "", designation: "", image: "" });
    });
  };

  const addStudyMaterial = () => {
    axios.post("http://localhost:5000/studymaterials", newStudyMaterial).then(() => {
      setStudyMaterials([...studyMaterials, newStudyMaterial]);
      setNewStudyMaterial({ year: "", semester: "", type: "", title: "", description: "", fileURL: "" });
    });
  };

  return (
    <div className="admin-panel-container">
      <h2>Admin Panel</h2>

      {/* Course Section */}
      <div className="admin-section">
        <h3>Add New Course</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Year"
            value={newCourse.year}
            onChange={(e) => setNewCourse({ ...newCourse, year: e.target.value })}
          />
          <input
            type="text"
            placeholder="Semester"
            value={newCourse.semester}
            onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
          />
          <input
            type="text"
            placeholder="Courses (comma separated)"
            value={newCourse.courses}
            onChange={(e) => setNewCourse({ ...newCourse, courses: e.target.value })}
          />
          <button onClick={addCourse}>Add Course</button>
        </div>

        <h3>Current Courses</h3>
        <ul className="data-list">
          {courses.map((c, index) => (
            <li key={index}>
              {c.year} - Semester {c.semester}: {c.courses.join(", ")}
            </li>
          ))}
        </ul>
      </div>

      {/* Faculty Section */}
      <div className="admin-section">
        <h3>Add New Faculty</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={newFaculty.name}
            onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Qualification"
            value={newFaculty.qualification}
            onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
          />
          <input
            type="text"
            placeholder="Designation"
            value={newFaculty.designation}
            onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
          />
          <input
            type="text"
            placeholder="Photo URL"
            value={newFaculty.image}
            onChange={(e) => setNewFaculty({ ...newFaculty, image: e.target.value })}
          />
          <button onClick={addFaculty}>Add Faculty</button>
        </div>

        <h3>Current Faculty</h3>
        <ul className="data-list">
          {faculty.map((f, index) => (
            <li key={index} className="faculty-item">
              {f.image && (
                <img
                  src={f.image}
                  alt={f.name}
                  className="faculty-photo"
                />
              )}
              <span>
                {f.name} - {f.qualification} ({f.designation})
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Study Material Section */}
      <div className="admin-section">
        <h3>Add New Study Material</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Year"
            value={newStudyMaterial.year}
            onChange={(e) => setNewStudyMaterial({ ...newStudyMaterial, year: e.target.value })}
          />
          <input
            type="text"
            placeholder="Semester"
            value={newStudyMaterial.semester}
            onChange={(e) => setNewStudyMaterial({ ...newStudyMaterial, semester: e.target.value })}
          />
          <input
            type="text"
            placeholder="Type (book/question)"
            value={newStudyMaterial.type}
            onChange={(e) => setNewStudyMaterial({ ...newStudyMaterial, type: e.target.value })}
          />
          <input
            type="text"
            placeholder="Title"
            value={newStudyMaterial.title}
            onChange={(e) => setNewStudyMaterial({ ...newStudyMaterial, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newStudyMaterial.description}
            onChange={(e) => setNewStudyMaterial({ ...newStudyMaterial, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="File URL"
            value={newStudyMaterial.fileURL}
            onChange={(e) => setNewStudyMaterial({ ...newStudyMaterial, fileURL: e.target.value })}
          />
          <button onClick={addStudyMaterial}>Add Study Material</button>
        </div>

        <h3>Current Study Materials</h3>
        <ul className="data-list">
          {studyMaterials.map((s, index) => (
            <li key={index}>
              {s.year} - Semester {s.semester} - {s.type}: {s.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
