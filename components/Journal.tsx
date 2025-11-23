'use client';

import { useState, useEffect } from 'react';
import { AppData, JournalEntry } from '@/types';
import { Save, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface JournalProps {
  appData: AppData;
  setAppData: (data: AppData | ((prev: AppData) => AppData)) => void;
}

export default function Journal({ appData, setAppData }: JournalProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const entry = appData.journalEntries.find((e) => e.date === selectedDate);
    setContent(entry?.content || '');
    setIsSaved(false);
  }, [selectedDate, appData.journalEntries]);

  const handleSave = () => {
    const existingEntry = appData.journalEntries.find((e) => e.date === selectedDate);

    if (existingEntry) {
      setAppData((prev) => ({
        ...prev,
        journalEntries: prev.journalEntries.map((e) =>
          e.date === selectedDate ? { ...e, content } : e
        ),
      }));
    } else {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: selectedDate,
        content,
      };
      setAppData((prev) => ({
        ...prev,
        journalEntries: [...prev.journalEntries, newEntry],
      }));
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const recentEntries = [...appData.journalEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">บันทึกประจำวัน</h2>
        <p className="text-muted-foreground">เขียนบันทึกความคิด ความรู้สึก และประสบการณ์ของคุณ</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-foreground">
                {formatDate(selectedDate)}
              </h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
              />
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 bg-secondary border border-border rounded-md px-4 py-3 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="เริ่มเขียนบันทึกของคุณที่นี่..."
            />

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-muted-foreground">
                {content.length} ตัวอักษร
              </p>
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  isSaved
                    ? 'bg-green-500 text-white'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                <Save className="h-4 w-4" />
                {isSaved ? 'บันทึกแล้ว' : 'บันทึก'}
              </button>
            </div>
          </div>

          {/* Writing Tips */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
            <h4 className="font-semibold text-foreground mb-3">💡 แนวคิดในการเขียนบันทึก</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• วันนี้เกิดอะไรขึ้นบ้าง มีเหตุการณ์สำคัญอะไร</li>
              <li>• ความรู้สึกและอารมณ์ในวันนี้เป็นอย่างไร</li>
              <li>• สิ่งที่เรียนรู้หรือค้นพบใหม่วันนี้</li>
              <li>• ความสำเร็จหรือความท้าทายที่เผชิญ</li>
              <li>• สิ่งที่รู้สึกขอบคุณในวันนี้</li>
              <li>• เป้าหมายหรือแผนสำหรับวันพรุ่งนี้</li>
            </ul>
          </div>
        </div>

        {/* Recent Entries Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              บันทึกล่าสุด
            </h3>

            {recentEntries.length > 0 ? (
              <div className="space-y-3">
                {recentEntries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedDate(entry.date)}
                    className={`w-full text-left p-3 rounded-md border transition-colors ${
                      entry.date === selectedDate
                        ? 'bg-primary/10 border-primary'
                        : 'bg-secondary border-border hover:bg-secondary/80'
                    }`}
                  >
                    <p className="font-medium text-foreground text-sm">
                      {new Date(entry.date).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {entry.content || 'ไม่มีเนื้อหา'}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">ยังไม่มีบันทึก</p>
              </div>
            )}

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">ทั้งหมด</span>
                  <span className="text-sm font-semibold text-foreground">
                    {appData.journalEntries.length} วัน
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">เดือนนี้</span>
                  <span className="text-sm font-semibold text-foreground">
                    {
                      appData.journalEntries.filter((e) => {
                        const entryMonth = new Date(e.date).getMonth();
                        const currentMonth = new Date().getMonth();
                        return entryMonth === currentMonth;
                      }).length
                    }{' '}
                    วัน
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
