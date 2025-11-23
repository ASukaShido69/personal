export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  note: string;
}

export interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  completed: boolean;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  week: string;
}

export interface ExamRecord {
  id: string;
  date: string;
  subject: string;
  score: number;
  maxScore: number;
  notes: string;
}

export interface Skill {
  id: string;
  name: string;
  progress: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export interface AppData {
  transactions: Transaction[];
  tasks: Task[];
  weeklyGoals: WeeklyGoal[];
  examRecords: ExamRecord[];
  skills: Skill[];
  journalEntries: JournalEntry[];
}
