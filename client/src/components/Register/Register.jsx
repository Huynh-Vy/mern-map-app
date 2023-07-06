import CancelIcon from '@mui/icons-material/Cancel';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from 'axios';
import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import './Register.css';

const userRegisterSuccess = () => {
  toast.success("Register Successfully!");
}

const userRegisterFail = (err) => {
  toast.error("Failed to register! " + err);
}

const Register = ({setShowRegister}) => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();

  const [showProgress, setShowProgess] = useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault();

      const newUser = {
          userName: nameRef.current.value,
          email: emailRef.current.value,
          password: passRef.current.value,
      }

      console.log(newUser);

      try {
        setShowProgess(true);
        await axios.post("https://mern-map-app.onrender.com/api/users/register", newUser);
        // produce a success notification
        setShowProgess(false);
        userRegisterSuccess();
        setShowRegister(false);
          
      }catch(err) {
        if (err.response && err.response.data && err.response.data.error) {
          const errorMessage = err.response.data.error;
          // Produce a failure notification with the errorMessage
          userRegisterFail(errorMessage);
          setShowProgess(false);
        } else {
          // Handle other types of errors
          if (err.response && err.response.data && err.response.data.message) {
            userRegisterFail(err.response.data.message);
            setShowProgess(false);
          } else {
            userRegisterFail("");
            setShowProgess(false);
          }
        }
      }
  }
  return (
    <div className="register_container">
        <div className="application">
        <ExitToAppIcon />
        Create a profile
        </div>
        <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Email" ref={emailRef} />
        <input type="text" placeholder="Username" ref={nameRef} />
        <input type="password" placeholder="Password" ref={passRef} />
        <button className="register_button">Register</button>
        {showProgress && (
          <Box sx={{ width: '100%', marginTop: '5px' }}>
            <LinearProgress />
          </Box>
        )}
        </form>
        <CancelIcon className="register_cancel" onClick={() => setShowRegister(false)} />
    </div>
  )
}

export default Register
