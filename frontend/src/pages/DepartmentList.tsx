import React, { useEffect, useState } from 'react';
import { Users, Mail, Edit } from 'lucide-react';


const departments = [
  {
    id: '1',
    name: 'Human Resources',
    email: 'hr@company.com',
    totalEmails: 156,
    color: 'blue'
  },
  {
    id: '2',
    name: 'Finance',
    email: 'finance@company.com',
    totalEmails: 89,
    color: 'green'
  },
  {
    id: '3',
    name: 'Information Technology',
    email: 'it@company.com',
    totalEmails: 234,
    color: 'purple'
  },
  {
    id: '4',
    name: 'Sales',
    email: 'sales@company.com',
    totalEmails: 312,
    color: 'orange'
  }
];

interface Department {
  id: number,
  name: String,
  email: String,
  totalEmails: number,
  color: String  
}

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const colors = ["red", "blue", "green", "yellow", "purple", "pink", "indigo", "teal", "gray"];
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token'); 
    fetch("http://localhost:8000/api/email/departments/", {
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
      .then((data) => {
        setDepartments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;





  return(
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
            <a
              href={`/departments/${dept.id}`}
              className="block"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${getRandomColor()}-100 flex items-center justify-center`}>
                  <Users className={`w-6 h-6 text-${getRandomColor()}-600`} />
                </div>
                <span className="flex items-center text-gray-500">
                  <Mail className="w-4 h-4 mr-1" />
                  {dept.totalEmails}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{dept.name}</h3>
              <p className="text-sm text-gray-500">{dept.email}</p>
            </a>
            <a
              href={`/create-department?id=${dept.id}`}
              className="absolute bottom-4 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              title="Edit Department"
            >
              <Edit className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentList;

// const DepartmentList = () => {
//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {departments.map((dept) => (
//           <div key={dept.id} className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
//             <a
//               href={`/departments/${dept.id}`}
//               className="block"
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`w-12 h-12 rounded-lg bg-${getRandomColor()}-100 flex items-center justify-center`}>
//                   <Users className={`w-6 h-6 text-${getRandomColor()}-600`} />
//                 </div>
//                 <span className="flex items-center text-gray-500">
//                   <Mail className="w-4 h-4 mr-1" />
//                   {dept.totalEmails}
//                 </span>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-1">{dept.name}</h3>
//               <p className="text-sm text-gray-500">{dept.email}</p>
//             </a>
//             <a
//               href={`/create-department?id=${dept.id}`}
//               className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
//               title="Edit Department"
//             >
//               <Edit className="w-4 h-4" />
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };