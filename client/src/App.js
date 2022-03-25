import React, {Fragment, useEffect} from 'react';
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
import setAuthToken from "./utils/setAuthToken";
import {loadUser} from "./actions/auth";


const App = () => {
    useEffect(() => {
        // check for token in LS when app first runs
        if (localStorage.token) {
            // if there is a token set axios headers for all requests
            setAuthToken(localStorage.token);
        }
        // try to fetch a user, if no token or invalid token we
        // will get a 401 response from our API
        store.dispatch(loadUser());
    }, []);

    return (
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
    )
};


export default App;
