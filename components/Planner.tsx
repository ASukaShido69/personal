'use client';

import { useState } from 'react';
import { AppData, Task, WeeklyGoal } from '@/types';
import { Plus, Trash2, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { getCurrentWeek } from '@/lib/utils';

interface PlannerProps {
  appData: AppData;
  setAppData: (data: AppData | ((prev: AppData) => AppData)) => void;
}

export default function Planner({ appData, setAppData }: PlannerProps) {
  const [view, setView] = useState<'weekly' | 'daily'>('weekly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const [newGoal, setNewGoal] = useState({ title: '', description: '' });
  const [newTask, setNewTask] = useState({
    title: '',
    time: '09:00',
    duration: 60,
  });

  const currentWeek = getCurrentWeek();
  const weeklyGoals = appData.weeklyGoals.filter((g) => g.week === currentWeek);
  const dailyTasks = appData.tasks.filter((t) => t.date === selectedDate);

  const handleAddGoal = () => {
    if (!newGoal.title) {
      alert('กรุณากรอกชื่อเป้าหมาย');
      return;
    }

    const goal: WeeklyGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      completed: false,
      week: currentWeek,
    };

    setAppData((prev) => ({
      ...prev,
      weeklyGoals: [...prev.weeklyGoals, goal],
    }));

    setNewGoal({ title: '', description: '' });
    setIsAddingGoal(false);
  };

  const handleToggleGoal = (id: string) => {
    setAppData((prev) => ({
      ...prev,
      weeklyGoals: prev.weeklyGoals.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g
      ),
    }));
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('คุณต้องการลบเป้าหมายนี้ใช่หรือไม่?')) {
      setAppData((prev) => ({
        ...prev,
        weeklyGoals: prev.weeklyGoals.filter((g) => g.id !== id),
      }));
    }
  };

  const handleAddTask = () => {
    if (!newTask.title) {
      alert('กรุณากรอกชื่องาน');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      date: selectedDate,
      time: newTask.time,
      duration: newTask.duration,
      completed: false,
    };

    setAppData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, task],
    }));

    setNewTask({ title: '', time: '09:00', duration: 60 });
    setIsAddingTask(false);
  };

  const handleToggleTask = (id: string) => {
    setAppData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('คุณต้องการลบงานนี้ใช่หรือไม่?')) {
      setAppData((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== id),
      }));
    }
  };

  // Generate time slots for daily view
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-foreground">แผนการ</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView('weekly')}
            className={`px-4 py-2 rounded-md transition-colors ${
              view === 'weekly'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            สัปดาห์
          </button>
          <button
            onClick={() => setView('daily')}
            className={`px-4 py-2 rounded-md transition-colors ${
              view === 'daily'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            รายวัน
          </button>
        </div>
      </div>

      {/* Weekly View */}
      {view === 'weekly' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-foreground">เป้าหมายประจำสัปดาห์</h3>
            <button
              onClick={() => setIsAddingGoal(!isAddingGoal)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              เพิ่มเป้าหมาย
            </button>
          </div>

          {isAddingGoal && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h4 className="text-lg font-semibold mb-4 text-foreground">เพิ่มเป้าหมายใหม่</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">ชื่อเป้าหมาย</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
                    placeholder="เช่น ออกกำลังกาย 5 วัน"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">รายละเอียด</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground h-24"
                    placeholder="รายละเอียดเพิ่มเติม"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddGoal}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    บันทึก
                  </button>
                  <button
                    onClick={() => setIsAddingGoal(false)}
                    className="bg-secondary text-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {weeklyGoals.length > 0 ? (
              weeklyGoals.map((goal) => (
                <div
                  key={goal.id}
                  className={`rounded-lg border p-6 ${
                    goal.completed
                      ? 'bg-primary/10 border-primary/20'
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => handleToggleGoal(goal.id)}
                        className="mt-1"
                      >
                        <CheckCircle2
                          className={`h-6 w-6 ${
                            goal.completed ? 'text-primary fill-primary' : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                      <div className="flex-1">
                        <h4
                          className={`text-lg font-semibold ${
                            goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {goal.title}
                        </h4>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 rounded-lg border border-border bg-card">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">ยังไม่มีเป้าหมายสำหรับสัปดาห์นี้</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Daily View */}
      {view === 'daily' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-xl font-semibold text-foreground">ตารางรายวัน</h3>
            <div className="flex gap-3 w-full sm:w-auto">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 sm:flex-none bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
              />
              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                เพิ่มงาน
              </button>
            </div>
          </div>

          {isAddingTask && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h4 className="text-lg font-semibold mb-4 text-foreground">เพิ่มงานใหม่</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-foreground mb-2">ชื่องาน</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
                    placeholder="เช่น ประชุมทีม"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">เวลา</label>
                  <input
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">ระยะเวลา (นาที)</label>
                  <input
                    type="number"
                    value={newTask.duration}
                    onChange={(e) => setNewTask({ ...newTask, duration: Number(e.target.value) })}
                    className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddTask}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  บันทึก
                </button>
                <button
                  onClick={() => setIsAddingTask(false)}
                  className="bg-secondary text-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          )}

          {/* Timeline View */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="space-y-2">
              {timeSlots.map((time) => {
                const tasksAtTime = dailyTasks.filter((t) => t.time === time);
                return (
                  <div key={time} className="flex gap-4 border-b border-border pb-2">
                    <div className="w-20 flex-shrink-0 text-sm font-medium text-muted-foreground pt-2">
                      {time}
                    </div>
                    <div className="flex-1 min-h-[40px]">
                      {tasksAtTime.map((task) => (
                        <div
                          key={task.id}
                          className={`mb-2 p-3 rounded-md border ${
                            task.completed
                              ? 'bg-primary/10 border-primary/20'
                              : 'bg-secondary border-border'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleTask(task.id)}
                                className="h-4 w-4 rounded border-border"
                              />
                              <div>
                                <p
                                  className={`font-medium ${
                                    task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                                  }`}
                                >
                                  {task.title}
                                </p>
                                <p className="text-xs text-muted-foreground">{task.duration} นาที</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
