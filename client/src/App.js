import React, {Fragment} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './resources/css/style.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
// Redux
import {Provider} from 'react-redux';
import store from './store';


const App = () => (
    <Provider store={store}>
        <Router>
            <Fragment>
                <Navbar/>
                <Routes>
                    <Route path='/' exact element={<Landing/>}/>
                </Routes>
                <section className="container">
                    <Alert/>
                    <Routes>
                        <Route path='/register' exact element={<Register/>}/>
                        <Route path='/login' exact element={<Login/>}/>
                    </Routes>
                </section>
            </Fragment>
        </Router>
    </Provider>
);


export default App;
