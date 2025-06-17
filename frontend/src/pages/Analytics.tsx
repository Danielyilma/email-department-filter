import React, { useEffect, useState } from 'react';
import { BarChart2, Mail, Forward, Building } from 'lucide-react';

type Department = {
    name: string;
    count: number;
  };
  
  type AnalyticsData = {
    totalEmails: number;
    totalForwarded: number;
    departments: Department[];
  };
  

  const Analytics = () => {
      
    const [stats, setStats] = useState<AnalyticsData>();
    const [loading, setLoading] = useState(true);
    const colors = ["blue", "green", "purple", "red", "yellow", "pink", "indigo", "teal", "orange"];
    const accessToken = localStorage.getItem('access_token'); 
    
    const getDepartmentColor = (name: string) => {
        const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length]; // Assign a color based on department name
    };

    useEffect(() => {
        fetch("http://localhost:8000/api/email/stats", {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((data) => {
        setStats(data);
        setLoading(false);
        })
        .catch((error) => {
        console.error("Error fetching analytics:", error);
        setLoading(false);
    });
}, []);

if (loading) return <p>Loading...</p>;
if (!stats) return <p>Error loading data.</p>;

return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Emails</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalEmails.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Forward className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Forwarded Emails</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalForwarded.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.departments.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Emails by Department</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {stats.departments.map((dept) => (
              <div key={dept.name} className="flex items-center">
                <div className="w-32 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600">{dept.name}</span>
                </div>
                <div className="flex-1 ml-4">
                  <div className="relative">
                    <div className={`bg-blue-200 rounded-full h-4`} style={{
                        width: `${(dept.count / stats.totalEmails) * 100}%`
                    }}>
                      <div className={`absolute inset-0 flex items-center justify-end pr-2`}>
                        <span className="text-xs font-medium text-gray-700">
                          {dept.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;























//   const stats = {
//     totalEmails: 1543,
//     totalForwarded: 456,
//     departments: [
//       { name: 'Finance', count: 423 },
//       { name: 'HR', count: 312 },
//       { name: 'IT', count: 289},
//       { name: 'Sales', count: 519 }
//     ]
//   };