import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation/Navigation';
import { FundsTable } from './components/FundsTable/FundsTable';
import { Portfolio } from './components/Portfolio/Portfolio';

export const App: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="app">
                <Navigation />
                <Routes>
                    <Route path="/" element={<FundsTable />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};