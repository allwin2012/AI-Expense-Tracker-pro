import React, { createContext, useContext, useState, useEffect } from 'react';
import { useExpenses } from './ExpenseContext';

// Available colors for budgets
export const budgetColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

const initialBudgets = [
  {
    id: '1',
    category: 'Food & Dining',
    amount: 500,
    period: 'monthly',
    color: '#3B82F6'
  },
  {
    id: '2',
    category: 'Transportation',
    amount: 200,
    period: 'monthly',
    color: '#10B981'
  },
  {
    id: '3',
    category: 'Entertainment',
    amount: 150,
    period: 'monthly',
    color: '#F59E0B'
  }
];

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const { expenses, getExpensesByCategory } = useExpenses();
  
  const [budgets, setBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('budgets');
    return savedBudgets ? JSON.parse(savedBudgets) : initialBudgets;
  });

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addBudget = (budget) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString()
    };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id, budgetUpdate) => {
    setBudgets(budgets.map(budget => 
      budget.id === id ? { ...budget, ...budgetUpdate } : budget
    ));
  };

  const deleteBudget = (id) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  const getBudgetUsage = (budgetId) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return { used: 0, percentage: 0, remaining: 0 };

    const categoryExpenses = expenses.filter(e => e.category === budget.category);
    const thisMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

    const used = categoryExpenses
      .filter(e => {
        // Filter by period (monthly or weekly)
        if (budget.period === 'monthly') {
          return e.date.startsWith(thisMonth);
        } else {
          // Weekly - simplified version for demo
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return new Date(e.date) >= oneWeekAgo;
        }
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const percentage = Math.min(Math.round((used / budget.amount) * 100), 100);
    const remaining = Math.max(budget.amount - used, 0);

    return { used, percentage, remaining };
  };

  // Generate AI insights based on spending patterns and budgets
  const getInsights = () => {
    const categoryTotals = getExpensesByCategory().reduce((acc, { category, total }) => {
      acc[category] = total;
      return acc;
    }, {});
    
    const insights = [];
    
    // Check budget alerts
    budgets.forEach(budget => {
      const { percentage, remaining } = getBudgetUsage(budget.id);
      
      if (percentage > 90) {
        insights.push(`Alert: You've used ${percentage}% of your ${budget.category} budget. Only $${remaining.toFixed(2)} remaining.`);
      } else if (percentage > 75) {
        insights.push(`Warning: You're approaching your ${budget.category} budget limit (${percentage}% used).`);
      }
    });
    
    // Look for unusual spending
    const totalSpent = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    Object.entries(categoryTotals).forEach(([category, total]) => {
      const percentage = (total / totalSpent) * 100;
      if (percentage > 40) {
        insights.push(`${category} accounts for ${percentage.toFixed(1)}% of your spending. Consider reviewing these expenses.`);
      }
    });
    
    // Add general tips based on categories
    if (categoryTotals['Food & Dining'] > 300) {
      insights.push('Tip: Try meal prepping to reduce food expenses by up to 30%.');
    }
    
    if (categoryTotals['Entertainment'] > 100) {
      insights.push('Consider sharing subscription services with family or friends to cut costs.');
    }
    
    // Add generic insights if the list is empty
    if (insights.length === 0) {
      insights.push('You\'re doing well with your spending this month!');
      insights.push('Remember to review your budget categories regularly to match your priorities.');
    }
    
    return insights;
  };

  const value = {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetUsage,
    getInsights
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

export const useBudgets = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
};
