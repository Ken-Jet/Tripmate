import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignUp } from './pages/SignUp.jsx';
import { Home } from './pages/Home.jsx';
import { LoginLayout } from './pages/LoginLayout.jsx';
import { Settings } from './pages/Settings.jsx';
import { EditTrip } from './pages/EditTrip.jsx';

function App() {

  const [LoginStatus, setLogStatus] = useState(false);
  const [userinfo, setUserInfo] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
           LoginStatus ? <Navigate to="/home" /> : <Navigate to="/login" />
        } />
        <Route path="/login" element={
           LoginStatus ? <Navigate to="/home" /> : <LoginLayout setLogStatus={setLogStatus} setUserInfo={setUserInfo} />
        } />
        <Route path="/signup" element={
           <SignUp />
        } />
        <Route path="/home" element={
           LoginStatus ? <Home userinfo={userinfo} /> : <Navigate to="/login" />
        } />
        <Route path="/settings" element={
           LoginStatus ? <Settings userinfo={userinfo} /> : <Navigate to="/login" />
        } />
        <Route path="/edit/:id" element={
           LoginStatus ? <EditTrip userinfo={userinfo} /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  );

}

export default App;
