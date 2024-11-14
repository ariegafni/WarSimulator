// App.tsx:
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DefensePage from './pages/DefensePage';
import AttackPage from './pages/AttackPage';

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/defense" element={<DefensePage />} />
        <Route path="/attack" element={<AttackPage />} />
        
        
      </Routes>
    </Router>
  )
}

export default App
