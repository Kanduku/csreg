import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import ConfirmationPage from './ConfirmationPage';
import PrivateRoute from './PrivateRoute';
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <h1>YourHR - Job Search Service</h1>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/Signup" element={<SignupForm /> } />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute element={Dashboard} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
