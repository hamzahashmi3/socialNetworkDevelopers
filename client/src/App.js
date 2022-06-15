import React,{Fragment, useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import LandingPage from './components/Layout/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/Layout/Alert';

// Redux
import {Provider} from 'react-redux';
import Store from './Store.js';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/Auth';
import store from './Store.js';


if(localStorage.token) {
  setAuthToken(localStorage.token)
}


const App=()=> {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Provider store={Store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<LandingPage/>} />
          </Routes>
          
            

          <section className='container'>
            <Alert />
            <Routes>
              <Route exact path='/login' element={<Login />}/>
              <Route exact path='/register' element={<Register/>} />
            </Routes>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
