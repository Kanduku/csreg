import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [details, setDetails] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    schoolingDetails: '',
    highestStudy: '',
    achievements: '',
    certifications: '',
    hobbies: '',
    skills: '',
    projects: '',
    githubLink: '',
    liveDeployLink: '',
    resume: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({
      ...details,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDetails({
      ...details,
      resume: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    Object.keys(details).forEach((key) => {
      formData.append(key, details[key]);
    });

    try {
      await axios.post('/api/submit-details', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Details submitted successfully');
      navigate('/confirmation'); // Navigate to the ConfirmationPage
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <div>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" value={details.firstName} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={details.lastName} onChange={handleChange} required />
        </div>
        <div>
          <label>Birth Date:</label>
          <input type="date" name="birthDate" value={details.birthDate} onChange={handleChange} required />
        </div>
        <div>
          <label>Schooling Details:</label>
          <input type="text" name="schoolingDetails" value={details.schoolingDetails} onChange={handleChange} required />
        </div>
        <div>
          <label>Highest Study:</label>
          <input type="text" name="highestStudy" value={details.highestStudy} onChange={handleChange} required />
        </div>
        <div>
          <label>Achievements:</label>
          <input type="text" name="achievements" value={details.achievements} onChange={handleChange} required />
        </div>
        <div>
          <label>Certifications:</label>
          <input type="text" name="certifications" value={details.certifications} onChange={handleChange} required />
        </div>
        <div>
          <label>Hobbies:</label>
          <input type="text" name="hobbies" value={details.hobbies} onChange={handleChange} required />
        </div>
        <div>
          <label>Skills:</label>
          <input type="text" name="skills" value={details.skills} onChange={handleChange} required />
        </div>
        <div>
          <label>Projects:</label>
          <input type="text" name="projects" value={details.projects} onChange={handleChange} required />
        </div>
        <div>
          <label>GitHub Link:</label>
          <input type="url" name="githubLink" value={details.githubLink} onChange={handleChange} required />
        </div>
        <div>
          <label>Live Deploy Link:</label>
          <input type="url" name="liveDeployLink" value={details.liveDeployLink} onChange={handleChange} required />
        </div>
        <div>
          <label>Resume:</label>
          <input type="file" name="resume" onChange={handleFileChange} accept=".pdf,.doc,.docx" required />
        </div>
        <button type="submit">Submit Details</button>
      </form>
    </div>
  );
}

export default Dashboard;
