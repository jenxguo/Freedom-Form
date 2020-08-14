import React from 'react';
import './Homepage.css';

import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div className="homepage">
      <h1>Welcome to Freedom Form!</h1>
      <br/>
      <Link to="/create"><h5>Get Started</h5></Link>
    </div>
  );
}

export default Homepage;
