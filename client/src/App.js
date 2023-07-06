import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Map, Marker, NavigationControl, Popup } from 'react-map-gl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import HowToUse from './components/HowToUse/HowToUse';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import './App.css';

const pinAddSuccess = () => {
  toast.success("Pin added successfully!");
}

const pinDeleteSuccess = () => {
  toast.success("Pin deleted successfully!");
}

const pinEditSuccess = () => {
  toast.success("Pin updated successfully!");
}

const pinEditFailed = (error) => {
  toast.error(error);
}

const pinDeleteFailed = () => {
  toast.error("Pin failed to delete. Please try again!");
}

const userNotLoggedIn = () => {
  toast.warning("Login to account to add pin!");
}

const userLoggedOut = (user) => {
  toast.warning("Log out from " +  user);
}

const pinAddFailure = () => {
  toast.error("Couldn't add pin. Please fill all data");
}


const App = () => {
  const [pins, setPins] = useState([]);
  const [viewport, setViewport] = useState({
    longitude: 12.4,
    latitude: 37.8,
    zoom: 14,
  });
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [rating, setRating] = useState(null);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem(('user')));

  const [showRegister, setShowRegister] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [showProgress, setShowProgess] = useState(false);  

  // Show info when clicking on marker
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({
      ...viewport,
      latitude: lat,
      longitude: long,
    })
  }
  
  // Double click on map to add pin
  const handleAddClick = (e) => {
    setNewPlace({
      lat: e.lngLat.lat,
      long: e.lngLat.lng,
    });
    setShowFormEdit(false);
  }

  // Click add pin to submit to DB
  const handlePinSubmit = async(e) => {
    e.preventDefault();

    const newPin = {
      userName: currentUser,
      title: title,
      rating: rating,
      description: description,
      lat: newPlace.lat,
      long: newPlace.long,
    }

    try {
      if (!currentUser) {
        // PRODUCE AN ERROR
        userNotLoggedIn();

      } else if (title === null || rating === null || description === null
        || title === "" || rating === "" || description === "") {
          // All fields have not been filled 
          pinAddFailure();
      } else {
        setShowProgess(true);
        const response = await axios.post("https://mern-map-app.onrender.com/api/pins", newPin);
        setPins([...pins, response.data]);
        setNewPlace(null);
        setShowProgess(false);

        // NOTIFY FOR SUCCESS
        pinAddSuccess();
        setRating(null);
        setDescription(null);
        setTitle(null);
    
      }
    } catch (err) {
      // NOTIFICATION ERROR
      pinAddFailure();

      console.log(err);
    }
  }

  // click on edit button then show the edit form
  const handleEditPin = (pin) => {
    setCurrentPlaceId(null);
    setShowFormEdit(true);
    setNewPlace({
      lat: pin.lat,
      long: pin.long,
    });
  }

  // click on update pin button to update the pin on DB
  const handleEditPinSubmit = async (e, pin) => {
    e.preventDefault();

    const id = pin._id;
    const updatedPin = {
      _id: id,
      title: title,
      rating: rating,
      description: description,
    };

    let error = "";
  
    try {
      // All fields have not been filled
      if (title === null || rating === null || description === null
          || title === "" || rating === "" || description === "") {
        error = "Couldn't update the pin. Please fill all data";
        pinEditFailed(error);
      } else {
        setShowProgess(true);
        const response = await axios.patch(`https://mern-map-app.onrender.com/api/pins/${id}`, updatedPin);
        setPins([...pins, response.data.newPin]);
        setNewPlace(null);
        setShowProgess(false);
        setShowFormEdit(false);
        pinEditSuccess();
        setRating(null);
        setDescription(null);
        setTitle(null);
      }
    } catch (err) {
      pinEditFailed(err);
      setShowFormEdit(false);
      console.log(err);
    }
  }

  const handleDeletePin = async (id) => {
    try {
      await axios.delete(`https://mern-map-app.onrender.com/api/pins/${id}`);
      setPins(prevPins => prevPins.filter(pin => pin._id !== id));
      pinDeleteSuccess();
    } catch(err) {
      pinDeleteFailed();
      console.log(err);
    }
  }
  
  const handleLogOut = () => {
    setCurrentUser(null);
    userLoggedOut(currentUser);
    localStorage.removeItem('user');
  }

  // Get all the pins
  useEffect(() => {
    const getPins = async() => {
        try {
          const response = await axios.get("https://mern-map-app.onrender.com/api/pins");
          setPins(response.data);
        } catch(err) {
          console.log(err);
        }
    }
    getPins();
  },[]);



  return (
      <div>
        <Map
          container={'map'}
          projection={'globe'}
          initialViewState={{viewport}}
          style={{width:"100vw", height:"100vh"}}
          mapStyle="mapbox://styles/vyhuynh/cljcdjblp004o01pwh8dt8ahw"
          mapboxAccessToken={process.env.REACT_APP_MAPBOX}
          onDblClick={handleAddClick}
          doubleClickZoom={false} 
        >
          <ToastContainer 
            position="top-center"
            theme="dark"
          />
          <NavigationControl />
            {pins.map((pin, idx) => (
              <>
                <Marker
                longitude={pin.long}
                latitude={pin.lat}
                key={idx}
                anchor="center"
              
                >
                  <LocationOnIcon 
                    className="icon"
                    style={{
                      color: pin.userName === currentUser ? 'tomato' : 'blue',
                      fontSize: viewport.zoom * 2,
                    }}
                    onDoubleClick={(event) => event.stopPropagation()}
                    onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
                  />
                </Marker>

              {pin._id === currentPlaceId && (
                <Popup
                  longitude={pin.long}
                  latitude={pin.lat}
                  closeOnClick={false}
                  closeOnMove={false}
                  anchor="left"
                  onClose={() => setCurrentPlaceId(null)}
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{pin.title}</h4>
                    <label>Review</label>
                    <p className="description">{pin.description}</p>
                    <label>Rating</label>
                    <div className="stars">
                      {Array(pin.rating).fill(<StarIcon className="star"/>)}
                    </div>

                    <label>Information</label>

                    <div className="info">
                      <span className="username">Created by <b>{pin.userName}</b></span>
                      <span className="date">{moment(pin.createdAt).fromNow()}</span>
                    </div>
                  </div>

                  {currentUser === pin.userName && (
                    <div className="btn_group">
                      <button 
                        className="submitButton edit" 
                        type="submit"
                        onClick={() => handleEditPin(pin)}
                      >
                        Edit Pin
                      </button>
                      <button 
                        className="submitButton delete" 
                        type="submit"
                        onClick={() => handleDeletePin(pin._id)}
                      >
                        Delete Pin
                      </button>
                    </div>
                  )}

                </Popup>
              )}

              {
                newPlace && (
                  <Popup
                  longitude={newPlace.long}
                  latitude={newPlace.lat}
                  closeOnClick={false}
                  closeOnMove={false}
                  onClose={() => {
                    setNewPlace(null);
                  }}
                  anchor="left"
                  >
                    <div>
                      {!showFormEdit && newPlace && (
                        <form onSubmit={handlePinSubmit}>
                        <label>Title</label>
                        <input 
                          type="text"
                          placeholder="Please enter a title"
                          onChange={(e) => setTitle(e.target.value)}
                        ></input>

                        <label>Review</label>
                        <textarea 
                          placeholder="Say something about this place"
                          onChange={(e) => setDescription(e.target.value)}
                        />

                        <label>Rating</label>
                        <select onChange={(e) => setRating(e.target.value)}>
                          <option>--</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                          <button className="submitButton" type="submit">Add pin!</button>
                          {showProgress && (
                            <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                          </Box>
                          )}
                      </form>
                      )}

                    {showFormEdit && newPlace &&(
                        <form onSubmit={(e) => handleEditPinSubmit(e, pin)}>
                        <label>Title</label>
                        <input 
                          type="text"
                          placeholder="Please enter a title"
                          onChange={(e) => setTitle(e.target.value)}
                        ></input>

                        <label>Review</label>
                        <textarea 
                          placeholder="Say something about this place"
                          onChange={(e) => setDescription(e.target.value)}
                        />

                        <label>Rating</label>
                        <select onChange={(e) => setRating(e.target.value)}>
                          <option>--</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                          <button className="submitButton" type="submit">Update pin!</button>
                          {showProgress && (
                            <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                          </Box>
                          )}
                      </form>
                      )}
                      
                    </div>
                  </Popup>
                )
              }
              </>
            ))}
            
        </Map>

        <div className="footer">
              <div className="footer_down">
                {
                  currentUser
                  ? (
                  <>
                  <button 
                    className="button logout"
                    onClick={handleLogOut}
                  >
                    Log Out
                  </button>
                  <HowToUse />
                  </>
                  )
                  : (
                    <div>
                      <button 
                        className="button login"
                        onClick={() => {
                          setShowLogin(true);
                          setShowRegister(false);
                        }}
                        >
                        Login
                      </button>
                      <button 
                        className="button register"
                        onClick={() => {
                          setShowRegister(true);
                          setShowLogin(false);
                        }}
                      >
                        Register
                      </button>
                      <HowToUse />
                    </div>
                  )
                }
              </div>
        </div>

        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && <Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser}/>}

      
      </div>
  );
};

export default App;