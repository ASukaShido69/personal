'use client';

import { useState } from 'react';
import { AppData, ExamRecord, Skill } from '@/types';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDate } from '@/lib/utils';

interface ExamTrackerProps {
  appData: AppData;
  setAppData: (data: AppData | ((prev: AppData) => AppData)) => void;
}

export default function ExamTracker({ appData, setAppData }: ExamTrackerProps) {
  const [isAddingExam, setIsAddingExam] = useState(false);
  const [newExam, setNewExam] = useState({
    date: new Date().toISOString().split('T')[0],
    subject: '',
    score: 0,
    maxScore: 100,
    notes: '',
  });

  const handleAddExam = () => {
    if (!newExam.subject || !newExam.score) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const exam: ExamRecord = {
      id: Date.now().toString(),
      date: newExam.date,
      subject: newExam.subject,
      score: Number(newExam.score),
      maxScore: Number(newExam.maxScore),
      notes: newExam.notes,
    };

    setAppData((prev) => ({
      ...prev,
      examRecords: [...prev.examRecords, exam],
    }));

    setNewExam({
      date: new Date().toISOString().split('T')[0],
      subject: '',
      score: 0,
      maxScore: 100,
      notes: '',
    });
    setIsAddingExam(false);
  };

  const handleDeleteExam = (id: string) => {
    if (confirm('คุณต้องการลบข้อมูลการสอบนี้ใช่หรือไม่?')) {
      setAppData((prev) => ({
        ...prev,
        examRecords: prev.examRecords.filter((e) => e.id !== id),
      }));
    }
  };

  const handleUpdateSkill = (id: string, progress: number) => {
    setAppData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, progress: Math.min(100, Math.max(0, progress)) } : s)),
    }));
  };

  // Prepare chart data
  const chartData = appData.examRecords
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((exam) => ({
      date: new Date(exam.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
      percentage: Math.round((exam.score / exam.maxScore) * 100),
      subject: exam.subject,
    }));

  const averageScore =
    appData.examRecords.length > 0
      ? appData.examRecords.reduce((sum, exam) => sum + (exam.score / exam.maxScore) * 100, 0) / appData.examRecords.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">สอบตำรวจ</h2>
        <button
          onClick={() => setIsAddingExam(!isAddingExam)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          บันทึกคะแนน
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">จำนวนข้อสอบ</p>
          <h3 className="text-2xl font-bold text-foreground mt-2">{appData.examRecords.length}</h3>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">คะแนนเฉลี่ย</p>
          <h3 className="text-2xl font-bold text-primary mt-2">{averageScore.toFixed(1)}%</h3>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">แนวโน้ม</p>
              <h3 className="text-2xl font-bold text-green-500 mt-2">
                {appData.examRecords.length >= 2 ? (
                  <>
                    {((appData.examRecords[appData.examRecords.length - 1].score /
                      appData.examRecords[appData.examRecords.length - 1].maxScore -
                      appData.examRecords[appData.examRecords.length - 2].score /
                        appData.examRecords[appData.examRecords.length - 2].maxScore) *
                      100).toFixed(1)}%
                  </>
                ) : (
                  'N/A'
                )}
              </h3>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Add Exam Form */}
      {isAddingExam && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-xl font-semibold mb-4 text-foreground">บันทึกผลสอบ</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">วันที่</label>
              <input
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">วิชา</label>
              <input
                type="text"
                value={newExam.subject}
                onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
                placeholder="เช่น กฎหมาย, ภาษาอังกฤษ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">คะแนนที่ได้</label>
              <input
                type="number"
                value={newExam.score || ''}
                onChange={(e) => setNewExam({ ...newExam, score: Number(e.target.value) })}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">คะแนนเต็ม</label>
              <input
                type="number"
                value={newExam.maxScore || ''}
                onChange={(e) => setNewExam({ ...newExam, maxScore: Number(e.target.value) })}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
                placeholder="100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">หมายเหตุ</label>
              <textarea
                value={newExam.notes}
                onChange={(e) => setNewExam({ ...newExam, notes: e.target.value })}
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground h-24"
                placeholder="บันทึกเพิ่มเติม..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddExam}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              บันทึก
            </button>
            <button
              onClick={() => setIsAddingExam(false)}
              className="bg-secondary text-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Score Trend Chart */}
      {chartData.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-xl font-semibold mb-4 text-foreground">กราฟแนวโน้มคะแนน</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2} name="คะแนน (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Skills Progress */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-semibold mb-4 text-foreground">ทักษะที่ต้องพัฒนา</h3>
        <div className="space-y-6">
          {appData.skills.map((skill) => (
            <div key={skill.id}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{skill.name}</span>
                <span className="text-sm text-muted-foreground">{skill.progress}%</span>
              </div>
              <div className="flex gap-3 items-center">
                <div className="flex-1 bg-secondary rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateSkill(skill.id, skill.progress - 5)}
                    className="bg-secondary text-foreground px-2 py-1 rounded hover:bg-secondary/80 transition-colors text-sm"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleUpdateSkill(skill.id, skill.progress + 5)}
                    className="bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 transition-colors text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Records List */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-semibold mb-4 text-foreground">ประวัติการสอบ</h3>
        {appData.examRecords.length > 0 ? (
          <div className="space-y-3">
            {[...appData.examRecords]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 rounded-md border border-border bg-secondary">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground">{exam.subject}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          (exam.score / exam.maxScore) * 100 >= 70
                            ? 'bg-green-500/20 text-green-500'
                            : (exam.score / exam.maxScore) * 100 >= 50
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {((exam.score / exam.maxScore) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(exam.date)} • {exam.score}/{exam.maxScore}
                      {exam.notes && ` • ${exam.notes}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    className="text-red-500 hover:text-red-600 transition-colors ml-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">ยังไม่มีข้อมูลการสอบ</p>
          </div>
        )}
      </div>
    </div>
  );
}
