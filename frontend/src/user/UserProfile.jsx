import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  TrendingUp, 
  Award, 
  Calendar, 
  Hash,
  Github,
  Linkedin,
  Globe,
  Menu,
  X
} from 'lucide-react';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = ['Overview', 'Skills', 'Achievements', 'Activity'];

  const stats = [
    {
      label: "Points",
      value: "1,250",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      label: "Badges", 
      value: "5",
      icon: Award,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      label: "Sessions",
      value: "12",
      icon: Calendar,
      color: "text-blue-500", 
      bgColor: "bg-blue-50"
    },
    {
      label: "Rank",
      value: "#15",
      icon: Hash,
      color: "text-green-500",
      bgColor: "bg-green-50"
    }
  ];

  const personalInfo = [
    { label: "College", value: "Sri Krishna College of Engineering and Technology" },
    { label: "Role", value: "Student" },
    { label: "Volunteering Hours", value: "25" },
    { label: "Projects Completed", value: "8" }
  ];

  const socialLinks = [
    { label: "GitHub Profile", icon: Github, href: "#" },
    { label: "LinkedIn Profile", icon: Linkedin, href: "#" },
    { label: "Portfolio Website", icon: Globe, href: "#" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-xl sm:text-2xl lg:text-3xl">A</span>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Arun Kumar</h1>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                Passionate about web development and machine learning. Always eager to learn new technologies and contribute to innovative projects.
              </p>
              
              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">727723eucs090@skcet.ac.in</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>Coimbatore, Tamil Nadu</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-3 sm:px-4 lg:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4 border hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-2 sm:p-2.5 rounded-lg ${stat.bgColor}`}>
                      <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="px-3 sm:px-4 lg:px-6">
          {/* Desktop Tabs */}
          <div className="hidden sm:flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Mobile Tabs */}
          <div className="sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-white"
            >
              {tabs.map((tab) => (
                <option key={tab} value={tab}>{tab}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 sm:p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {personalInfo.map((info, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:justify-between py-2">
                      <span className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">{info.label}</span>
                      <span className="text-sm text-gray-900 sm:text-right sm:max-w-xs">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 sm:p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {socialLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <IconComponent className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{link.label}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border lg:col-span-2">
              <div className="p-4 sm:p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {[
                    { action: "Completed Machine Learning Workshop", time: "2 hours ago", type: "achievement" },
                    { action: "Submitted Project: E-commerce Website", time: "1 day ago", type: "project" },
                    { action: "Earned JavaScript Certification Badge", time: "3 days ago", type: "badge" },
                    { action: "Attended React.js Study Session", time: "1 week ago", type: "session" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        activity.type === 'achievement' ? 'bg-green-500' :
                        activity.type === 'project' ? 'bg-blue-500' :
                        activity.type === 'badge' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Technical Skills */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 sm:p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Technical Skills</h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {[
                    { skill: "JavaScript", level: 90, color: "bg-yellow-500" },
                    { skill: "React.js", level: 85, color: "bg-blue-500" },
                    { skill: "Python", level: 80, color: "bg-green-500" },
                    { skill: "Node.js", level: 75, color: "bg-green-600" },
                    { skill: "Machine Learning", level: 70, color: "bg-purple-500" }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{item.skill}</span>
                        <span className="text-sm text-gray-500">{item.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                          style={{ width: `${item.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Soft Skills */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 sm:p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Soft Skills</h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Leadership", "Communication", "Team Work", "Problem Solving",
                    "Critical Thinking", "Time Management", "Adaptability", "Creativity"
                  ].map((skill, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                      <span className="text-sm font-medium text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Achievements' && (
          <div className="space-y-6">
            {/* Badges */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 sm:p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Earned Badges</h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    { name: "JavaScript Master", color: "bg-yellow-100 text-yellow-800", icon: "🏆" },
                    { name: "React Expert", color: "bg-blue-100 text-blue-800", icon: "⚛️" },
                    { name: "Team Player", color: "bg-green-100 text-green-800", icon: "👥" },
                    { name: "Code Reviewer", color: "bg-purple-100 text-purple-800", icon: "🔍" },
                    { name: "Fast Learner", color: "bg-orange-100 text-orange-800", icon: "⚡" }
                  ].map((badge, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="text-2xl mb-2">{badge.icon}</div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                        {badge.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 sm:p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {[
                    { name: "Full Stack Web Development", issuer: "SKCET Tech Hub", date: "Dec 2024" },
                    { name: "Machine Learning Fundamentals", issuer: "Coursera", date: "Nov 2024" },
                    { name: "React.js Advanced", issuer: "Meta Blueprint", date: "Oct 2024" }
                  ].map((cert, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors space-y-2 sm:space-y-0">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">{cert.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">{cert.issuer}</p>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 font-medium">
                        {cert.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Activity' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 sm:p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-6">
                {[
                  { 
                    date: "Today", 
                    activities: [
                      { time: "2:30 PM", action: "Submitted assignment: Database Design", type: "submission" },
                      { time: "10:15 AM", action: "Joined study group session", type: "participation" }
                    ]
                  },
                  { 
                    date: "Yesterday", 
                    activities: [
                      { time: "4:45 PM", action: "Completed React.js quiz", type: "completion" },
                      { time: "11:30 AM", action: "Downloaded course materials", type: "access" }
                    ]
                  },
                  { 
                    date: "3 days ago", 
                    activities: [
                      { time: "6:20 PM", action: "Earned JavaScript certification", type: "achievement" },
                      { time: "2:15 PM", action: "Started new course: Advanced React", type: "enrollment" }
                    ]
                  }
                ].map((day, dayIndex) => (
                  <div key={dayIndex}>
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">{day.date}</h4>
                    <div className="space-y-3 ml-4">
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="flex space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            activity.type === 'achievement' ? 'bg-green-500' :
                            activity.type === 'completion' ? 'bg-blue-500' :
                            activity.type === 'submission' ? 'bg-purple-500' :
                            activity.type === 'participation' ? 'bg-orange-500' : 'bg-gray-400'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <p className="text-sm text-gray-900">{activity.action}</p>
                              <span className="text-xs text-gray-500 mt-1 sm:mt-0">{activity.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-3 py-2 sm:hidden z-40">
        <div className="flex justify-around">
          {tabs.map((tab, index) => {
            const icons = [TrendingUp, Award, Calendar, Menu];
            const IconComponent = icons[index];
            return (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                  activeTab === tab ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-xs font-medium">{tab}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Notification Badge */}
      <div className="fixed bottom-20 right-4 sm:hidden z-30">
        <button className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">N</span>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">3</span>
          </div>
        </button>
      </div>

      {/* Mobile padding bottom to account for fixed nav */}
      <div className="h-20 sm:hidden"></div>
    </div>
  );
};

export default UserProfile;