import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CaseView from './pages/CaseView';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/case/:caseId" element={<CaseView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
