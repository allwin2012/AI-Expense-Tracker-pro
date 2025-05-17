import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Menu, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const location = useLocation();

  useEffect(() => {
    // Set page title based on current route
    const path = location.pathname;
    if (path === '/') setPageTitle('Dashboard');
    else if (path === '/add') setPageTitle('Add Expense');
    else if (path === '/reports') setPageTitle('Reports');
    else if (path === '/budgets') setPageTitle('Budgets');
    else if (path === '/insights') setPageTitle('AI Insights');
    else setPageTitle('Expense Tracker');
  }, [location]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center md:hidden">
        <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
          <Menu size={20} />
        </button>
      </div>
      
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white ml-4 md:ml-0 font-['DM_Serif_Display']">
        {pageTitle}
      </h1>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-medium">
          U
        </div>
      </div>
    </div>
  );
}
