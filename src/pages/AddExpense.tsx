import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Camera, Check, Loader, Receipt, X } from 'lucide-react';
import { useExpenses, categories } from '../context/ExpenseContext';

export default function AddExpense() {
  const navigate = useNavigate();
  const { addExpense, processReceiptImage } = useExpenses();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    items: ''
  });
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsProcessing(true);
      
      const file = acceptedFiles[0];
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (e.target?.result) {
          const imageData = e.target.result as string;
          setReceiptImage(imageData);
          
          try {
            // Process receipt with AI
            const extractedData = await processReceiptImage(imageData);
            
            setFormData(prev => ({
              ...prev,
              ...extractedData,
              amount: extractedData.amount?.toString() || prev.amount,
              items: extractedData.items?.join(', ') || prev.items
            }));
          } catch (error) {
            console.error('Error processing receipt:', error);
          } finally {
            setIsProcessing(false);
          }
        }
      };
      
      reader.readAsDataURL(file);
    }
  }, [processReceiptImage]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    disabled: isProcessing
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Convert form values to appropriate types
      const expense = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        date: formData.date,
        merchant: formData.merchant,
        items: formData.items ? formData.items.split(',').map(item => item.trim()) : undefined,
        receiptImage: receiptImage || undefined
      };
      
      addExpense(expense);
      navigate('/');
    } catch (error) {
      console.error('Error adding expense:', error);
      setIsLoading(false);
    }
  };
  
  const removeImage = () => {
    setReceiptImage(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Add New Expense</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Receipt Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Receipt Image (Optional)
              </label>
              
              {receiptImage ? (
                <div className="relative">
                  <img 
                    src={receiptImage} 
                    alt="Receipt" 
                    className="w-full max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                  }`}
                >
                  <input {...getInputProps()} />
                  {isProcessing ? (
                    <div className="flex flex-col items-center">
                      <Loader size={30} className="text-indigo-500 animate-spin mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Processing receipt...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Camera size={30} className="text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isDragActive
                          ? "Drop the image here"
                          : "Drag & drop a receipt image, or click to select"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Our AI will extract expense details automatically
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="merchant" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Merchant
                </label>
                <input
                  type="text"
                  id="merchant"
                  name="merchant"
                  value={formData.merchant}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="items" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Items (comma separated)
                </label>
                <input
                  type="text"
                  id="items"
                  name="items"
                  value={formData.items}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Coffee, Bagel, etc."
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
              >
                {isLoading ? (
                  <Loader size={16} className="animate-spin mr-2" />
                ) : (
                  <Check size={16} className="mr-2" />
                )}
                Save Expense
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
        <div className="flex items-start">
          <Receipt size={20} className="text-blue-500 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-300 text-sm">Try our AI Receipt Scanner</h4>
            <p className="text-blue-700 dark:text-blue-400 text-xs mt-1">
              Upload a receipt image and our AI will automatically extract the merchant, amount, date, and items to save you time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
