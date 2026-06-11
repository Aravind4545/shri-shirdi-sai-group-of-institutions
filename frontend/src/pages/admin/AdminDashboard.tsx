import { Users, GraduationCap, FileText, ClipboardList, TrendingUp, AlertTriangle, UserPlus, CreditCard, Clock, Activity, CheckCircle, Search, Calendar, ChevronRight, ShieldCheck, PieChart as PieChartIcon, BookOpen, Award, ArrowUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const AdminDashboard = () => {

  const mockData = {
    topMetrics: {
      totalUsers: "18,532", userGrowth: "12.5%",
      totalTeachers: "1,248", teacherGrowth: "8.3%",
      totalStudents: "17,284", studentGrowth: "10.7%",
      testsConducted: "2,985", testGrowth: "15.6%",
      averagePass: "78.6%", passGrowth: "5.2%",
      activeSubscriptions: "957", subGrowth: "9.1%"
    },
    userGrowthData: [
      { date: 'May 19', TotalUsers: 10000, Students: 8000 },
      { date: 'May 20', TotalUsers: 12000, Students: 9500 },
      { date: 'May 21', TotalUsers: 13500, Students: 11000 },
      { date: 'May 22', TotalUsers: 14500, Students: 12000 },
      { date: 'May 23', TotalUsers: 16000, Students: 13500 },
      { date: 'May 24', TotalUsers: 17500, Students: 15000 },
      { date: 'May 25', TotalUsers: 18532, Students: 17284 },
    ],
    testsOverview: [
      { name: 'Practice Tests', value: 1245, color: '#6366f1', percentage: '41.7%' },
      { name: 'Chapter Tests', value: 870, color: '#10b981', percentage: '29.1%' },
      { name: 'Mock Tests', value: 605, color: '#f59e0b', percentage: '20.3%' },
      { name: 'Other Tests', value: 265, color: '#14b8a6', percentage: '8.9%' }
    ],
    topPerformingClasses: [
      { name: 'Class 12 - A', passPercentage: 92.4, color: '#10b981' },
      { name: 'Class 10 - B', passPercentage: 88.7, color: '#10b981' },
      { name: 'Class 11 - C', passPercentage: 86.1, color: '#10b981' },
      { name: 'Class 9 - A', passPercentage: 83.5, color: '#10b981' },
      { name: 'Class 8 - A', passPercentage: 81.3, color: '#10b981' },
      { name: 'Class 7 - B', passPercentage: 81.2, color: '#10b981' },
    ],
    systemSummary: [
      { label: 'Total Users Created', value: '5,678', icon: <Users className="w-4 h-4 text-indigo-500"/> },
      { label: 'Total Questions', value: '135,430', icon: <FileText className="w-4 h-4 text-blue-500"/> },
      { label: 'Total Subjects', value: '24', icon: <BookOpen className="w-4 h-4 text-emerald-500"/> },
      { label: 'Total Chapters', value: '342', icon: <FileText className="w-4 h-4 text-amber-500"/> },
      { label: 'Total Topics', value: '2,468', icon: <ClipboardList className="w-4 h-4 text-orange-500"/> },
      { label: 'Total Badges', value: '85', icon: <Award className="w-4 h-4 text-rose-500"/> },
      { label: 'Tests Created', value: '1,245', icon: <PieChartIcon className="w-4 h-4 text-purple-500"/> },
    ],
    recentRegistrations: [
      { name: 'Rahul Sharma', initials: 'RS', role: 'Student', date: 'May 25, 2024 10:30 AM', color: 'bg-indigo-500' },
      { name: 'Ananya Reddy', initials: 'AR', role: 'Teacher', date: 'May 25, 2024 09:15 AM', color: 'bg-purple-500' },
      { name: 'Vivaan Singh', initials: 'VS', role: 'Teacher', date: 'May 25, 2024 08:45 AM', color: 'bg-emerald-500' },
      { name: 'Neha Verma', initials: 'NV', role: 'Student', date: 'May 24, 2024 06:20 PM', color: 'bg-blue-500' },
      { name: 'Arjun Patel', initials: 'AP', role: 'Student', date: 'May 24, 2024 03:40 PM', color: 'bg-indigo-500' },
    ],
    recentTests: [
      { test: 'JEE Main Mock Test - 6', class: 'Class 12 - MPC', date: 'May 25, 2024 10:00 AM', status: 'Completed' },
      { test: 'Chemistry Chapter Test', class: 'Class 12 - MPC', date: 'May 25, 2024 09:30 AM', status: 'Completed' },
      { test: 'Maths Full Syllabus Test', class: 'Class 11 - MPC', date: 'May 24, 2024 04:15 PM', status: 'Completed' },
      { test: 'Physics Unit Test - 2', class: 'Class 11 - MPC', date: 'May 24, 2024 03:20 PM', status: 'Completed' },
      { test: 'Weekly Test - 4', class: 'Class 10 - MPC', date: 'May 24, 2024 01:15 PM', status: 'Completed' },
    ],
    subscriptionsOverview: [
      { name: 'Active', value: 687, percentage: '71.8%', color: '#10b981' },
      { name: 'Expiring Soon', value: 195, percentage: '20.4%', color: '#f59e0b' },
      { name: 'Expired', value: 75, percentage: '7.8%', color: '#ef4444' },
    ],
    alerts: [
      { text: '5 subscriptions are expiring in 3 days', date: 'May 25, 2024', icon: <AlertTriangle className="w-4 h-4 text-amber-500"/> },
      { text: '12 tests are pending review', date: 'May 25, 2024', icon: <AlertTriangle className="w-4 h-4 text-blue-500"/> },
      { text: 'System backup completed successfully', date: 'May 25, 2024', icon: <CheckCircle className="w-4 h-4 text-emerald-500"/> },
      { text: 'New teacher registered: Neha R.', date: 'May 25, 2024', icon: <UserPlus className="w-4 h-4 text-purple-500"/> },
    ]
  };

  const renderMetricCard = (title: string, value: string, growth: string, icon: any, color: string, bg: string) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-500">{title}</span>
          <span className="text-2xl font-black text-slate-800 mt-1">{value}</span>
        </div>
        <div className={`p-3 rounded-xl ${bg}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center text-xs font-bold text-emerald-600 mt-2">
        <ArrowUp className="w-3 h-3 mr-1" />
        {growth} vs last month
      </div>
    </div>
  );

  return (
    <div className="space-y-6 bg-slate-50 min-h-screen font-sans pb-10">
      {/* Top Bar / Header Component would normally go here, handled by Layout, but let's emulate the inner specific header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="text-center w-full relative">
          <h1 className="text-4xl font-black text-indigo-700 uppercase tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Monitor. Manage. Optimize. Empower Every Learner.</p>
        </div>
        <div className="absolute right-12 flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 cursor-pointer hover:bg-slate-100">
          <Calendar className="w-4 h-4" />
          May 19 - May 25, 2024
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {renderMetricCard('Total Users', mockData.topMetrics.totalUsers, mockData.topMetrics.userGrowth, <Users className="w-6 h-6 text-indigo-600"/>, 'text-indigo-600', 'bg-indigo-50')}
        {renderMetricCard('Total Teachers', mockData.topMetrics.totalTeachers, mockData.topMetrics.teacherGrowth, <GraduationCap className="w-6 h-6 text-purple-600"/>, 'text-purple-600', 'bg-purple-50')}
        {renderMetricCard('Total Students', mockData.topMetrics.totalStudents, mockData.topMetrics.studentGrowth, <Users className="w-6 h-6 text-emerald-600"/>, 'text-emerald-600', 'bg-emerald-50')}
        {renderMetricCard('Tests Conducted', mockData.topMetrics.testsConducted, mockData.topMetrics.testGrowth, <ClipboardList className="w-6 h-6 text-amber-600"/>, 'text-amber-600', 'bg-amber-50')}
        {renderMetricCard('Average Pass %', mockData.topMetrics.averagePass, mockData.topMetrics.passGrowth, <Activity className="w-6 h-6 text-teal-600"/>, 'text-teal-600', 'bg-teal-50')}
        {renderMetricCard('Active Subscriptions', mockData.topMetrics.activeSubscriptions, mockData.topMetrics.subGrowth, <CreditCard className="w-6 h-6 text-rose-600"/>, 'text-rose-600', 'bg-rose-50')}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">User Growth Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <RechartsTooltip />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="TotalUsers" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Total Users" />
                <Line type="monotone" dataKey="Students" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Students" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tests Overview Donut */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-2">Tests Overview</h3>
          {/* Chart */}
          <div className="relative w-full h-44 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.testsOverview}
                  cx="50%"
                  cy="50%"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {mockData.testsOverview.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-slate-800">2,985</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Total Tests</span>
            </div>
          </div>
          {/* Legend below */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            {mockData.testsOverview.map((test, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: test.color }}></div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-bold text-slate-700">{test.name}</span>
                  <span className="text-[10px] font-medium text-slate-400">{test.value} ({test.percentage})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Classes */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800">Top Performing Classes</h3>
            <span className="text-xs font-bold text-indigo-600 cursor-pointer">View All</span>
          </div>
          <div className="space-y-4">
            <div className="flex text-xs font-bold text-slate-400 mb-2">
              <span className="w-8"></span>
              <span className="flex-1">Class</span>
              <span className="w-12 text-right">Pass %</span>
            </div>
            {mockData.topPerformingClasses.map((cls, idx) => (
              <div key={idx} className="flex items-center text-sm">
                <span className="w-8 font-bold text-slate-800">{idx + 1}</span>
                <div className="flex-1">
                  <span className="font-bold text-slate-700 mb-1 block text-xs">{cls.name}</span>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${cls.passPercentage}%`, backgroundColor: cls.color }}></div>
                  </div>
                </div>
                <span className="w-12 text-right font-bold text-slate-700 text-xs">{cls.passPercentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Summary */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">System Summary</h3>
          <div className="space-y-4 mt-6">
            {mockData.systemSummary.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-xs font-bold text-slate-600">{item.label}</span>
                </div>
                <span className="text-sm font-black text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Data Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Registrations Table */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800">Recent Registrations</h3>
            <span className="text-xs font-bold text-indigo-600 cursor-pointer">View All</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <th className="pb-2">Name</th>
                <th className="pb-2">Role</th>
                <th className="pb-2 text-right">Registered On</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {mockData.recentRegistrations.map((user, idx) => (
                <tr key={idx} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 flex items-center gap-2 font-bold text-slate-700">
                    <div className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center text-white ${user.color}`}>
                      {user.initials}
                    </div>
                    {user.name}
                  </td>
                  <td className="py-3 text-slate-600 font-medium">{user.role}</td>
                  <td className="py-3 text-right text-slate-500">{user.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Test Activity Table */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800">Recent Test Activity</h3>
            <span className="text-xs font-bold text-indigo-600 cursor-pointer">View All</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                <th className="pb-2">Test Name</th>
                <th className="pb-2">Class</th>
                <th className="pb-2">Date</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {mockData.recentTests.map((test, idx) => (
                <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-bold text-slate-700">{test.test}</td>
                  <td className="py-3 text-slate-600">{test.class}</td>
                  <td className="py-3 text-slate-500">{test.date}</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-bold">
                      {test.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subscriptions Overview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800">Subscription Overview</h3>
            <span className="text-xs font-bold text-indigo-600 cursor-pointer">View All</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-32 w-full relative mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.subscriptionsOverview}
                    cx="50%" cy="50%"
                    innerRadius={35} outerRadius={55}
                    paddingAngle={2} dataKey="value"
                  >
                    {mockData.subscriptionsOverview.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-slate-800">957</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Total</span>
              </div>
            </div>
            <div className="w-full space-y-2">
              {mockData.subscriptionsOverview.map((sub, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color }}></div>
                    <span className="font-bold text-slate-700">{sub.name}</span>
                  </div>
                  <span className="font-medium text-slate-500">{sub.value} ({sub.percentage})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {['Add New Teacher', 'Add New Student', 'Create New Test', 'View Reports', 'Manage Subscriptions'].map((action, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-bold text-indigo-700 cursor-pointer hover:bg-indigo-50 p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-indigo-500" />
                    {action}
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800">Alerts & Notifications</h3>
              <span className="text-xs font-bold text-indigo-600 cursor-pointer">View All</span>
            </div>
            <div className="space-y-4">
              {mockData.alerts.map((alert, idx) => (
                <div key={idx} className="flex items-start gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="mt-0.5">{alert.icon}</div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-700 leading-tight">{alert.text}</p>
                    <p className="text-[9px] text-slate-400 font-medium mt-1">{alert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
