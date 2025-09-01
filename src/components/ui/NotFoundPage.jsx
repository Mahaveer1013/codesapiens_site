import React from 'react';

const NotFoundPage = () => {
  const handleGoHome = () => {
    // In a real app, you'd use React Router's navigate or Next.js router
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-blue-200 blur-sm -z-10 animate-pulse delay-150">
            404
          </div>
        </div>

        {/* Main content card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 md:p-12 transform hover:scale-105 transition-all duration-300">
          {/* Icon */}
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.044-5.709-2.709M15 3.935c.915.329 1.761.834 2.5 1.482A7.996 7.996 0 0119.071 8M4.929 8c.329-.915.834-1.761 1.482-2.5A7.995 7.995 0 018.929 3.935M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed">
            The page you're looking for seems to have wandered off into the digital void. 
            <br className="hidden md:block" />
            Don't worry, even the best developers get lost sometimes!
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleGoHome}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🏠 Back to Dashboard
            </button>
            
            <button 
              onClick={handleGoBack}
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              ← Go Back
            </button>
          </div>

          {/* Help text */}
          <p className="text-gray-500 text-sm mt-8">
            Need help? Check out the{' '}
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
              Community
            </span>{' '}
            section or contact support.
          </p>
        </div>

        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-bounce delay-2000"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-indigo-200 rounded-full opacity-20 animate-bounce delay-500"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;