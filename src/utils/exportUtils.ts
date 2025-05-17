import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Expense } from '../context/ExpenseContext';

/**
 * Exports expense data to a CSV file
 */
export const exportToCSV = (expenses: Expense[]) => {
  // Create CSV content
  const headers = ['Date', 'Description', 'Category', 'Merchant', 'Amount', 'Items'];
  
  const csvContent = [
    headers.join(','),
    ...expenses.map(expense => {
      const items = expense.items ? `"${expense.items.join(', ')}"` : '';
      return [
        expense.date,
        `"${expense.description.replace(/"/g, '""')}"`,
        expense.category,
        `"${expense.merchant.replace(/"/g, '""')}"`,
        expense.amount.toFixed(2),
        items
      ].join(',');
    })
  ].join('\n');
  
  // Create a Blob and download it
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `expenses_${new Date().toISOString().slice(0, 10)}.csv`;
  saveAs(blob, filename);
};

/**
 * Exports expense data to a PDF file
 */
export const exportToPDF = (expenses: Expense[], title = 'Expense Report') => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Calculate total expense amount
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  doc.text(`Total: $${total.toFixed(2)}`, 14, 35);
  
  // Prepare table data
  const tableData = expenses.map(expense => [
    new Date(expense.date).toLocaleDateString(),
    expense.description,
    expense.merchant,
    expense.category,
    `$${expense.amount.toFixed(2)}`
  ]);
  
  // Add table
  autoTable(doc, {
    head: [['Date', 'Description', 'Merchant', 'Category', 'Amount']],
    body: tableData,
    startY: 40,
    theme: 'striped',
    headStyles: { fillColor: [60, 76, 231] },
    styles: { fontSize: 9 }
  });
  
  // Save PDF
  const filename = `expense_report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
