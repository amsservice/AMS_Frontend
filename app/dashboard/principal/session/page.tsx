'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Plus,
    X,
    Trash2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
    useSessions,
    useCreateSession,
    useUpdateSession
} from '@/app/querry/useSessions';

export default function SessionsPage() {
    const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
    const [formData, setFormData] = useState({
        sessionName: '',
        startDate: '',
        endDate: ''
    });

    const { data: sessions = [], isLoading } = useSessions();
    const { mutate: createSession } = useCreateSession();
    const { mutate: updateSession } = useUpdateSession('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        createSession({
            name: formData.sessionName,
            startDate: formData.startDate,
            endDate: formData.endDate
        });

        setFormData({ sessionName: '', startDate: '', endDate: '' });
        setIsAddSessionOpen(false);
    };

    const handleCancel = () => {
        setFormData({ sessionName: '', startDate: '', endDate: '' });
        setIsAddSessionOpen(false);
    };

    const handleSetActive = (id: string) => {
        updateSession({
            isActive: true
        });
    };

    const handleDelete = (id: string) => {
        console.log('Delete:', id);
    };
    const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Modern Header with Gradient */}
            <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-xl">
                <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                                Sessions Management
                            </h1>
                            <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
                                View and manage your school's academic sessions
                            </p>
                        </div>
                        <button
                            onClick={() => setIsAddSessionOpen(!isAddSessionOpen)}
                            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
                        >
                            {isAddSessionOpen ? (
                                <>
                                    <X className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                    <span>Cancel</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                    <span>Add Session</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6 sm:space-y-8">
                    {/* Add Session Form */}
                    <AnimatePresence>
                        {isAddSessionOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
                                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                        <div className="p-2 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl shadow-lg">
                                            <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                                                Create New Session
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                Add a new academic session for your school
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Session Name
                                                </Label>
                                                <Input
                                                    name="sessionName"
                                                    value={formData.sessionName}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="e.g., 2024-2025"
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Start Date
                                                </Label>
                                                <Input
                                                    type="date"
                                                    name="startDate"
                                                    value={formData.startDate}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    End Date
                                                </Label>
                                                <Input
                                                    type="date"
                                                    name="endDate"
                                                    value={formData.endDate}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                            <button
                                                onClick={handleSubmit}
                                                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg"
                                            >
                                                Create Session
                                            </button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleCancel}
                                                className="rounded-xl"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Sessions List */}
                    <div className="space-y-4 sm:space-y-6">
                        {isLoading ? (
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
                                <p className="text-gray-600 dark:text-gray-400">Loading sessions...</p>
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
                                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600 opacity-50" />
                                <p className="text-gray-600 dark:text-gray-400">No sessions found</p>
                            </div>
                        ) : (
                            sessions.map((session: any, i: number) => (
                                <motion.div
                                    key={`${session.id}-${i}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 p-4 sm:p-6 ${
                                        session.isActive
                                            ? 'border-teal-500/50 dark:border-teal-400/50 border-2 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 dark:from-teal-900/20 dark:to-cyan-900/20'
                                            : 'border-gray-200/50 dark:border-gray-700/50'
                                    }`}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                                                session.isActive
                                                    ? 'bg-gradient-to-br from-teal-500 to-cyan-600'
                                                    : 'bg-gradient-to-br from-orange-500 to-amber-600'
                                            }`}>
                                                <Calendar className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h3 className="text-base lg:text-xl font-bold text-gray-900 dark:text-white">
                                                        {session.name}
                                                    </h3>
                                                    {session.isActive && (
                                                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                            Active
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                    <span className="font-medium">{formatDate(session.startDate)}</span>
                                                    <span>–</span>
                                                    <span className="font-medium">{formatDate(session.endDate)}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            {!session.isActive && (
                                                <button
                                                    onClick={() => handleSetActive(session.id)}
                                                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm"
                                                >
                                                    Set Active
                                                </button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                                                onClick={() => handleDelete(session.id)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}