import React from 'react';
import { Mail, Users, Settings, BarChart2, PlusCircle } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Mail, label: 'Inbox', path: '/' },
    { icon: Users, label: 'Departments', path: '/departments' },
    { icon: PlusCircle, label: 'Create Department', path: '/create-department' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    // { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen fixed left-0 top-0">
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <Mail className="w-8 h-8 text-blue-500" />
        <span className="text-white text-xl font-bold ml-2">MailFlow</span>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className="flex items-center px-6 py-4 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;