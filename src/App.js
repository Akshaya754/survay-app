import React, { useState } from 'react';
import { BrowserRouter as Router, Route ,Routes} from "react-router-dom";
import Login from '../src/Pages/Login/index.jsx';
import SurveyPage from './Pages/Survey-page/surveyPage.jsx';
import Surveylist from './Pages/Survey-List/survay-list.jsx';
import UserList from './userDetails/userDetails.jsx';
import DisplayPage from './Pages/Display/Display.jsx';

function App() {
  return (
       
    <Router>
      <div>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/survey-list" element={<Surveylist />} />
        <Route path="/user" element={<UserList />} />
        <Route path="/display" element={<DisplayPage/>} />

      </Routes>
      </div>
    </Router>

  );
}

export default App;

