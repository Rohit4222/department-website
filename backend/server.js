// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve PDF files from the "pdfs" folder
app.use('/pdfs', express.static('pdfs'));

// Use environment variables for MongoDB URI and PORT.
// If not set, fallback to a local MongoDB connection and port 5000.
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/collegeDB';
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Schemas

const CourseSchema = new mongoose.Schema({
    year: Number,
    semester: Number,
    courses: [String]
});

const FacultySchema = new mongoose.Schema({
    name: String,
    qualification: String,
    designation: String,
    image: String
});

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\S+\s+\S+/.test(v);
            },
            message: props => `${props.value} is not a valid full name. Please provide both first and last name.`
        }
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address']
    },
    message: String,
    date: { type: Date, default: Date.now }
});

// New Study Material Schema
const StudyMaterialSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    semester: { type: Number, required: true },
    type: { type: String, enum: ['book', 'question'], required: true },
    title: { type: String, required: true },
    description: String,
    fileURL: String  // e.g., "pdfs/book1.pdf"
});

const Course = mongoose.model('Course', CourseSchema);
const Faculty = mongoose.model('Faculty', FacultySchema);
const Contact = mongoose.model('Contact', ContactSchema);
const StudyMaterial = mongoose.model('StudyMaterial', StudyMaterialSchema);

// API Routes

// Courses
app.get('/courses', async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
});
app.post('/courses', async (req, res) => {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.json({ message: 'Course Added!' });
});

// Faculty
app.get('/faculty', async (req, res) => {
    const faculty = await Faculty.find();
    res.json(faculty);
});
app.post('/faculty', async (req, res) => {
    const newFaculty = new Faculty(req.body);
    await newFaculty.save();
    res.json({ message: 'Faculty Added!' });
});

// Contact
app.post('/contact', async (req, res) => {
    try {
        const newMessage = new Contact(req.body);
        await newMessage.save();
        res.json({ message: 'Message Received!' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Study Materials
app.get('/studymaterials', async (req, res) => {
    const materials = await StudyMaterial.find();
    res.json(materials);
});
app.post('/studymaterials', async (req, res) => {
    const newMaterial = new StudyMaterial(req.body);
    await newMaterial.save();
    res.json({ message: 'Study Material Added!' });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
