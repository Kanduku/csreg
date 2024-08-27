import React from 'react';
import { Link } from 'react-router-dom';
import './Success.css';
function ConfirmationPage() {
  return (
    <div>
      <h2>Signup Successful!</h2>
      <p>Thank you for signing up. We have received your information and resume.</p>
      <Link to="/dashboard"><button>
      Go to Dashboard</button></Link>
    </div>
  );
}

export default ConfirmationPage;
