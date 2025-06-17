import React, { useState, useEffect } from 'react';
import { Users, Save } from 'lucide-react';
import DepartmentEmails from './DepartmentEmails';


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
}

const CreateDepartment = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [departments, setDepartments] = useState<Department>();

  const [isEditing, setIsEditing] = useState(false);
  const colors = ['blue', 'green', 'purple', 'orange', 'red', 'yellow', 'indigo', 'pink'];

  useEffect(() => {
    // In a real app, you'd get the department ID from URL params
    const searchParams = new URLSearchParams(window.location.search);
    const departmentId = searchParams.get('id');

    if (departmentId) {
      // Mock data - in a real app, this would fetch from your state management
      const accessToken = localStorage.getItem('access_token'); 
      const mockDepartment = {
        id: departmentId,
        name: 'Human Resources',
        email: 'hr',
        color: 'blue'
      };
      fetch(`http://localhost:8000/api/email/departments/${departmentId}`,{
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
          setFormData(data);
        })
        .catch((err: Error) => {
          // setError(err.message); // Handle error
          // setLoading(false); // Stop loading
        });

      // setFormData(mockDepartment);
      setIsEditing(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    const accessToken = localStorage.getItem('access_token'); 
    e.preventDefault();
    let data;
    let url;
    let method;
    let message;
    
    if (isEditing) {
      // Update existing department
      const updatedDepartment = {
        name: formData.name,
        department_email: formData.email,
      };

      data = updatedDepartment
      url = `http://localhost:8000/api/email/departments/update/${formData.id}/`
      method = 'PUT'
      message = "updated"
    } else {
      // Create new department
      const newDepartment = {
        name: formData.name,
        department_email: formData.email,
      };

      url = 'http://localhost:8000/api/email/departments/create/'
      data = newDepartment
      method = "POST"  
      message = "created"   
    }
    

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setResponseMessage(`Department successfully ${message}!`);
      } else {
        setResponseMessage(`Error ${message} department.`);
      }
    } catch (error) {
      setResponseMessage("Error submitting form.");
    }

    // Reset form and redirect
    setFormData({
      id: '',
      name: '',
      email: '',
    });
    // window.location.href = '/departments';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Update Department' : 'Create New Department'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Department Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., Human Resources"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Department Email
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full rounded-l-md border border-r-0 border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="department"
                required
              />
              {/* <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                @company.com
              </span> */}
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Color
            </label>
            <div className="grid grid-cols-8 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full bg-${color}-500 hover:ring-2 hover:ring-offset-2 hover:ring-${color}-500 focus:outline-none
                    ${formData.color === color ? `ring-2 ring-offset-2 ring-${color}-500` : ''}`}
                />
              ))}
            </div>
          </div> */}

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Save className="w-5 h-5 mr-2" />
            {isEditing ? 'Update Department' : 'Create Department'}
          </button>
        </div>
      </form>
      {responseMessage && (
        <div className="mt-4 text-center text-sm text-gray-700">
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default CreateDepartment;