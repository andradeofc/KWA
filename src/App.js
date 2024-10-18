import React from 'react';
import './styles.css';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreativesSearch from './pages/CreativesSearch';
import AccountSearchPage from './pages/AccountSearchPage';
import DownloadCreativePage from './pages/DownloadCreativePage'; // Novo componente

function App() {
    return (
        <Router>
            <div className="app-container">
                <Sidebar />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<CreativesSearch />} />
                        <Route path="/account-search" element={<AccountSearchPage />} />
                        <Route path="/download-creative" element={<DownloadCreativePage />} /> {/* Nova rota */}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
