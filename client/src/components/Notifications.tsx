const Notifications = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-4">
          {/* Today's Notifications */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-600">Today</h2>

            <div className="space-y-3">
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">📚</span>
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium">Study Group Meeting</p>
                  <p className="text-sm text-gray-600">
                    Calculus group meeting in 30 minutes
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">✅</span>
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium">Assignment Completed</p>
                  <p className="text-sm text-gray-600">
                    Physics Lab Report submitted successfully
                  </p>
                  <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Earlier Notifications */}
          <div className="space-y-4 mt-8">
            <h2 className="font-semibold text-gray-600">Earlier</h2>

            <div className="space-y-3">
              <div className="flex items-start p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600">🎯</span>
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-medium">New Goal Achieved</p>
                  <p className="text-sm text-gray-600">
                    Completed 5 consecutive study sessions
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
