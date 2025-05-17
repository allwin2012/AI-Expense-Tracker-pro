import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

// Sample categories
export const categories = [
  'Food & Dining', 'Transportation', 'Entertainment', 'Shopping', 
  'Utilities', 'Housing', 'Healthcare', 'Personal', 'Travel', 'Other'
];

// Initial expenses for demo
const initialExpenses = [
  {
    id: '1',
    amount: 42.50,
    description: 'Grocery shopping',
    category: 'Food & Dining',
    date: '2023-06-15',
    merchant: 'Whole Foods',
    items: ['Vegetables', 'Fruits', 'Bread']
  },
  {
    id: '2',
    amount: 12.99,
    description: 'Streaming subscription',
    category: 'Entertainment',
    date: '2023-06-10',
    merchant: 'Netflix'
  },
  {
    id: '3',
    amount: 35.00,
    description: 'Gas',
    category: 'Transportation',
    date: '2023-06-08',
    merchant: 'Shell'
  },
  {
    id: '4',
    amount: 120.75,
    description: 'New shoes',
    category: 'Shopping',
    date: '2023-06-05',
    merchant: 'Nike'
  },
  {
    id: '5',
    amount: 85.20,
    description: 'Electricity bill',
    category: 'Utilities',
    date: '2023-06-01',
    merchant: 'Power Company'
  }
];

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : initialExpenses;
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString()
    };
    setExpenses([...expenses, newExpense]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const getExpensesByCategory = () => {
    const categoryMap = new Map();
    
    expenses.forEach(expense => {
      const currentTotal = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentTotal + expense.amount);
    });
    
    return Array.from(categoryMap.entries()).map(([category, total]) => ({ category, total }));
  };

  const getExpensesByDate = (period) => {
    const dateMap = new Map();
    
    expenses.forEach(expense => {
      let dateKey = expense.date;
      if (period === 'month') {
        dateKey = expense.date.substring(0, 7); // YYYY-MM
      } else if (period === 'week') {
        // Simplification - we'll just use the date as is for this demo
        dateKey = expense.date;
      }
      
      const currentTotal = dateMap.get(dateKey) || 0;
      dateMap.set(dateKey, currentTotal + expense.amount);
    });
    
    return Array.from(dateMap.entries())
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // Mock function to simulate OCR API for receipt processing
  const processReceiptImage = async (imageData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response - in a real app, this would come from an API
    return {
      merchant: 'Coffee Shop',
      amount: 8.45,
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'Food & Dining',
      items: ['Coffee', 'Bagel']
    };
  };

  const value = {
    expenses,
    addExpense,
    deleteExpense,
    getExpensesByCategory,
    getExpensesByDate,
    getTotalExpenses,
    processReceiptImage
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
