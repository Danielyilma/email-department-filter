import React, { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Clock, Building } from 'lucide-react';
import { formatTimestamp } from '../utils';

type Email = {
    id: string;
    subject: string;
    sender: string;
    body: string;
    received_at: string; // ISO date string
    department: string;
    // status: "new" | "processing" | "completed"; // Assuming these are the possible statuses
};


const EmailView = () => {
  // In a real app, this would come from your state management
//   const email = {
//     id: '1',
//     subject: 'Q4 Financial Report Review',
//     sender: 'finance@company.com',
//     body: `Dear Team,

// I hope this email finds you well. Please find attached the Q4 financial report for your review.

// Key highlights:
// - Revenue increased by 15%
// - Operating costs reduced by 8%
// - New market expansion successful

// Please review and provide your feedback by EOD Friday.

// Best regards,
// Finance Team`,
//     receivedAt: '2024-03-15T10:30:00Z',
//     department: 'Finance',
//     status: 'new'
//   };

    const [email, setEmail] = useState<Email>();
    const [loading, setLoading] = useState(true);
    const path = window.location.pathname;
    const id = path.split("/").pop();
  
    useEffect(() => {
        const accessToken = localStorage.getItem('access_token'); 
      fetch(`http://127.0.0.1:8000/api/email/${id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setEmail(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching email:", error);
          setLoading(false);
        });
    }, []);
  
    if (loading) return <p>Loading...</p>;
    if (!email) return <p>Email not found</p>;
  

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <a href="#" onClick={() => window.history.back()} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{email.subject}</h1>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{email.sender}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTimestamp(email.received_at)}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Building className="w-4 h-4" />
              <span>{email.department}</span>
            </div>
            
            {/* <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${email.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  email.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                {email.status}
              </span>
            </div> */}
          </div>
        </div>
        
        <div className="p-6">
          <div className="prose max-w-none">
            {email.body.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailView;