import CancelIcon from '@mui/icons-material/Cancel';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import React, { useRef, useState} from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Login.css';

const userLoginSuccess = () => {
    toast.success("Login Successfully!");
}
  
const userLoginrFail = (err) => {
    toast.error("Failed to login! " + err);
}


const Login = ({setShowLogin, setCurrentUser}) => {
    const emailRef = useRef();
    const passRef = useRef();
    const [showProgress, setShowProgress] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            email: emailRef.current.value,
            password: passRef.current.value,
        }

        console.log(newUser);

        try {
            setShowProgress (true);
            const response = await axios.post("https://mern-map-app.onrender.com/api/users/login", newUser);
           
            localStorage.setItem('user', response.data.user);
            setCurrentUser(localStorage.getItem('user'));
            setShowProgress(false);

            // produce a success notification
            userLoginSuccess();

            setShowLogin(false);
            
            
        }catch(err) {
            // produce a failure notification
            if (err.response && err.response.data && err.response.data.error) {
                const errorMessage = err.response.data.error;
                // Produce a failure notification with the errorMessage
                userLoginrFail(errorMessage);
                setShowProgress (false);
            } else {
                // Handle other types of errors
                if (err.response && err.response.data && err.response.data.message) {
                userLoginrFail(err.response.data.message);
                setShowProgress (false);
            } else {
                userLoginrFail("");
                setShowProgress (false);
            }
            }
        }
    }

    return (
        <div className="login_container">
            <div className="application">
                <ExitToAppIcon />
                Login to your profile
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Email" ref={emailRef}/>
                <input type="password" placeholder="Password" ref={passRef}/>
                <button className="login_button">Login</button>
                {showProgress && (
                <Box sx={{ width: '100%', marginTop: '5px' }}>
                    <LinearProgress />
                </Box>
                )}
            </form>
            <CancelIcon className="login_cancel" onClick={() => setShowLogin(false)}/>
        </div>
    )
}

export default Login

