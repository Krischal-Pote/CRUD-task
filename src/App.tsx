import './App.css';
import SideBar from './components/SideBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import UserDetail from './components/UserDetail';
function App() {
  return (
    <>
      <Router>
        <div className="flex min-h-screen">
          <SideBar />
          <main className="flex-1 p-6 bg-white">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/users" element={<UserPage />} />
              <Route path="/users/:id" element={<UserDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
