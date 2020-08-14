import React from 'react';
import './App.css';
import Create from './Create';
import Viewer from './Viewer';
import Results from './Results';
import Homepage from './Homepage';

import {Switch, Route} from 'react-router-dom'

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <div className="App">
          <Homepage/>
        </div>
      </Route>
      <Route exact path="/create">
        <div className="App">
          <Create/>
        </div>
      </Route>
      <Route path="/form/:formId">
        <div className="App">
          <Viewer/>
        </div>
      </Route>
      <Route path="/results/:formId">
        <div className="App">
          <Results/>
        </div>
      </Route>
      <Route>
        <div>Page not found!</div>
      </Route>
    </Switch>
  );
}

export default App;
