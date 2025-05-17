import { useState } from 'react';
import { Squircle, ChevronDown, ChevronUp, Lightbulb, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { useBudgets } from '../context/BudgetContext';
import { useExpenses } from '../context/ExpenseContext';

export default function Insights() {
  const { getInsights } = useBudgets();
  const { expenses, getExpensesByCategory } = useExpenses();
  const [selectedMonth, setSelectedMonth] = useState('All Time');
  const [showAllInsights, setShowAllInsights] = useState(false);
  
  const insights = getInsights();
  const categoryData = getExpensesByCategory();
  
  // Helper to determine icon based on insight content
  const getInsightIcon = (insight: string) => {
    if (insight.toLowerCase().includes('alert') || insight.toLowerCase().includes('warning')) {
      return <Squircle size={18} className="text-orange-500 dark:text-orange-400 flex-shrink-0" />;
    } else if (insight.toLowerCase().includes('tip') || insight.toLowerCase().includes('consider')) {
      return <Lightbulb size={18} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />;
    } else if (insight.toLowerCase().includes('increase') || insight.toLowerCase().includes('more')) {
      return <TrendingUp size={18} className="text-red-500 dark:text-red-400 flex-shrink-0" />;
    } else {
      return <TrendingDown size={18} className="text-green-500 dark:text-green-400 flex-shrink-0" />;
    }
  };
  
  // Find the top spenders (categories with highest spending)
  const topSpenders = [...categoryData]
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);
    
  // Find monthly trends (mock data for demo)
  const monthlyTrends = [
    { month: 'January', change: +12.5, amount: 1250 },
    { month: 'February', change: -5.2, amount: 1185 },
    { month: 'March', change: +8.7, amount: 1288 },
    { month: 'April', change: -2.1, amount: 1261 },
    { month: 'May', change: +15.3, amount: 1454 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">AI Insights & Recommendations</h2>
        
        <div className="relative">
          <div className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <Search size={16} className="text-gray-400 mr-2" />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent appearance-none outline-none text-sm text-gray-600 dark:text-gray-300 pr-8"
            >
              <option>All Time</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
            </select>
            <ChevronDown size={16} className="text-gray-400 ml-1" />
          </div>
        </div>
      </div>
      
      {/* Main Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-white">Smart Insights</h3>
              <button 
                onClick={() => setShowAllInsights(!showAllInsights)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
              >
                {showAllInsights ? 'Show Less' : 'Show All'}
                {showAllInsights ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
              </button>
            </div>
            
            <div className="space-y-4">
              {(showAllInsights ? insights : insights.slice(0, 3)).map((insight, index) => (
                <div key={index} className="flex p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="mt-0.5 mr-3">{getInsightIcon(insight)}</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                </div>
              ))}
              
              {!showAllInsights && insights.length > 3 && (
                <button 
                  onClick={() => setShowAllInsights(true)}
                  className="w-full py-2 text-center text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"
                >
                  Show {insights.length - 3} more insights
                </button>
              )}
            </div>
          </div>
          
          {/* Monthly Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Monthly Spending Trends</h3>
            
            <div className="space-y-3">
              {monthlyTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center">
                    {trend.change > 0 ? (
                      <TrendingUp size={18} className="text-red-500 dark:text-red-400 mr-3" />
                    ) : (
                      <TrendingDown size={18} className="text-green-500 dark:text-green-400 mr-3" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{trend.month}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">${trend.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${trend.change > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                    {trend.change > 0 ? '+' : ''}{trend.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Side panel with additional insights */}
        <div className="space-y-6">
          {/* Top Spending Categories */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Top Spending Categories</h3>
            
            <div className="space-y-4">
              {topSpenders.map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</p>
                    <p className="text-sm text-gray-800 dark:text-white">${category.total.toFixed(2)}</p>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min(100, (category.total / topSpenders[0].total) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-medium">Recommendation:</span> Consider reducing spending in your top category to improve budget health.
              </p>
            </div>
          </div>
          
          {/* Savings Opportunities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Savings Opportunities</h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-300">
                  Cut subscription costs by sharing accounts with family.
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-300">
                  Meal prepping could save up to $120/month.
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-300">
                  Consider public transport instead of rideshares.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
