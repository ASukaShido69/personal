'use client';

import { AppData } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Wallet, Calendar, TrendingUp, BookOpen } from 'lucide-react';

interface DashboardProps {
  appData: AppData;
}

export default function Dashboard({ appData }: DashboardProps) {
  const totalIncome = appData.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = appData.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = appData.tasks.filter((t) => t.date === today);

  const latestExam = appData.examRecords.length > 0 
    ? appData.examRecords[appData.examRecords.length - 1]
    : null;

  const quotes = [
    'ความสำเร็จเริ่มต้นจากการลงมือทำ',
    'ทุกวันคือโอกาสใหม่ที่จะเป็นคนที่ดีกว่าเมื่อวาน',
    'ความมุ่งมั่นคือกุญแจสู่ความสำเร็จ',
    'เป้าหมายไม่ได้เกิดจากความตั้งใจ แต่เกิดจากการลงมือทำ',
    'อย่ายอมแพ้ ความสำเร็จอยู่ไม่ไกล',
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">สวัสดี! 👋</h2>
        <p className="text-muted-foreground">ภาพรวมของวันนี้</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Balance Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ยอดคงเหลือ</p>
              <h3 className={`text-2xl font-bold mt-2 ${currentBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(currentBalance)}
              </h3>
            </div>
            <Wallet className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Today's Tasks Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">งานวันนี้</p>
              <h3 className="text-2xl font-bold mt-2 text-foreground">
                {todayTasks.length} งาน
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                เสร็จแล้ว {todayTasks.filter(t => t.completed).length} งาน
              </p>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Latest Exam Score */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">คะแนนล่าสุด</p>
              {latestExam ? (
                <>
                  <h3 className="text-2xl font-bold mt-2 text-foreground">
                    {latestExam.score}/{latestExam.maxScore}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{latestExam.subject}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">ยังไม่มีข้อมูล</p>
              )}
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Journal Entries */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">บันทึก</p>
              <h3 className="text-2xl font-bold mt-2 text-foreground">
                {appData.journalEntries.length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">รายการ</p>
            </div>
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="rounded-lg border border-border bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <p className="text-lg font-medium text-foreground text-center">"{randomQuote}"</p>
      </div>

      {/* Today's Schedule */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-semibold mb-4 text-foreground">ตารางวันนี้</h3>
        {todayTasks.length > 0 ? (
          <div className="space-y-3">
            {todayTasks.sort((a, b) => a.time.localeCompare(b.time)).map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-md border ${
                  task.completed
                    ? 'bg-secondary/50 border-secondary'
                    : 'bg-secondary border-border'
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                  className="h-4 w-4 rounded border-border"
                />
                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {task.time} ({task.duration} นาที)
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">ไม่มีงานในวันนี้</p>
          </div>
        )}
      </div>

      {/* Skills Overview */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-semibold mb-4 text-foreground">ความคืบหน้าทักษะ</h3>
        <div className="space-y-4">
          {appData.skills.map((skill) => (
            <div key={skill.id}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{skill.name}</span>
                <span className="text-sm text-muted-foreground">{skill.progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${skill.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
