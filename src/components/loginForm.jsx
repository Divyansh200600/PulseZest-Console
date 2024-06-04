import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../utils/firebaseConfig';
import './styles.css';

const LoginFormPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const submitButton = document.getElementById('submit-btn');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
  
    if (submitButton && loginForm && usernameInput && passwordInput) {
      const handleMouseOver = () => {
        if (usernameInput.value === '' || passwordInput.value === '') {
          const offsetX = Math.random() * (window.innerWidth - submitButton.offsetWidth);
          const offsetY = Math.random() * (window.innerHeight - submitButton.offsetHeight);
          submitButton.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
      };
  
      const handleInput = () => {
        if (usernameInput.value !== '' && passwordInput.value !== '') {
          submitButton.style.transform = 'translate(0, 0)';
        }
      };
  
      submitButton.addEventListener('mouseover', handleMouseOver);
      loginForm.addEventListener('input', handleInput);
  
      return () => {
        submitButton.removeEventListener('mouseover', handleMouseOver);
        loginForm.removeEventListener('input', handleInput);
      };
    }
  }, []);

  

  const handleLogin = async () => {
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      navigate('/db');
    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
    }
  };
  

  if (loggedIn) {
    navigate('/db', { replace: true });
    return null; // Redirecting programmatically, returning null to avoid rendering anything
  }

  return (
    <div>
     <div id="particles-js"></div>
      <div className="glow-container">
        <div className="glow-text">Welcome To</div>
        <div className="glow-text">PulseZest</div>
      </div>
      <div className="container">
        <div className="login-box">
          <h2>Login</h2>
          <form id="loginForm">
            <div className="user-box">
              <input type="text" id="username" name="username" required />
              <label htmlFor="username" className="active">Email</label>
            </div>
            <div className="user-box">
              <input type={showPassword ? "text" : "password"} id="password" name="password" required />
              <label htmlFor="password" className="active">Password</label>
              <span className="eye-icon" onClick={handleTogglePassword}>{showPassword ? "👁️" : "👁️‍🗨️"}</span>
            </div>
            <a id="submit-btn" onClick={handleLogin}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Submit
            </a>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LoginFormPage;
