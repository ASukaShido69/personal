'use client';

import { useState } from 'react';
import { AppData, Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface FinanceTrackerProps {
  appData: AppData;
  setAppData: (data: AppData | ((prev: AppData) => AppData)) => void;
}

const EXPENSE_CATEGORIES = [
  'อาหาร',
  'ค่าเดินทาง',
  'ค่าเช่า',
  'ค่าน้ำค่าไฟ',
  'การศึกษา',
  'สุขภาพ',
  'ความบันเทิง',
  'อื่นๆ',
];

const INCOME_CATEGORIES = ['เงินเดือน', 'ธุรกิจ', 'ลงทุน', 'อื่นๆ'];

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function FinanceTracker({ appData, setAppData }: FinanceTrackerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: 'expense',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type as 'income' | 'expense',
      amount: Number(newTransaction.amount),
      category: newTransaction.category,
      date: newTransaction.date || new Date().toISOString().split('T')[0],
      note: newTransaction.note || '',
    };

    setAppData((prev) => ({
      ...prev,
      transactions: [...prev.transactions, transaction],
    }));

    setNewTransaction({
      type: 'expense',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
    });
    setIsAdding(false);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
      setAppData((prev) => ({
        ...prev,
        transactions: prev.transactions.filter((t) => t.id !== id),
      }));
    }
  };

  const totalIncome = appData.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = appData.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseByCategory = appData.transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">การเงิน</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          เพิ่มรายการ
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">รายรับ</p>
              <h3 className="text-2xl font-bold text-green-500 mt-2">{formatCurrency(totalIncome)}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">รายจ่าย</p>
              <h3 className="text-2xl font-bold text-red-500 mt-2">{formatCurrency(totalExpense)}</h3>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">ยอดคงเหลือ</p>
            <h3
              className={`text-2xl font-bold mt-2 ${
                totalIncome - totalExpense >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {formatCurrency(totalIncome - totalExpense)}
            </h3>
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      {isAdding && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-xl font-semibold mb-4 text-foreground">เพิ่มรายการใหม่</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ประเภท</label>
              <select
                value={newTransaction.type}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, type: e.target.value as 'income' | 'expense', category: '' })
                }
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
              >
                <option value="expense">รายจ่าย</option>
                <option value="income">รายรับ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">จำนวนเงิน</label>
              <input
                type="number"
                value={newTransaction.amount || ''}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">หมวดหมู่</label>
              <select
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
              >
                <option value="">เลือกหมวดหมู่</option>
                {(newTransaction.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">วันที่</label>
              <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">หมายเหตุ</label>
              <input
                type="text"
                value={newTransaction.note}
                onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
                placeholder="หมายเหตุ (ถ้ามี)"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddTransaction}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              บันทึก
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="bg-secondary text-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Expense Chart */}
      {chartData.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-xl font-semibold mb-4 text-foreground">กราฟรายจ่ายตามหมวดหมู่</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Transactions List */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-semibold mb-4 text-foreground">รายการล่าสุด</h3>
        {appData.transactions.length > 0 ? (
          <div className="space-y-3">
            {[...appData.transactions]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10)
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-md border border-border bg-secondary"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.type === 'income'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {transaction.type === 'income' ? 'รายรับ' : 'รายจ่าย'}
                      </span>
                      <span className="font-medium text-foreground">{transaction.category}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(transaction.date)} {transaction.note && `• ${transaction.note}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-bold ${
                        transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">ยังไม่มีรายการ</p>
          </div>
        )}
      </div>
    </div>
  );
}
