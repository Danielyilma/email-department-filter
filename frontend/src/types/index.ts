export interface Department {
  id: string;
  name: string;
  email: string;
  color: string;
}

export interface Rule {
  id: string;
  departmentId: string;
  type: 'sender' | 'subject' | 'keyword';
  value: string;
}

export interface Email {
  id: string;
  subject: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  departmentId: string;
  status: 'new' | 'processing' | 'resolved';
  isRead: boolean;
}

export interface DepartmentStats {
  totalEmails: number;
  averageResponseTime: number;
  resolvedEmails: number;
  openRate: number;
}