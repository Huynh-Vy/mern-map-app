# MERN Map App
## Welcome to the MERN Map App! This application allows users to discover and share reviews, also known as "pins," on the places they live in or have visited. The app integrates a map interface with user authentication, allowing users to add, explore, and interact with pins shared by the community.

### Features
1. User Authentication: Register, log in, and log out securely to access personalized features and maintain your profile.
2. Pins (Reviews): Explore pins from your own user and other users, providing valuable insights and experiences about different places. You can also  modify or delete your reviews from the map.
3. Notification Messages: Receive notifications for registration, login, logout, and pin-related activities to stay updated.

### Getting Started
To use the MERN Map App locally, please follow these instructions:

1. Clone the repository: git clone https://github.com/Huynh-Vy/mern-map-app.git
2. Navigate to the project directory: cd mern-map-app
3. Install the dependencies: npm install
4. Set up the required environment variables:
5. Create .env files in the client and server directory.
6. Add the following variables:
- REACT_APP_MAPBOX=your_Mapbox_API_token
- MONGODB_CONNECTION=your_MongoDB_Connection_URL
- PORT=your_backend_port
8. Start the development server: npm start
9. Open your browser and access the app at: http://localhost:3000


### How to Use the App
1. Discover Pins: Upon launching the app, you'll see an interactive map interface. Click on the markers to explore pins (reviews) shared by users. Each pin provides valuable information about the respective place.

2. Add Pins: To contribute your own reviews, log in to the app. Double-click on the desired location on the map to add a new pin. Provide a title, review, and rating to share your experience.

### Technologies Used
- MERN Stack (MongoDB, Express.js, React, Node.js, CSS, HTML)
- MVC model for server development
- Mapbox API for the map interface
- bcrypt for ecure password hashing and verification functionalities
- Joi for schema validation
- react-toastify for notifications 
- Axios for HTTP requests
- Moment.js for handling time and date formatting
- Material-UI for UI components

### Live Demo: https://mern-map-app-vy-huynh.netlify.app/

### Contributing
I welcome contributions from the community to enhance the MERN Map App. If you find any issues or have suggestions for improvements, please feel free to submit a pull request.

### Contact
If you have any questions or feedback, please contact me at huynh.havy271@gmail.com.

Enjoy exploring and sharing your experiences with the MERN Map App!
