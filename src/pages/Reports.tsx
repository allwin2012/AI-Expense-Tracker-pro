import { useState } from 'react';
import { ChartBar, FileDown, List } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type ViewMode = 'list' | 'chart';
type TimePeriod = 'day' | 'week' | 'month';

export default function Reports() {
  const { expenses, getExpensesByCategory, getExpensesByDate } = useExpenses();
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');
  
  const categoryData = getExpensesByCategory();
  const timeData = getExpensesByDate(timePeriod);
  
  const COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#6366F1', '#14B8A6', '#F97316', '#D946EF'
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Expense Reports</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('chart')}
              className={`flex items-center justify-center px-4 py-2 text-sm font-medium ${
                viewMode === 'chart'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <ChartBar size={16} className="mr-1" />
              Charts
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center justify-center px-4 py-2 text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <List size={16} className="mr-1" />
              List
            </button>
          </div>
          
          <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => exportToCSV(expenses)}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FileDown size={16} className="mr-1" />
              CSV
            </button>
            <button
              onClick={() => exportToPDF(expenses)}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FileDown size={16} className="mr-1" />
              PDF
            </button>
          </div>
        </div>
      </div>
      
      {viewMode === 'chart' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending by Category Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Spending by Category</h3>
            
            <div className="h-80">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="category" 
                      type="category" 
                      width={120} 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Amount']}
                      contentStyle={{ 
                        borderRadius: '6px', 
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                      }}
                    />
                    <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Spending over Time Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">Spending over Time</h3>
              
              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 text-xs">
                <button
                  onClick={() => setTimePeriod('day')}
                  className={`px-3 py-1 font-medium ${
                    timePeriod === 'day'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimePeriod('week')}
                  className={`px-3 py-1 font-medium ${
                    timePeriod === 'week'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimePeriod('month')}
                  className={`px-3 py-1 font-medium ${
                    timePeriod === 'month'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            <div className="h-80">
              {timeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        if (timePeriod === 'month') {
                          return value.substring(5, 7) + '/' + value.substring(0, 4);
                        }
                        return value.substring(5).replace('-', '/');
                      }}
                      tick={{ fontSize: 12 }}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Amount']}
                      labelFormatter={(label) => {
                        if (timePeriod === 'month') {
                          return `${label.substring(5, 7)}/${label.substring(0, 4)}`;
                        }
                        return new Date(label).toLocaleDateString();
                      }}
                      contentStyle={{ 
                        borderRadius: '6px', 
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                      }}
                    />
                    <Bar dataKey="total" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-750 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Merchant</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {expenses.length > 0 ? (
                  [...expenses]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                        {expense.description}
                        {expense.items && expense.items.length > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Items: {expense.items.join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {expense.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {expense.merchant}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-800 dark:text-white">
                        ${expense.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No expenses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
