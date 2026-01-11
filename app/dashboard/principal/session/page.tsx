


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



/*  React Query hooks */
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

    /* =====================
       API CALLS
       ===================== */
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
        // Optional: implement DELETE later
        console.log('Delete:', id);
    };

    return (
        <div >


            {/* Main */}
            <main className="flex-1 overflow-auto">


                {/* Content */}
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold dashboard-text mb-2">Sections</h1>
                        <p className="dashboard-text-muted">View and manage your school's Sections</p>
                    </div>
                    <div className="max-w-[1400px] mx-auto space-y-4 lg:space-y-6">
                        {/* Add Session */}
                        <div className="flex justify-stretch md:justify-end">
                            <button
                                className="w-full md:w-auto accent-orange text-white font-semibold py-2.5 px-6 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                onClick={() => setIsAddSessionOpen(!isAddSessionOpen)}
                            >
                                {isAddSessionOpen ? (
                                    <>
                                        <X className="w-4 h-4" /> Cancel
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" /> Add Session
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Form */}
                        <AnimatePresence>
                            {isAddSessionOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="dashboard-card border rounded-xl p-4 lg:p-6">
                                        <h3 className="text-lg font-semibold dashboard-text mb-4">
                                            Create New Session
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="dashboard-text-muted">Session Name</Label>
                                                    <Input
                                                        name="sessionName"
                                                        value={formData.sessionName}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="dashboard-card border dashboard-card-border dashboard-text"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="dashboard-text-muted">Start Date</Label>
                                                    <Input
                                                        type="date"
                                                        name="startDate"
                                                        value={formData.startDate}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="dashboard-card border dashboard-card-border dashboard-text"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="dashboard-text-muted">End Date</Label>
                                                    <Input
                                                        type="date"
                                                        name="endDate"
                                                        value={formData.endDate}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="dashboard-card border dashboard-card-border dashboard-text"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                                <button
                                                    onClick={handleSubmit}
                                                    className="accent-teal text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
                                                >
                                                    Create Session
                                                </button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleCancel}
                                                    className="w-full sm:w-auto dashboard-card border dashboard-card-border dashboard-text"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Sessions */}
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="dashboard-card border rounded-xl p-8 text-center">
                                    <p className="dashboard-text-muted">Loading sessions...</p>
                                </div>
                            ) : (
                                sessions.map((session: any, i: number) => (
                                    <motion.div
                                        key={`${session.id}-${i}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`dashboard-card border rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow ${session.isActive ? 'border-teal-500 border-2' : ''
                                            }`}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 lg:w-14 lg:h-14 accent-teal rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <Calendar className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <h3 className="text-base lg:text-xl font-bold dashboard-text">
                                                            {session.name}
                                                        </h3>
                                                        {session.isActive && (
                                                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                Active
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs lg:text-sm dashboard-text-muted">
                                                        {session.startDate} – {session.endDate}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                {!session.isActive && (
                                                    <button
                                                        onClick={() => handleSetActive(session.id)}
                                                        className="dashboard-card border dashboard-card-border dashboard-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                    >
                                                        Set Active
                                                    </button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                </div>
            </main>
        </div>
    );
}