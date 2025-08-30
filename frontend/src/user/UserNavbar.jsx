import React, { useState } from 'react';
import { Bell, Settings, Menu, X, ChevronDown } from 'lucide-react';

export default function UserNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="w-full px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">CS</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">CodeSapiens</span>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-auto">
            <div className="flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">
                Dashboard
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">
                Events
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">
                Community
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md font-medium transition-colors">
                Badges
              </a>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Notification Bell */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </span>
              </button>
            </div>

            {/* User Profile Section */}
            <div className="relative">
              <button 
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-medium text-sm">JR</span>
                </div>
                <div className="hidden lg:flex items-center space-x-1">
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">Jayasurya R</div>
                    <div className="text-xs text-gray-500">suryasuperman261@gmail.com</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500 ml-1" />
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-lg">JR</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Jayasurya R</div>
                        <div className="text-sm text-gray-500">suryasuperman261@gmail.com</div>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile Settings
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Account Preferences
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Help & Support
                    </a>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Sign Out
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Icon */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-md font-medium transition-colors">
              Dashboard
            </a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-md font-medium transition-colors">
              Events
            </a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-md font-medium transition-colors">
              Community
            </a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-md font-medium transition-colors">
              Badges
            </a>
            
            {/* Mobile User Info */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="px-4 py-2">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">JR</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Jayasurya R</div>
                    <div className="text-sm text-gray-500">suryasuperman261@gmail.com</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <a href="#" className="block text-sm text-gray-700 hover:text-blue-600 py-1">Profile Settings</a>
                  <a href="#" className="block text-sm text-gray-700 hover:text-blue-600 py-1">Account Preferences</a>
                  <a href="#" className="block text-sm text-gray-700 hover:text-blue-600 py-1">Help & Support</a>
                  <a href="#" className="block text-sm text-red-600 hover:text-red-700 py-1">Sign Out</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for dropdowns */}
      {(isMobileMenuOpen || isProfileDropdownOpen) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsProfileDropdownOpen(false);
          }}
        />
      )}
    </nav>
  );
}