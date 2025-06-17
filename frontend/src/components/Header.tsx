import React, { useEffect, useState } from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the user information from the backend
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem('access_token'); // Retrieve the access token from localStorage
      
      if (!accessToken) {
        console.error('No access token found');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/user/me/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data); // Set user info to state
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserInfo(); // Call the function to fetch user data on component mount
  }, []);


  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center flex-1">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search emails..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-gray-700">{user?.first_name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;