import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import { BudgetProvider } from './context/BudgetContext';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Reports from './pages/Reports';
import Budgets from './pages/Budgets';
import Insights from './pages/Insights';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './index.css';

function App() {
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Router>
      <ExpenseProvider>
        <BudgetProvider>
          <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-['Inter',sans-serif]">
            <div className="flex h-full">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/add" element={<AddExpense />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/budgets" element={<Budgets />} />
                    <Route path="/insights" element={<Insights />} />
                  </Routes>
                </main>
              </div>
            </div>
          </div>
        </BudgetProvider>
      </ExpenseProvider>
    </Router>
  );
}

export default App;
