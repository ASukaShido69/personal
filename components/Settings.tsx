'use client';

import { useRef } from 'react';
import { AppData } from '@/types';
import { Download, Upload, Trash2, AlertCircle } from 'lucide-react';
import { downloadJSON } from '@/lib/utils';

interface SettingsProps {
  appData: AppData;
  setAppData: (data: AppData | ((prev: AppData) => AppData)) => void;
}

export default function Settings({ appData, setAppData }: SettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const filename = `life-dashboard-backup-${new Date().toISOString().split('T')[0]}.json`;
    downloadJSON(appData, filename);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Validate the imported data structure
        if (
          !importedData.transactions ||
          !importedData.tasks ||
          !importedData.weeklyGoals ||
          !importedData.examRecords ||
          !importedData.skills ||
          !importedData.journalEntries
        ) {
          alert('ไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์ที่ Export จากระบบนี้');
          return;
        }

        if (confirm('คุณต้องการนำเข้าข้อมูลนี้ใช่หรือไม่? ข้อมูลเดิมจะถูกแทนที่')) {
          setAppData(importedData);
          alert('นำเข้าข้อมูลสำเร็จ!');
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ กรุณาตรวจสอบไฟล์ของคุณ');
      }
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAllData = () => {
    if (
      confirm(
        'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้\n\nแนะนำให้ Export ข้อมูลก่อนลบ'
      )
    ) {
      if (confirm('ยืนยันอีกครั้ง: ลบข้อมูลทั้งหมด?')) {
        const emptyData: AppData = {
          transactions: [],
          tasks: [],
          weeklyGoals: [],
          examRecords: [],
          skills: [
            { id: '1', name: 'ร่างกาย', progress: 0 },
            { id: '2', name: 'กฎหมาย', progress: 0 },
            { id: '3', name: 'ภาษาอังกฤษ', progress: 0 },
            { id: '4', name: 'คณิตศาสตร์', progress: 0 },
            { id: '5', name: 'ความรู้ทั่วไป', progress: 0 },
          ],
          journalEntries: [],
        };
        setAppData(emptyData);
        alert('ลบข้อมูลทั้งหมดเรียบร้อยแล้ว');
      }
    }
  };

  const stats = {
    transactions: appData.transactions.length,
    tasks: appData.tasks.length,
    weeklyGoals: appData.weeklyGoals.length,
    examRecords: appData.examRecords.length,
    journalEntries: appData.journalEntries.length,
  };

  const totalItems = Object.values(stats).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">ตั้งค่า</h2>
        <p className="text-muted-foreground">จัดการข้อมูลและการตั้งค่าของแอปพลิเคชัน</p>
      </div>

      {/* Data Overview */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-semibold mb-4 text-foreground">ภาพรวมข้อมูล</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 rounded-md bg-secondary">
            <p className="text-sm text-muted-foreground">รายการเงิน</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.transactions}</p>
          </div>
          <div className="p-4 rounded-md bg-secondary">
            <p className="text-sm text-muted-foreground">งาน</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.tasks}</p>
          </div>
          <div className="p-4 rounded-md bg-secondary">
            <p className="text-sm text-muted-foreground">เป้าหมายสัปดาห์</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.weeklyGoals}</p>
          </div>
          <div className="p-4 rounded-md bg-secondary">
            <p className="text-sm text-muted-foreground">ข้อมูลการสอบ</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.examRecords}</p>
          </div>
          <div className="p-4 rounded-md bg-secondary">
            <p className="text-sm text-muted-foreground">บันทึกประจำวัน</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.journalEntries}</p>
          </div>
          <div className="p-4 rounded-md bg-primary/20 border border-primary">
            <p className="text-sm text-primary">รวมทั้งหมด</p>
            <p className="text-2xl font-bold text-primary mt-1">{totalItems}</p>
          </div>
        </div>
      </div>

      {/* Export Data */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Download className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">ส่งออกข้อมูล</h3>
            <p className="text-sm text-muted-foreground mb-4">
              ดาวน์โหลดข้อมูลทั้งหมดของคุณในรูปแบบ JSON เพื่อสำรองข้อมูลหรือย้ายไปยังอุปกรณ์อื่น
            </p>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              ดาวน์โหลดข้อมูล
            </button>
          </div>
        </div>
      </div>

      {/* Import Data */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">นำเข้าข้อมูล</h3>
            <p className="text-sm text-muted-foreground mb-4">
              นำเข้าข้อมูลจากไฟล์ JSON ที่ส่งออกไว้ก่อนหน้านี้ ข้อมูลเดิมจะถูกแทนที่
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-4 w-4" />
              เลือกไฟล์
            </button>
          </div>
        </div>
      </div>

      {/* Warning Section */}
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">⚠️ คำเตือนสำคัญ</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• ข้อมูลทั้งหมดถูกเก็บใน LocalStorage ของเบราว์เซอร์</li>
              <li>• การล้างข้อมูลเบราว์เซอร์จะทำให้ข้อมูลหายไป</li>
              <li>• แนะนำให้ Export ข้อมูลเป็นประจำเพื่อสำรองข้อมูล</li>
              <li>• ข้อมูลจะไม่ถูกซิงค์ระหว่างอุปกรณ์หรือเบราว์เซอร์</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Clear All Data */}
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-red-500/10">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">ลบข้อมูลทั้งหมด</h3>
            <p className="text-sm text-muted-foreground mb-4">
              ลบข้อมูลทั้งหมดออกจากระบบ การกระทำนี้ไม่สามารถย้อนกลับได้ กรุณาแน่ใจก่อนดำเนินการ
            </p>
            <button
              onClick={handleClearAllData}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              ลบข้อมูลทั้งหมด
            </button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">เกี่ยวกับแอป</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">เวอร์ชัน:</span> 1.0.0
          </p>
          <p>
            <span className="font-medium text-foreground">พัฒนาโดย:</span> Next.js + React
          </p>
          <p>
            <span className="font-medium text-foreground">เทคโนโลยี:</span> Next.js, Tailwind CSS,
            Recharts, LocalStorage
          </p>
          <p className="pt-2">
            แอปพลิเคชันนี้พัฒนาขึ้นเพื่อช่วยจัดการชีวิตส่วนตัว รวมถึงการเงิน แผนการ การเตรียมสอบ
            และบันทึกประจำวัน
          </p>
        </div>
      </div>
    </div>
  );
}
