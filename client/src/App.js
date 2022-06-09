import React,{Fragment} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import LandingPage from './components/Layout/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Redux
import {Provider} from 'react-redux';
import Store from './Store.js';

const App=()=> {
  return (
    <Provider store={Store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<LandingPage/>} />
          </Routes>
          
            

          <section className='container'>
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
