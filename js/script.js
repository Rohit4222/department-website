// js/script.js

// AOS Initialization
AOS.init({ once: true });

// GSAP Animations
gsap.from(".hero-content .college-name", { 
  duration: 1.2, 
  y: -50, 
  opacity: 0, 
  ease: "power2.out" 
});
gsap.from(".hero-content .dept-name", { 
  duration: 1.2, 
  y: 50, 
  opacity: 0, 
  ease: "power2.out", 
  delay: 0.5 
});

// Navigation Handling
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll('.page-section');
  const homeSection = document.getElementById('home');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  // Initially show only Home
  showSection('home');

  function showSection(sectionId) {
    sections.forEach(section => section.style.display = 'none');
    homeSection.style.display = (sectionId === 'home') ? 'block' : 'none';
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.style.display = 'block';
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      const sectionId = this.getAttribute('href').substring(1);
      showSection(sectionId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('a[href="#about"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      showSection('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});

// Updated Contact Form Handling with Client-side Validation
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  const messageDiv = document.getElementById('formMessage');
  
  if (name === '' || email === '') {
    messageDiv.classList.remove('d-none');
    messageDiv.classList.add('alert-danger');
    messageDiv.innerHTML = 'Please fill out both Name and Email fields!';
    return;
  }
  
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    messageDiv.classList.remove('d-none');
    messageDiv.classList.add('alert-danger');
    messageDiv.innerHTML = 'Please provide a valid email address!';
    return;
  }
  
  if (!/^\S+\s+\S+/.test(name)) {
    messageDiv.classList.remove('d-none');
    messageDiv.classList.add('alert-danger');
    messageDiv.innerHTML = 'Please provide your full name (first and last name)!';
    return;
  }
  
  fetch('http://localhost:5000/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
  })
  .then(response => {
      if (!response.ok) {
         return response.json().then(err => { throw new Error(err.message); });
      }
      return response.json();
  })
  .then(data => {
      messageDiv.classList.remove('d-none', 'alert-danger');
      messageDiv.classList.add('alert-success');
      messageDiv.innerHTML = data.message;
      document.getElementById('contactForm').reset();
      setTimeout(() => messageDiv.classList.add('d-none','alert-danger'), 2000);
  })
  .catch(err => {
      messageDiv.classList.remove('d-none', 'alert-success');
      messageDiv.classList.add('alert-danger');
      messageDiv.innerHTML = 'Error: ' + err.message;
  });
});

// Scroll Effects
window.addEventListener('scroll', function() {
  const hero = document.querySelector('.hero');
  const scrolled = window.pageYOffset;
  hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
});

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.page-section').forEach((section) => {
  section.style.opacity = 0;
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'all 0.6s ease-out';
  observer.observe(section);
});

// --- New Functions for Dynamic Data Fetching ---

// Fetch courses data from backend and populate the courses accordion.
function fetchCourses() {
  fetch('http://localhost:5000/courses')
    .then(response => response.json())
    .then(data => {
      // Group courses by year
      const coursesByYear = {};
      data.forEach(item => {
        if (!coursesByYear[item.year]) {
          coursesByYear[item.year] = [];
        }
        coursesByYear[item.year].push(item);
      });
      let coursesHtml = '';
      for (const year in coursesByYear) {
        coursesHtml += `
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingYear${year}">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#year${year}" aria-expanded="false" aria-controls="year${year}">
                Year ${year}
              </button>
            </h2>
            <div id="year${year}" class="accordion-collapse collapse " aria-labelledby="headingYear${year}" data-bs-parent="#coursesAccordion">
              <div class="accordion-body">`;
        coursesByYear[year].forEach(item => {
          coursesHtml += `<h5>Semester ${item.semester}</h5><ul>`;
          item.courses.forEach(course => {
            coursesHtml += `<li>${course}</li>`;
          });
          coursesHtml += `</ul>`;
        });
        coursesHtml += `</div></div></div>`;
      }
      document.getElementById('coursesAccordion').innerHTML = coursesHtml;
    })
    .catch(err => console.error('Error fetching courses:', err));
}

// Fetch faculty data from backend and populate the faculty section.
function fetchFaculty() {
  fetch('http://localhost:5000/faculty')
    .then(response => response.json())
    .then(data => {
      let facultyHtml = '';
      data.forEach(item => {
        facultyHtml += `
          <div class="col-md-4 mb-4">
            <div class="card faculty-card shadow h-100">
              <img src="${item.image ? item.image : 'assets/images/col_logo.jpg'}" class="card-img-top" alt="${item.name}">
              <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">${item.qualification}</p>
                <p class="occupation">${item.designation}</p>
              </div>
            </div>
          </div>`;
      });
      document.querySelector('#faculty .row').innerHTML = facultyHtml;
    })
    .catch(err => console.error('Error fetching faculty:', err));
}

// Fetch study materials from backend and populate the Study Materials collapse section.
// Fetch study materials from backend and populate the Study Materials collapse section.
// Fetch study materials from backend and populate the Study Materials collapse section.
function fetchStudyMaterials() {
  fetch('http://localhost:5000/studymaterials')
    .then(response => response.json())
    .then(data => {
      // Separate materials into books and question papers
      const books = data.filter(item => item.type === 'book');
      const questions = data.filter(item => item.type === 'question');

      // Build Books Table
      let booksTableHtml = `
        <table class="table study-material-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Semester</th>
              <th>Book Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>`;
      books.forEach(item => {
        booksTableHtml += `
          <tr>
            <td>${item.year}</td>
            <td>${item.semester}</td>
            <td>${item.title}</td>
            <td>
              <a href="${item.fileURL}" target="_blank" class="btn btn-sm btn-outline-secondary">
                View PDF
              </a>
            </td>
          </tr>`;
      });
      booksTableHtml += `
          </tbody>
        </table>`;
      document.getElementById('booksContent').innerHTML = booksTableHtml;

      // Build Previous Year Question Papers Table
      let questionsTableHtml = `
        <table class="table study-material-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Semester</th>
              <th>Question Paper</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>`;
      questions.forEach(item => {
        questionsTableHtml += `
          <tr>
            <td>${item.year}</td>
            <td>${item.semester}</td>
            <td>${item.title}</td>
            <td>
              <a href="${item.fileURL}" target="_blank" class="btn btn-sm btn-outline-secondary">
                View PDF
              </a>
            </td>
          </tr>`;
      });
      questionsTableHtml += `
          </tbody>
        </table>`;
      document.getElementById('questionsContent').innerHTML = questionsTableHtml;
    })
    .catch(err => console.error('Error fetching study materials:', err));
}


// When the Study Materials collapse is shown, fetch study materials.
var studyMaterialsCollapse = document.getElementById('studyMaterialsCollapse');
if (studyMaterialsCollapse) {
  studyMaterialsCollapse.addEventListener('shown.bs.collapse', function () {
    fetchStudyMaterials();
  });
}

// Call dynamic data fetching functions on page load.
document.addEventListener("DOMContentLoaded", function () {
  fetchCourses();
  fetchFaculty();
});
