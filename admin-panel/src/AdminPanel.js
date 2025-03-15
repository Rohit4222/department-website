import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [newCourse, setNewCourse] = useState({ year: "", semester: "", courses: "" });
  const [newFaculty, setNewFaculty] = useState({ name: "", qualification: "", designation: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/courses").then((res) => setCourses(res.data));
    axios.get("http://localhost:5000/faculty").then((res) => setFaculty(res.data));
  }, []);

  const addCourse = () => {
    // If entering multiple courses, split by comma
    const courseData = { ...newCourse, courses: newCourse.courses.split(",") };
    axios.post("http://localhost:5000/courses", courseData).then(() => {
      setCourses([...courses, courseData]);
      setNewCourse({ year: "", semester: "", courses: "" });
    });
  };

  const addFaculty = () => {
    axios.post("http://localhost:5000/faculty", newFaculty).then(() => {
      setFaculty([...faculty, newFaculty]);
      setNewFaculty({ name: "", qualification: "", designation: "" });
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Panel</h2>

      <h3>Add New Course</h3>
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

      <h3>Add New Faculty</h3>
      <input
        type="text"
        placeholder="Name"
        value={newFaculty.name}
        onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="qualification"
        value={newFaculty.qualification}
        onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
      />
      <input
        type="text"
        placeholder="Designation"
        value={newFaculty.designation}
        onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
      />
      <button onClick={addFaculty}>Add Faculty</button>

      <h3>Current Courses</h3>
      <ul>
        {courses.map((c, index) => (
          <li key={index}>
            {c.year} - Semester {c.semester}: {c.courses.join(", ")}
          </li>
        ))}
      </ul>

      <h3>Current Faculty</h3>
      <ul>
        {faculty.map((f, index) => (
          <li key={index}>
            {f.name} - {f.qualification} ({f.designation})
          </li>
        ))}
      </ul>
    </div>
  );
}
