import { useState } from 'react';
import { ChartPie } from 'lucide-react';
import { useBudgets, Budget, budgetColors } from '../context/BudgetContext';
import { categories } from '../context/ExpenseContext';

export default function Budgets() {
  const { budgets, addBudget, updateBudget, deleteBudget, getBudgetUsage } = useBudgets();
  const [isAdding, setIsAdding] = useState(false);
  const [newBudget, setNewBudget] = useState<Omit<Budget, 'id'>>({
    category: '',
    amount: 0,
    period: 'monthly',
    color: budgetColors[0]
  });

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    addBudget(newBudget);
    setIsAdding(false);
    setNewBudget({
      category: '',
      amount: 0,
      period: 'monthly',
      color: budgetColors[0]
    });
  };

  const handleUpdateAmount = (id: string, amount: number) => {
    updateBudget(id, { amount });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Budget Management</h2>
        
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus size={16} className="mr-1" />
          New Budget
        </button>
      </div>
      
      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map(budget => {
          const { used, percentage, remaining } = getBudgetUsage(budget.id);
          
          return (
            <div 
              key={budget.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: budget.color }}
                  ></div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{budget.category}</h3>
                </div>
                <button
                  onClick={() => deleteBudget(budget.id)}
                  className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <div>Budget</div>
                <div className="text-gray-800 dark:text-white font-medium">
                  <input
                    type="number"
                    value={budget.amount}
                    onChange={(e) => handleUpdateAmount(budget.id, parseFloat(e.target.value))}
                    className="w-24 text-right bg-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded p-1"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <div>Used</div>
                <div className="text-gray-800 dark:text-white font-medium">${used.toFixed(2)}</div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div>Remaining</div>
                <div className={`font-medium ${
                  percentage > 90 ? 'text-red-500' : percentage > 75 ? 'text-orange-500' : 'text-green-500'
                }`}>${remaining.toFixed(2)}</div>
              </div>
              
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full rounded-full ${
                    percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <div className="text-gray-500 dark:text-gray-400">{budget.period === 'monthly' ? 'Monthly' : 'Weekly'}</div>
                <div className={`font-medium ${
                  percentage > 90 ? 'text-red-500' : percentage > 75 ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'
                }`}>{percentage}% used</div>
              </div>
              
              {percentage > 90 && (
                <div className="mt-3 flex items-center text-xs text-red-500">
                  <CircleAlert size={14} className="mr-1" />
                  You've nearly exhausted this budget!
                </div>
              )}
              {percentage > 75 && percentage <= 90 && (
                <div className="mt-3 flex items-center text-xs text-orange-500">
                  <CircleAlert size={14} className="mr-1" />
                  Approaching budget limit
                </div>
              )}
            </div>
          );
        })}
        
        {/* Add Budget Form Card */}
        {isAdding && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Create New Budget</h3>
            
            <form onSubmit={handleAddBudget}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                    required
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="">Select category</option>
                    {categories
                      .filter(category => !budgets.some(budget => budget.category === category))
                      .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Budget Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400">$</span>
                    </div>
                    <input
                      type="number"
                      value={newBudget.amount || ''}
                      onChange={(e) => setNewBudget({ ...newBudget, amount: parseFloat(e.target.value) })}
                      required
                      min="1"
                      step="0.01"
                      className="w-full pl-8 p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Period
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                    <button
                      type="button"
                      onClick={() => setNewBudget({ ...newBudget, period: 'weekly' })}
                      className={`flex-1 py-2 text-sm font-medium ${
                        newBudget.period === 'weekly'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewBudget({ ...newBudget, period: 'monthly' })}
                      className={`flex-1 py-2 text-sm font-medium ${
                        newBudget.period === 'monthly'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {budgetColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewBudget({ ...newBudget, color })}
                        className={`w-6 h-6 rounded-full ${
                          newBudget.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      ></button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    Save Budget
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Add Budget Button Card (only shown when not adding) */}
        {!isAdding && budgets.length < categories.length && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl h-full min-h-[200px] hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-2">
              <Plus size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-gray-600 dark:text-gray-300 font-medium">Add New Budget</span>
          </button>
        )}
      </div>
      
      {budgets.length === 0 && !isAdding && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChartPie size={28} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No Budgets Set Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create budgets to track your spending and get alerts when you're approaching your limits.
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
            >
              Create Your First Budget
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

