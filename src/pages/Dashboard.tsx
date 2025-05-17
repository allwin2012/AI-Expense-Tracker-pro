import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, ChartBar, Clock, DollarSign, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useBudgets } from '../context/BudgetContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { expenses, getExpensesByCategory, getTotalExpenses } = useExpenses();
  const { budgets, getBudgetUsage } = useBudgets();
  const [chartData, setChartData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<typeof expenses>([]);
  
  useEffect(() => {
    const categoryData = getExpensesByCategory().map(({ category, total }) => {
      // Find matching budget color or assign a default
      const budgetColor = budgets.find(b => b.category === category)?.color || '#3B82F6';
      return { name: category, value: total, color: budgetColor };
    });
    
    setChartData(categoryData);
    
    // Get recent expenses
    const sorted = [...expenses].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setRecentExpenses(sorted.slice(0, 5));
  }, [expenses, budgets, getExpensesByCategory]);

  const totalExpenses = getTotalExpenses();
  
  // Calculate month-over-month change (mock data for demo)
  const previousMonthTotal = totalExpenses * 0.85; // Mock data assuming 15% increase
  const changePercentage = ((totalExpenses - previousMonthTotal) / previousMonthTotal) * 100;
  const isIncrease = changePercentage > 0;

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">${totalExpenses.toFixed(2)}</h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <DollarSign size={20} className="text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className={`flex items-center ${isIncrease ? 'text-red-500' : 'text-green-500'}`}>
              {isIncrease ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="text-xs font-medium ml-1">{Math.abs(changePercentage).toFixed(1)}%</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Top Category</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
                {chartData.length > 0 ? chartData.sort((a, b) => b.value - a.value)[0]?.name : 'None'}
              </h3>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <ChartBar size={20} className="text-purple-500 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {chartData.length > 0 
                ? `$${chartData.sort((a, b) => b.value - a.value)[0]?.value.toFixed(2)}` 
                : '$0.00'}
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Budgets</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{budgets.length}</h3>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <TrendingUp size={20} className="text-green-500 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {budgets.length > 0 
                ? 'Tap to manage budgets' 
                : 'No budgets set yet'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Spending breakdown and recent expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Spending Breakdown</h3>
          
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value}`, '']}
                    contentStyle={{ 
                      borderRadius: '6px', 
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No expense data available</p>
            </div>
          )}
          
          <div className="mt-4">
            {chartData.slice(0, 3).map((category, index) => (
              <div key={index} className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{category.name}</p>
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  ${category.value.toFixed(2)}
                </p>
              </div>
            ))}
            
            {chartData.length > 3 && (
              <button onClick={() => navigate('/reports')} className="w-full text-center text-xs text-indigo-600 dark:text-indigo-400 mt-3 hover:underline">
                View all categories
              </button>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-white">Recent Expenses</h3>
            <button 
              onClick={() => navigate('/add')}
              className="flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              <Plus size={14} className="mr-1" />
              Add new
            </button>
          </div>
          
          <div className="overflow-x-auto">
            {recentExpenses.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 font-medium">Category</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="py-3 text-sm text-gray-800 dark:text-gray-200">
                        {expense.description}
                        <div className="text-xs text-gray-500 dark:text-gray-400">{expense.merchant}</div>
                      </td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                        {expense.category}
                      </td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-sm text-right font-medium text-gray-800 dark:text-white">
                        ${expense.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <Clock size={40} className="text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No recent expenses</p>
                <button 
                  onClick={() => navigate('/add')}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Add your first expense
                </button>
              </div>
            )}
          </div>
          
          {recentExpenses.length > 0 && (
            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate('/reports')}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all expenses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
