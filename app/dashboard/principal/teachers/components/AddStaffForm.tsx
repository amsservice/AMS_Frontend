"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type StaffRole = "teacher" | "coordinator";

interface FormDataShape {
  name: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  gender: string;
  highestQualification: string;
  experienceYears: string;
  address: string;
  roles: StaffRole[];
}

interface AddStaffFormProps {
  open: boolean;
  formData: FormDataShape;
  setFormData: (v: FormDataShape) => void;
  maxDob: string;
  handleAddTeacher: (e: any) => void; // keep original handler
  onClose: () => void;
}

export default function AddStaffForm({
  open,
  formData,
  setFormData,
  maxDob,
  handleAddTeacher,
  onClose,
}: AddStaffFormProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  Add New Staff
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Create a new staff account
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Staff Role *</Label>
                <select
                  value={formData.roles[0]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roles: [e.target.value as StaffRole],
                    })
                  }
                  required
                  className="h-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-3"
                >
                  <option value="teacher">Teacher</option>
                  <option value="coordinator">Coordinator</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData({ ...formData, phone: v });
                  }}
                  required
                  placeholder="10 digits"
                />
              </div>

              <div className="space-y-2">
                <Label>DOB *</Label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  max={maxDob}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Gender *</Label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  required
                  className="h-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-3"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Highest Qualification</Label>
                <Input
                  value={formData.highestQualification}
                  onChange={(e) =>
                    setFormData({ ...formData, highestQualification: e.target.value })
                  }
                  placeholder="e.g. B.Ed, M.Sc"
                />
              </div>

              <div className="space-y-2">
                <Label>Experience (Years)</Label>
                <Input
                  type="number"
                  min={0}
                  max={60}
                  value={formData.experienceYears}
                  onChange={(e) =>
                    setFormData({ ...formData, experienceYears: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label>Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Address"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleAddTeacher}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg"
              >
                Create Staff Account
              </button>
              <Button variant="outline" onClick={onClose} className="rounded-xl">
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
