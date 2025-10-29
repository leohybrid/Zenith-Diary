
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Card from '../common/Card';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useAppContext } from '../../context/AppContext';
import { analyzeSpending } from '../../services/geminiService';
import { TransactionType, FinanceCategory } from '../../types';
import type { Transaction } from '../../types';
import { Sparkles, Download, PlusCircle, Trash2 } from '../icons';

const FinanceView: React.FC = () => {
    const { transactions, setTransactions } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id' | 'date'>>({
        type: TransactionType.Expense,
        category: FinanceCategory.Food,
        amount: 0,
        description: ''
    });

    const handleGetInsight = async () => {
        setLoading(true);
        const insight = await analyzeSpending(transactions);
        setAiInsight(insight);
        setLoading(false);
    };

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if(newTransaction.amount <= 0 || !newTransaction.description) return;
        const transactionToAdd: Transaction = {
            ...newTransaction,
            id: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0]
        };
        setTransactions([...transactions, transactionToAdd]);
        setNewTransaction({ type: TransactionType.Expense, category: FinanceCategory.Food, amount: 0, description: '' });
        setShowForm(false);
    };

    const handleDeleteTransaction = (id: string) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };

    const { income, expenses } = useMemo(() => {
        const income = transactions.filter(t => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);
        return { income, expenses };
    }, [transactions]);
    
    const chartData = [{ name: 'Today', income, expenses }];

    const exportToCSV = () => {
        const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount'];
        const rows = transactions.map(t => [t.id, t.date, t.type, t.category, t.description, t.amount].join(','));
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "zenith-finances.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card title="Financial Summary">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-400">Income</p>
                            <p className="text-2xl font-bold text-green-400">${income.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Expenses</p>
                            <p className="text-2xl font-bold text-red-400">${expenses.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Balance</p>
                            <p className={`text-2xl font-bold ${(income - expenses) >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                                ${(income - expenses).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="h-64 mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #3D3D3D' }} />
                                <Legend />
                                <Bar dataKey="income" fill="#4ade80" name="Income" />
                                <Bar dataKey="expenses" fill="#f87171" name="Expenses" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card title="Transactions">
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {transactions.map(t => (
                            <div key={t.id} className="flex justify-between items-center bg-gray-700 p-2 rounded-lg">
                                <div>
                                    <p className="font-semibold">{t.description}</p>
                                    <p className="text-xs text-gray-400">{t.category}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className={`font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                    </p>
                                    <button onClick={() => handleDeleteTransaction(t.id)} className="text-gray-400 hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button onClick={() => setShowForm(!showForm)} variant="secondary" className="w-full mt-4">
                        <PlusCircle size={16} /> Add Transaction
                    </Button>
                    {showForm && (
                         <form onSubmit={handleAddTransaction} className="mt-4 space-y-2 border-t border-gray-700 pt-4">
                            <input type="text" placeholder="Description" value={newTransaction.description} onChange={e => setNewTransaction({...newTransaction, description: e.target.value})} className="w-full bg-gray-600 rounded p-2" required/>
                            <input type="number" placeholder="Amount" value={newTransaction.amount || ''} onChange={e => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value)})} className="w-full bg-gray-600 rounded p-2" required/>
                            <select value={newTransaction.type} onChange={e => setNewTransaction({...newTransaction, type: e.target.value as TransactionType})} className="w-full bg-gray-600 rounded p-2">
                                <option value={TransactionType.Expense}>Expense</option>
                                <option value={TransactionType.Income}>Income</option>
                            </select>
                            <select value={newTransaction.category} onChange={e => setNewTransaction({...newTransaction, category: e.target.value as FinanceCategory})} className="w-full bg-gray-600 rounded p-2">
                                {Object.values(FinanceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <Button type="submit" className="w-full">Add</Button>
                        </form>
                    )}
                </Card>
            </div>
            <div className="space-y-6">
                <Card title="AI Spending Insights">
                    <div className="flex flex-col h-full">
                        <div className="flex-grow flex items-center justify-center bg-gray-700/50 p-4 rounded-lg mb-4 min-h-[150px]">
                             {loading ? <Spinner /> : <p className="text-center italic">{aiInsight || 'Your spending insight will appear here.'}</p>}
                        </div>
                        <Button onClick={handleGetInsight} disabled={loading} className="w-full">
                            {loading ? <Spinner size="sm" /> : <Sparkles />}
                            Analyze Spending
                        </Button>
                    </div>
                </Card>
                 <Card title="Export">
                    <p className="text-sm text-gray-400 mb-4">Export your daily financial record as a CSV file.</p>
                     <Button onClick={exportToCSV} variant="secondary" className="w-full">
                        <Download />
                        Export to CSV
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default FinanceView;
