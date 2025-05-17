import { NavLink } from 'react-router-dom';
import { ChartBar, DollarSign, House, Lightbulb, ChartPie, CirclePlus } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
            <DollarSign size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white font-['DM_Serif_Display']">
            FinSense
          </h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg ${
              isActive 
                ? 'bg-indigo-50 text-indigo-600 dark:bg-gray-700 dark:text-indigo-400' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors duration-200`
          }
        >
          <House size={18} className="mr-3" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink
          to="/add"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg ${
              isActive 
                ? 'bg-indigo-50 text-indigo-600 dark:bg-gray-700 dark:text-indigo-400' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors duration-200`
          }
        >
          <CirclePlus size={18} className="mr-3" />
          <span>Add Expense</span>
        </NavLink>
        
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg ${
              isActive 
                ? 'bg-indigo-50 text-indigo-600 dark:bg-gray-700 dark:text-indigo-400' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors duration-200`
          }
        >
          <ChartBar size={18} className="mr-3" />
          <span>Reports</span>
        </NavLink>
        
        <NavLink
          to="/budgets"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg ${
              isActive 
                ? 'bg-indigo-50 text-indigo-600 dark:bg-gray-700 dark:text-indigo-400' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors duration-200`
          }
        >
          <ChartPie size={18} className="mr-3" />
          <span>Budgets</span>
        </NavLink>
        
        <NavLink
          to="/insights"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg ${
              isActive 
                ? 'bg-indigo-50 text-indigo-600 dark:bg-gray-700 dark:text-indigo-400' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors duration-200`
          }
        >
          <Lightbulb size={18} className="mr-3" />
          <span>AI Insights</span>
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
            Premium Plan
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Upgrade for advanced AI features and unlimited storage
          </p>
        </div>
      </div>
    </div>
  );
}
