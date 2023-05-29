import React from 'react';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import Principal from './utilitati/principal';
import Login from './utilitati/login';
import Dashboard from './utilitati/dashboard';
import Delog from './utilitati/delog';
import reportWebVitals from './reportWebVitals';
import VideoAdd from './utilitati/video_add';
import SchimbaParola from './utilitati/schimba_parola';
import Video from './utilitati/video';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
    <Routes>
    <Route path="/" element={<Principal/>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/dashboard" element={<Dashboard/>} />
    <Route path="/delog" element={<Delog></Delog>}></Route>
    <Route path='/new_post'element={<VideoAdd/>} />
    <Route path="/schimba_parola" element={<SchimbaParola/>} />
    <Route path='/video' element={<Video/>}></Route>
    </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
