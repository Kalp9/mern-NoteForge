import { Route } from "react-router-dom";
import React from 'react';
import { Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetail from "./pages/NoteDetail";
import toast from "react-hot-toast";

import './index.css';


function App() {
  return (
    <div data-theme="forest">
 
    <Routes> 
    
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/notes/:id" element={<NoteDetail />} />
    </Routes>
      </div>
   
  );
}

export default App;
