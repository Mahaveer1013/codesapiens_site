import React, { useState } from 'react';
import { Users, UserCheck, Calendar, TrendingUp, Search, Bell, Plus, BarChart3, Settings, MoreHorizontal, Check, X, Menu } from 'lucide-react';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sample data
  const stats = [
    {
      title: "Total Students",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Active Students", 
      value: "2,340",
      change: "+8%",
      icon: UserCheck,
      color: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Total Events",
      value: "156", 
      change: "+24%",
      icon: Calendar,
      color: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Avg. Attendance",
      value: "87%",
      change: "+5%",
      icon: TrendingUp,
      color: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  const students = [
    {
      id: 1,
      name: "Arun",
      email: "727723eucs090@skcet.ac.in",
      avatar: "A",
      status: "active",
      lastSeen: "2 min ago"
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "727723eucs045@skcet.ac.in", 
      avatar: "P",
      status: "inactive",
      lastSeen: "2 days ago"
    },
    {
      id: 3,
      name: "Rahul Kumar",
      email: "727723eucs078@skcet.ac.in",
      avatar: "R", 
      status: "active",
      lastSeen: "1 hour ago"
    },
    {
      id: 4,
      name: "Anitha Reddy",
      email: "727723eucs012@skcet.ac.in",
      avatar: "A",
      status: "active", 
      lastSeen: "5 min ago"
    },
    {
      id: 5,
      name: "Karthik Menon",
      email: "727723eucs089@skcet.ac.in",
      avatar: "K",
      status: "inactive",
      lastSeen: "1 week ago"
    }
  ];

  let filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === '' || student.status === filter;
    return matchesSearch && matchesFilter;
  });

  const quickActions = [
    { icon: Plus, label: "Add Student", shortLabel: "Add", color: "bg-blue-600 hover:bg-blue-700" },
    { icon: Bell, label: "Send Notice", shortLabel: "Notice", color: "bg-green-600 hover:bg-green-700" },
    { icon: BarChart3, label: "View Analytics", shortLabel: "Analytics", color: "bg-purple-600 hover:bg-purple-700" },
    { icon: TrendingUp, label: "Generate Report", shortLabel: "Report", color: "bg-orange-600 hover:bg-orange-700" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">A</span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500 sm:hidden">SKCET Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <div className="relative">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="sm:hidden p-2 text-gray-600 hover:text-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop User Info */}
            <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-xs sm:text-sm">JR</span>
              </div>
              <div className="text-xs sm:text-sm hidden md:block">
                <div className="font-medium text-gray-900">Jayasurya R</div>
                <div className="text-gray-500">Administrator</div>
              </div>
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t bg-white px-3 py-3">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">JR</span>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Jayasurya R</div>
                <div className="text-gray-500">Administrator</div>
              </div>
            </div>
            <div className="border-t pt-3">
              <button className="flex items-center space-x-2 w-full p-2 text-gray-700 hover:bg-gray-100 rounded">
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="p-3 sm:p-4 lg:p-6">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 flex flex-col sm:flex-row sm:items-center">
            <span>Welcome, Administrator!</span>
            <span className="text-2xl sm:ml-2">👋</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage your student community, events, and track engagement metrics.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 leading-tight">{stat.title}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                      <span className="text-xs text-green-600 font-medium hidden sm:inline">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-2 lg:p-3 rounded-lg ${stat.color} self-end lg:self-auto`}>
                    <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Student Management */}
          <div className="xl:col-span-2 order-2 xl:order-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 sm:p-6 border-b">
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-600" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Student Management</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {filteredStudents.length}
                    </span>
                  </div>
                  <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto">
                    + View All Students
                  </button>
                </div>

                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredStudents.length === 0 ? (
                  <div className="p-8 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No students found</p>
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <div key={student.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-medium text-sm">{student.avatar}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{student.name}</h4>
                                <p className="text-xs sm:text-sm text-gray-500 truncate">{student.email}</p>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end mt-2 sm:mt-0 sm:ml-4">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    student.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                  }`}></div>
                                  <span className="text-xs text-gray-500 sm:hidden">{student.lastSeen}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium hidden sm:inline ${
                                    student.status === 'active' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {student.status}
                                  </span>
                                </div>
                                <div className="flex space-x-1">
                                  <button className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors">
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                  <button className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors">
                                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                  <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                                    <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-1 xl:order-2">
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-1 gap-2 sm:gap-3">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <button 
                      key={index}
                      className={`flex flex-col sm:flex-row xl:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 xl:space-x-2 ${action.color} text-white py-3 sm:py-2 xl:py-3 px-2 sm:px-3 xl:px-4 rounded-lg transition-colors text-xs sm:text-sm font-medium`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="sm:hidden xl:inline">{action.label}</span>
                      <span className="hidden sm:inline xl:hidden">{action.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity - Hidden on mobile */}
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 hidden sm:block">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Arun joined the community</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New event created: Tech Workshop</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Monthly report generated</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues Notification */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">!</span>
                </div>
                <span className="text-red-800 font-medium text-sm flex-1">2 Pending Issues</span>
                <X className="w-4 h-4 text-red-600 cursor-pointer flex-shrink-0" />
              </div>
              <p className="text-red-700 text-xs sm:text-sm leading-relaxed">There are pending student verification requests that need your attention.</p>
              <button className="mt-3 text-xs text-red-700 font-medium hover:text-red-900 underline">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-3 py-2 sm:hidden">
          <div className="flex justify-around">
            {quickActions.slice(0, 4).map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button key={index} className="flex flex-col items-center space-y-1 py-2 px-3">
                  <IconComponent className="w-5 h-5 text-gray-600" />
                  <span className="text-xs text-gray-600">{action.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile padding bottom to account for fixed nav */}
        <div className="h-16 sm:hidden"></div>
      </main>
    </div>
  );
};

export default Dashboard;