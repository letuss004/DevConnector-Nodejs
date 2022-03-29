import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './resources/css/style.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import ProfileForm from './components/profile_forms/CreateProfile';
import EditProfile from './components/profile_forms/EditProfile'
import AddEducation from "./components/profile_forms/AddEducation";
import AddExperience from "./components/profile_forms/AddExperience";
import PrivateRoute from "./components/routing/PrivateRoute";
import Profiles from "./components/profiles/Profiles";
import Posts from "./components/posts/Posts";
// Redux
import {Provider} from 'react-redux';
import store from './store';
import setAuthToken from "./utils/setAuthToken";
import {loadUser} from "./actions/auth";
import Profile from "./components/profile/Profile";
import Post from "./components/post/Post";


const App = () => {

    useEffect(
        () => {
            if (localStorage.token) {
                // if there is a token set axios headers for all requests
                setAuthToken(localStorage.token);
            }
            store.dispatch(loadUser());
        },
        []
    );

    return (
        <Provider store={store}>
            <Router>
                <Navbar/>
                <Alert/>
                <Routes>
                    <Route path='/profiles' element={<Profiles/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/dashboard' element={<PrivateRoute component={Dashboard}/>}/>
                    <Route
                        path="create-profile"
                        element={<PrivateRoute component={ProfileForm}/>}
                    />
                    <Route
                        path="edit-profile"
                        element={<PrivateRoute component={EditProfile}/>}
                    />
                    <Route path='/' element={<Landing/>}/>
                    <Route
                        path="add-experience"
                        element={<PrivateRoute component={AddExperience}/>}
                    />
                    <Route
                        path="add-education"
                        element={<PrivateRoute component={AddEducation}/>}
                    />
                    <Route path="profile/:id" element={<Profile/>}/>
                    <Route
                        path="posts"
                        element={<PrivateRoute component={Posts}/>}
                    />
                    <Route path="posts/:id" element={<PrivateRoute component={Post} />} />
                </Routes>
            </Router>
        </Provider>
    );
};


export default App;
