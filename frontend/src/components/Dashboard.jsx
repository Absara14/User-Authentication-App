import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          setUserData({
            email: tokenData.email,
            role: tokenData.role,
            message: data.message
          });
        } else {
          throw new Error('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Dashboard error:', error);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
          
          {userData && (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-600"><span className="font-medium">Email:</span> {userData.email}</p>
                  <p className="text-gray-600"><span className="font-medium">Role:</span> {userData.role}</p>
                </div>
              </div>
              
              {userData.role === 'ADMIN' && (
                <div className="pt-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Admin Panel</h2>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-600">Welcome to the admin dashboard! Here you can manage users and system settings.</p>
                  </div>
                </div>
              )}
              
              {userData.role === 'CUSTOMER' && (
                <div className="pt-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Dashboard</h2>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-600">Welcome to your customer dashboard! Here you can view your account details and manage your profile.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;