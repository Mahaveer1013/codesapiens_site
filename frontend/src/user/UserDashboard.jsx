import React from 'react';
import { Calendar, Trophy, Users, TrendingUp, Bell, Settings, X } from 'lucide-react';

export default function UserDashboard() {
  const stats = [
    {
      title: 'Total Points',
      value: '0',
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Sessions Attended',
      value: '0',
      icon: <Calendar className="w-6 h-6 text-green-500" />,
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Badges Earned',
      value: '0',
      icon: <Trophy className="w-6 h-6 text-purple-500" />,
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100'
    },
    {
      title: 'Volunteering Hours',
      value: '0',
      icon: <Users className="w-6 h-6 text-orange-500" />,
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Jayasurya R! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening in your student community today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-xl p-4 sm:p-6 border border-gray-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.iconBg} p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Upcoming Events */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            </div>
            
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
              <p className="text-gray-500">Check back later for new events!</p>
            </div>
          </div>

          {/* Recent Badges */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Trophy className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900">Recent Badges</h2>
            </div>
            
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No badges earned yet</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Join Event</span>
            </button>
            
            <button className="flex flex-col items-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Find Peers</span>
            </button>
            
            <button className="flex flex-col items-center p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">View Badges</span>
            </button>
            
            <button className="flex flex-col items-center p-4 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors duration-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Progress</span>
            </button>
          </div>
        </div>

        
        
      </main>
    </div>
  );
}