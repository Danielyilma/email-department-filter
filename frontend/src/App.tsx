import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EmailDashboard from './pages/EmailDashboard';
import DepartmentList from './pages/DepartmentList';
import DepartmentEmails from './pages/DepartmentEmails';
import CreateDepartment from './pages/CreateDepartment';
import Analytics from './pages/Analytics';
import EmailView from './pages/EmailView';
import Login from './pages/Login';
import { isAuthenticated } from './utils';

function App() {
  // In a real app, you'd use a router and proper auth state management
  // const isAuthenticated = ; // This would be managed by your auth system
  const path = window.location.pathname;

  if (!isAuthenticated()) {
    return <Login />;
  }

  const renderContent = () => {
    if (path === '/departments') {
      return <DepartmentList />;
    } else if (path.startsWith('/departments/')) {
      return <DepartmentEmails />;
    } else if (path === '/create-department') {
      return <CreateDepartment />;
    } else if (path === '/analytics') {
      return <Analytics />;
    } else if (path.startsWith('/email/')) {
      return <EmailView />;
    }
    return <EmailDashboard />;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="mt-16 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

// 1. update the create departement to also update the department data
// 2. add a login page that has login with google link
// 3. add a email view page to view specific email
//                includes sender,  subject, body , received_at , Department
// 4.update the analytics page contains
//                total emails
//                total number of email forwarded
//                 department specific email numbers
                
               
               

export default App;