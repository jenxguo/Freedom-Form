import React from 'react';
import './Homepage.css';

import {Link, withRouter} from 'react-router-dom';

function Homepage() {
  return (
    <div className="homepage">
      <h1>Welcome to Freedom Form!</h1>
      <br/>
      <Link to="/create"><h5>Create a form.</h5></Link>
    </div>
  );
}

export default Homepage;
