'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AppData } from '@/types';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import FinanceTracker from '@/components/FinanceTracker';
import Planner from '@/components/Planner';
import ExamTracker from '@/components/ExamTracker';
import Journal from '@/components/Journal';
import Settings from '@/components/Settings';

const initialData: AppData = {
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

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appData, setAppData, isLoaded] = useLocalStorage<AppData>('appData', initialData);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard appData={appData} />;
      case 'finance':
        return <FinanceTracker appData={appData} setAppData={setAppData} />;
      case 'planner':
        return <Planner appData={appData} setAppData={setAppData} />;
      case 'exam':
        return <ExamTracker appData={appData} setAppData={setAppData} />;
      case 'journal':
        return <Journal appData={appData} setAppData={setAppData} />;
      case 'settings':
        return <Settings appData={appData} setAppData={setAppData} />;
      default:
        return <Dashboard appData={appData} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
