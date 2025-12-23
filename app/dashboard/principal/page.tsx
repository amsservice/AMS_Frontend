"use client"
import React, { useState } from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  School,
  Calendar,
  BookOpen,
  Users,
  LogOut,
  Book,
  UserPlus,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

// Note: CSS Variables are now in your globals.css file

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
    const { logout } = useAuth();
  const router = useRouter();

  const stats = [
    {
      icon: Users,
      value: '1,234',
      label: 'Total Students',
      change: '+12%',
      bgColor: 'bg-teal-500',
      changeColor: 'text-green-600'
    },
    {
      icon: Book,
      value: '24',
      label: 'Active Classes',
      change: '+3',
      bgColor: 'bg-[#1e40af]',
      changeColor: 'text-green-600'
    },
    {
      icon: UserPlus,
      value: '48',
      label: 'Teachers',
      change: '+5',
      bgColor: 'bg-green-500',
      changeColor: 'text-green-600'
    },
    {
      icon: TrendingUp,
      value: '94.2%',
      label: 'Avg. Attendance',
      change: '+2.1%',
      bgColor: 'bg-orange-500',
      changeColor: 'text-green-600'
    }
  ];

  const quickActions = [
    {
      icon: School,
      title: 'Update School Profile',
      description: 'Edit school information',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600'
    },
    {
      icon: Calendar,
      title: 'Manage Sessions',
      description: 'Create academic sessions',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600'
    },
    {
      icon: BookOpen,
      title: 'Manage Classes',
      description: 'Add or edit classes',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600'
    },
    {
      icon: UserPlus,
      title: 'Add Teachers',
      description: 'Invite new teachers',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600'
    }
  ];

  const setupChecklist = [
    { text: 'School profile completed', completed: true },
    { text: 'Academic session created', completed: true },
    { text: 'Classes configured', completed: false },
    { text: 'Teachers invited', completed: false }
  ];

  const menuItems = [
    { icon: LayoutDashboard, text: 'Dashboard', active: true },
    { icon: School, text: 'School Profile', active: false },
    { icon: Calendar, text: 'Sessions', active: false },
    { icon: BookOpen, text: 'Classes', active: false },
    { icon: Users, text: 'Teachers', active: false }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  
  const handleLogout = () => {
    logout();                 // clear token + user
    router.replace("/auth/login"); // redirect
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-72 bg-[#1e3a8a] text-white flex flex-col"
        >
          {/* Logo */}
          <div className="p-6 border-b border-blue-700">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8" />
              <span className="text-2xl font-bold">AttendEase</span>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-blue-700">
            <div className="font-semibold text-lg">Demo Principal</div>
            <div className="text-blue-200 text-sm">Principal</div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            {menuItems.map((menuItem, index) => (
              <motion.button
                key={menuItem.text}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveMenu(menuItem.text)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${menuItem.text === activeMenu
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-blue-700'
                  }`}
              >
                <menuItem.icon className="w-5 h-5" />
                <span>{menuItem.text}</span>
                {menuItem.text === activeMenu && (
                  <ArrowRight className="w-4 h-4 ml-auto" />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-blue-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-blue-700 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white border-b px-8 py-6 flex justify-between items-center"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                Welcome back, Demo! 👋
              </h1>
              <p className="text-gray-600 mt-1">Here's what's happening at your school today.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-semibold text-gray-900">Demo Principal</div>
                <div className="text-sm text-gray-600">Principal</div>
              </div>
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                D
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={item}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`${stat.changeColor} text-sm font-semibold bg-green-50 px-2 py-1 rounded`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions & Setup Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <motion.div variants={item} className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.title}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-teal-500 hover:shadow-md transition-all text-left"
                    >
                      <div className={`${action.iconBg} p-3 rounded-lg`}>
                        <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{action.title}</div>
                        <div className="text-sm text-gray-600">{action.description}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Setup Checklist */}
              <motion.div variants={item} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Setup Checklist</h2>
                </div>
                <div className="space-y-4 mb-6">
                  {setupChecklist.map((checkItem, index) => (
                    <motion.div
                      key={checkItem.text}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      {checkItem.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                      <span className={checkItem.completed ? 'text-gray-900' : 'text-gray-600'}>
                        {checkItem.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                >
                  Complete Setup
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;