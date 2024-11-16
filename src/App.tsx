import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
}
from 'react-router-dom';
import Home from './Pages/Home';
import TrainingPage from './Pages/TrainingPage';

const App: React.FC = () => {
    return (
        <div className="App">
            <BrowserRouter basename={process.env.PUBLIC_URL}>
              <Routes>
                <Route path='/' index element={<TrainingPage/>} />
                <Route path='/Home' index element={<Home/>} />
                <Route path='/Training' index element={<TrainingPage/>} />
              </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;