"use client"

const DashboardPreviewSection = () => {
  return (
    <>
        <div className="max-w-7xl mx-auto md:px-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-300/40 to-blue-300/40 dark:from-purple-600/30 dark:to-blue-600/30 blur-3xl transform scale-110" />
              <div className="relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-white/10 p-6 shadow-2xl">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-500/20 dark:to-purple-600/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-200 dark:border-purple-500/30">
                    <div className="text-3xl font-bold text-purple-900 dark:text-white mb-1">73%</div>
                    <div className="text-sm text-purple-700 dark:text-gray-400">Classroom Score</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-500/20 dark:to-blue-600/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-200 dark:border-blue-500/30">
                    <div className="text-3xl font-bold text-blue-900 dark:text-white mb-1">200+</div>
                    <div className="text-sm text-blue-700 dark:text-gray-400">Schools</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-500/20 dark:to-indigo-600/20 backdrop-blur-sm rounded-2xl p-4 border border-indigo-200 dark:border-indigo-500/30">
                    <div className="text-3xl font-bold text-indigo-900 dark:text-white mb-1">203%</div>
                    <div className="text-sm text-indigo-700 dark:text-gray-400">Growth Rate</div>
                  </div>
                  <div className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-500/20 dark:to-pink-600/20 backdrop-blur-sm rounded-2xl p-4 border border-pink-200 dark:border-pink-500/30">
                    <div className="text-3xl font-bold text-pink-900 dark:text-white mb-1">38%</div>
                    <div className="text-sm text-pink-700 dark:text-gray-400">Engagement</div>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="bg-gray-50 dark:bg-black/30 rounded-xl p-6 border border-gray-200/50 dark:border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-900 dark:text-white font-semibold">Today's Learning</h3>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="h-32 bg-gradient-to-t from-purple-300 to-transparent dark:from-purple-500/30 dark:to-transparent rounded-lg" />
                    <div className="h-32 bg-gradient-to-t from-blue-300 to-transparent dark:from-blue-500/30 dark:to-transparent rounded-lg" />
                    <div className="h-32 bg-gradient-to-t from-pink-300 to-transparent dark:from-pink-500/30 dark:to-transparent rounded-lg" />
                  </div>
                  
                  {/* Student Images Placeholder */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-video bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg" />
                    <div className="aspect-video bg-gradient-to-br from-blue-200 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg" />
                    <div className="aspect-video bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
    </>
  )
}

export default DashboardPreviewSection