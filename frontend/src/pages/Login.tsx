import React, { useEffect } from 'react';
import { Mail } from 'lucide-react';

const Login = () => {

  useEffect(() => {
    // This will run on the page load when redirected back from the OAuth callback
    const params = new URLSearchParams(window.location.search);
  
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
  
    if (accessToken && refreshToken) {
      // Store the tokens in localStorage or sessionStorage
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
  
      // Optionally, you can redirect to the home page or a protected page
      window.location.href = '/';  // Or wherever you want to navigate the user
    } else {
      console.error('Tokens not found in the URL');
    }

    // window.location.href = '/';
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white py-8 px-6 shadow-sm rounded-lg">
          <div className="flex justify-center mb-8">
            <div className="rounded-full bg-blue-100 p-3">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
            Welcome to MailFlow
          </h2>
          
          <a
            href="http://localhost:8000/api/user/oauth/google/redirect/"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </a>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Secure login powered by Google
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;