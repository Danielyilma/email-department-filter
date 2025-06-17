import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Mail, ArrowLeft } from 'lucide-react';
import { formatTimestamp } from '../utils';

const mockDepartmentEmails = {
  'hr@company.com': [
    {
      id: '1',
      subject: 'New Employee Onboarding',
      sender: 'recruitment@company.com',
      timestamp: '10:30 AM',
      status: 'new',
      preview: 'Please prepare onboarding documents for...'
    },
    {
      id: '2',
      subject: 'Leave Request Update',
      sender: 'employee@company.com',
      timestamp: '9:15 AM',
      status: 'processing',
      preview: 'I would like to request a leave for...'
    }
  ],
  'finance@company.com': [
    {
      id: '3',
      subject: 'Q4 Budget Review',
      sender: 'accounting@company.com',
      timestamp: 'Yesterday',
      status: 'resolved',
      preview: 'Here are the Q4 budget numbers for review...'
    }
  ]
};

interface Email {
    id: number;
    subject: string;
    sender: string;
    received_at: string;
    body: string;
  }
  
interface Department {
    id: number;
    name: string;
    email: string;
    emails: Email[];
}

const DepartmentEmails = () => {

    const path = window.location.pathname;
    const id = path.split("/").pop();
  const [departments, setDepartments] = useState<Department>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log(id)

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token'); 
    // Fetch data from the API
    fetch(`http://localhost:8000/api/email/departments/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }) // Replace with your actual API URL
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data: Department) => {
        setDepartments(data); // Set fetched departments data
        setLoading(false); // Stop loading
      })
      .catch((err: Error) => {
        setError(err.message); // Handle error
        setLoading(false); // Stop loading
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <a href="/departments" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{departments?.name}</h1>
          <p className="text-gray-500">{departments?.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Department Emails</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {departments?.emails.map((email) => (
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

export default DepartmentEmails;