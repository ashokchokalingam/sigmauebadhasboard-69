import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Navigator from './pages/Navigator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/navigator" element={<Navigator />} />
      </Routes>
    </Router>
  );
}

export default App;