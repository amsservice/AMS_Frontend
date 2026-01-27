"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Calendar, MapPin, BookOpen, Edit } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HistoryItem {
  className: string;
  section: string;
  sessionId: any;
  isActive: boolean;
}

interface TeacherFullData {
  name: string;
  email: string;
  phone?: string;
  roles?: ("teacher" | "coordinator")[];
  dob?: string;
  gender?: string;
  highestQualification?: string;
  experienceYears?: number;
  address?: string;
  createdAt: string;
  history?: HistoryItem[];
}

interface ViewStaffModalProps {
  viewingTeacherId: string | null;
  teacherFullData?: { data?: TeacherFullData } | null;
  isLoading: boolean;

  isEditing: boolean;
  editFormData: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    highestQualification: string;
    experienceYears: string;
    address: string;
    roles: ("teacher" | "coordinator")[];
  };
  setEditFormData: (v: any) => void;

  maxDob: string;
  updatePending: boolean;

  onEnableEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onClose: () => void;
}

export default function ViewStaffModal({
  viewingTeacherId,
  teacherFullData,
  isLoading,
  isEditing,
  editFormData,
  setEditFormData,
  maxDob,
  updatePending,
  onEnableEdit,
  onSave,
  onCancelEdit,
  onClose,
}: ViewStaffModalProps) {
  return (
    <AnimatePresence>
      {viewingTeacherId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading staff details...
                </p>
              </div>
            ) : teacherFullData?.data ? (
              <>
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 px-6 py-4 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="bg-white w-16 h-16">
                        <AvatarFallback className="text-blue-600 font-bold text-2xl bg-white">
                          {teacherFullData.data.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {teacherFullData.data.name}
                        </h2>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6">
                  <div className="flex gap-4">
                    <button className="py-4 px-2 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
                      Personal Info
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2"><User className="w-4 h-4" /> Full Name</Label>
                          <Input value={editFormData.name} onChange={(e)=>setEditFormData({...editFormData,name:e.target.value})} />
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email Address</Label>
                          <Input type="email" value={editFormData.email} onChange={(e)=>setEditFormData({...editFormData,email:e.target.value})} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Staff Roles</Label>
                          <div className="flex flex-wrap gap-4">
                            {(["teacher", "coordinator"] as const).map((role) => {
                              const checked = Array.isArray(editFormData.roles) && editFormData.roles.includes(role);
                              const hasActiveClass = Array.isArray(teacherFullData.data?.history) && teacherFullData.data!.history!.some((h) => h.isActive);
                              const disableUncheckTeacher = role === "teacher" && hasActiveClass && checked;

                              return (
                                <label key={role} className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => {
                                      const next = new Set(editFormData.roles || []);
                                      if (e.target.checked) next.add(role);
                                      else {
                                        if (role === "teacher" && disableUncheckTeacher) return;
                                        next.delete(role);
                                      }
                                      setEditFormData({ ...editFormData, roles: Array.from(next) });
                                    }}
                                    className="h-4 w-4"
                                  />
                                  {role === "teacher" ? "Teacher" : "Coordinator"}
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2"><Phone className="w-4 h-4" /> Phone Number</Label>
                          <Input type="tel" maxLength={10} value={editFormData.phone} onChange={(e)=>{
                            const v=e.target.value.replace(/\D/g,'').slice(0,10);
                            setEditFormData({...editFormData,phone:v});
                          }} />
                        </div>

                        <div className="space-y-2">
                          <Label className="flex items-center gap-2"><Calendar className="w-4 h-4" /> DOB</Label>
                          <Input type="date" max={maxDob} value={editFormData.dob} onChange={(e)=>setEditFormData({...editFormData,dob:e.target.value})} />
                        </div>

                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <select className="h-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-3" value={editFormData.gender} onChange={(e)=>setEditFormData({...editFormData,gender:e.target.value})}>
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Highest Qualification</Label>
                          <Input value={editFormData.highestQualification} onChange={(e)=>setEditFormData({...editFormData,highestQualification:e.target.value})} />
                        </div>

                        <div className="space-y-2">
                          <Label>Experience (Years)</Label>
                          <Input type="number" min={0} max={60} value={editFormData.experienceYears} onChange={(e)=>setEditFormData({...editFormData,experienceYears:e.target.value})} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Address</Label>
                          <Input value={editFormData.address} onChange={(e)=>setEditFormData({...editFormData,address:e.target.value})} />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t">
                        <button
                          onClick={onSave}
                          disabled={updatePending}
                          className="px-6 py-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold rounded-xl disabled:opacity-50"
                        >
                          {updatePending ? "Saving..." : "Save Changes"}
                        </button>
                        <Button variant="outline" onClick={onCancelEdit} className="rounded-xl">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Info label="Full Name" value={teacherFullData.data.name} icon={<User className="w-3 h-3"/>} />
                        <Info label="Email Address" value={teacherFullData.data.email} icon={<Mail className="w-3 h-3"/>} />
                        <Info label="Roles" value={Array.isArray(teacherFullData.data.roles) && teacherFullData.data.roles.length ? teacherFullData.data.roles.join(", ") : 'Not provided'} />
                        <Info label="Phone Number" value={teacherFullData.data.phone || 'Not provided'} icon={<Phone className="w-3 h-3"/>} />
                        <Info label="DOB" value={teacherFullData.data.dob ? new Date(teacherFullData.data.dob).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) : 'Not provided'} icon={<Calendar className="w-3 h-3"/>} />
                        <Info label="Gender" value={teacherFullData.data.gender || 'Not provided'} />
                        <Info label="Highest Qualification" value={teacherFullData.data.highestQualification || 'Not provided'} />
                        <Info label="Experience (Years)" value={typeof teacherFullData.data.experienceYears==='number'?teacherFullData.data.experienceYears:'Not provided'} />
                        <Info label="Address" value={teacherFullData.data.address || 'Not provided'} icon={<MapPin className="w-3 h-3"/>} full />
                        <Info label="Date Joined" value={new Date(teacherFullData.data.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})} icon={<Calendar className="w-3 h-3"/>} />
                      </div>

                      {teacherFullData.data.history && teacherFullData.data.history.length>0 && (
                        <div className="pt-6 border-t">
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600"/> Assignment History</h3>
                          <div className="space-y-3">
                            {teacherFullData.data.history.map((hist,idx)=> (
                              <div key={idx} className={`p-4 rounded-xl border ${hist.isActive?'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800':'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}>
                                <div className="flex items-center gap-3">
                                  <BookOpen className={`w-4 h-4 ${hist.isActive?'text-blue-600':'text-gray-500'}`} />
                                  <div>
                                    <p className="font-semibold">{hist.className} - {hist.section}</p>
                                    <p className="text-sm text-gray-500">{typeof hist.sessionId==='object'?hist.sessionId.name:'Session'}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 pt-4 border-t">
                        <button
                          onClick={onEnableEdit}
                          className="px-6 py-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold rounded-xl flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" /> Edit Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-gray-500">Unable to load staff details</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Info({ label, value, icon, full }: { label: string; value: any; icon?: any; full?: boolean }) {
  return (
    <div className={`space-y-1 ${full ? 'md:col-span-2' : ''}`}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
        {icon} {label}
      </p>
      <p className="text-base font-semibold text-gray-900 dark:text-white break-all">{value}</p>
    </div>
  );
}
