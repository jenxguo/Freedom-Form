import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux'
import firebase from 'firebase/app'
import { createStore, combineReducers } from 'redux'
import {
  ReactReduxFirebaseProvider,
  firebaseReducer
} from 'react-redux-firebase'
import { BrowserRouter } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBWU8xZetEjo35JYhghO32dflMIzJDH2Uk",
  authDomain: "freedom-form.firebaseapp.com",
  databaseURL: "https://freedom-form.firebaseio.com",
  projectId: "freedom-form",
  storageBucket: "freedom-form.appspot.com",
  messagingSenderId: "777528818439",
  appId: "1:777528818439:web:d437748623753b0d8b23a2"
};

firebase.initializeApp(firebaseConfig);
//saying we are currently using an emulator to test functions, so look at 5001 for cloud functions
//firebase.functions().useFunctionsEmulator('http://localhost:5001')

// Add firebase to reducers
//says HOW to store information in the redux store
const rootReducer = combineReducers({
  firebase: firebaseReducer
  // firestore: firestoreReducer // <- needed if using firestore
})

// Create store with reducers and initial state
//compose w/ dev tools just lets u peek into the store in chrome
const store = createStore(rootReducer, composeWithDevTools())

//simplest, starter configuration, store users under userProfile
// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
}
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
  // enableClaims: true // Get custom claims along with the profile

//giving access for react firebase to STORE data into redux
const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch
  // createFirestoreInstance // <- needed if using firestore
}

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root')
);
