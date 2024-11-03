const Progress = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Academic Progress</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Current GPA</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold">3.8</span>
            <span className="text-green-600 text-sm ml-2">+0.2</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Completed Credits</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold">45</span>
            <span className="text-gray-600 text-sm ml-2">/120</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Study Hours</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-bold">128</span>
            <span className="text-gray-600 text-sm ml-2">hrs this month</span>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Course Progress</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Mathematics 101</span>
              <span className="text-sm font-medium text-blue-600">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Physics</span>
              <span className="text-sm font-medium text-blue-600">72%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: '72%' }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Computer Science</span>
              <span className="text-sm font-medium text-blue-600">90%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: '90%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
