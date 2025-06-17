import React, { useEffect, useState } from 'react';
import { Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatTimestamp } from '../utils';

const mockEmails = [
  {
    id: '1',
    subject: 'Q4 Financial Report Review',
    sender: 'finance@company.com',
    timestamp: '10:30 AM',
    department: 'Finance',
    status: 'new',
    preview: 'Please review the attached Q4 financial report...'
  },
  {
    id: '2',
    subject: 'New Employee Onboarding',
    sender: 'hr@company.com',
    timestamp: '9:15 AM',
    department: 'HR',
    status: 'processing',
    preview: 'Welcome to the team! Here are your onboarding documents...'
  },
  {
    id: '3',
    subject: 'System Maintenance Notice',
    sender: 'it@company.com',
    timestamp: 'Yesterday',
    department: 'IT',
    status: 'resolved',
    preview: 'Scheduled maintenance will occur this weekend...'
  }
];

interface Email {
  id: number;
  sender: string;
  subject: string;
  body: string;
  received_at: string;
  category: string;
  forwarded_to: string;
}

const EmailDashboard = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {      
    const accessToken = localStorage.getItem('access_token'); 
      try {
        const response = await fetch("http://localhost:8000/api/email/", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch emails");
        }
        const data = await response.json();
        setEmails(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []); // Empty dependency array to run once when component mounts

  if (loading) return <p>Loading emails...</p>;
  if (error) return <p>Error: {error}</p>;



  return (
    <div className="space-y-6">

      {/* <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Emails</p>
                <p className="text-2xl font-semibold text-gray-900">1,234</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-semibold text-gray-900">2.5h</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-semibold text-gray-900">89%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">45</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Emails</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {emails.map((email) => (
            <a href={`/email/${email.id}`} >
            <div key={email.id} className="p-6 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Mail className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{email.subject}</h3>
                    <p className="text-sm text-gray-500">{email.sender}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${email.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      email.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                    {email.status}
                  </span> */}
                  <span className="text-sm text-gray-500">{formatTimestamp(email.received_at)}</span>
                </div>
              </div>
              {/* <p className="mt-1 text-sm text-gray-600">{email.preview}</p> */}
            </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailDashboard;