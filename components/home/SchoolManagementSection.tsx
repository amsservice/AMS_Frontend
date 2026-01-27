"use client"

const SchoolManagementSection = () => {
    const Assignment = ['Explore Features', 'Create Account', 'Navigate Dashboard', 'Optimize Workflow']
  return (
    <>
        <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simplify School Management in{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                3 Steps
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-white/10 p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Assignment</h3>
              <div className="space-y-4">
                {Assignment.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-200 dark:border-purple-500/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 shadow-lg">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Explore Features</h4>
                <p className="text-gray-600 dark:text-gray-400">Discover powerful tools designed to transform your school management experience.</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 shadow-lg">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Navigate Dashboard</h4>
                <p className="text-gray-600 dark:text-gray-400">Intuitive interface that makes managing your institution effortless and efficient.</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 shadow-lg">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Optimize Workflow</h4>
                <p className="text-gray-600 dark:text-gray-400">Streamline operations and boost productivity with automated processes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default SchoolManagementSection