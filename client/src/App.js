import React, {Fragment} from 'react';
import './resources/css/style.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';

const App = () => (
    <Fragment>
        <Navbar/>
        <Landing/>
    </Fragment>
);


export default App;
