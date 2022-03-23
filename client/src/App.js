import React, {Fragment} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './resources/css/style.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

const App = () => (
    <Router>
        <Fragment>
            <Navbar/>
            <Routes>
                <Route exact path='/' element={<Landing/>}/>
            </Routes>
            <div className="container">
                <Routes>
                    <Route exact path='/register' element={<Register/>}/>
                    <Route exact path='/login' element={<Login/>}/>
                </Routes>
            </div>
        </Fragment>
    </Router>
);


export default App;
