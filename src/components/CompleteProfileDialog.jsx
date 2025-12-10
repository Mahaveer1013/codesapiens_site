
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Loader2, Building, GraduationCap, Calendar, ArrowRight, X } from 'lucide-react';

const CompleteProfileDialog = ({ isOpen, onClose, userId, onComplete, initialData }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        college: '',
        department: '',
        year: ''
    });
    const [error, setError] = useState(null);

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                college: initialData.college || '',
                department: initialData.department || '',
                year: initialData.year || ''
            });
        }
    }, [initialData]);

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + 5 - i);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.college || !formData.department || !formData.year) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    college: formData.college,
                    department: formData.department,
                    year: parseInt(formData.year)
                })
                .eq('uid', userId);

            if (updateError) throw updateError;

            if (onComplete) onComplete(formData);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2B2929]/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#F7F5F2] w-full max-w-lg overflow-hidden relative shadow-2xl border-4 border-[#2B2929]"
            >
                {/* Decorative Header Bar */}
                <div className="h-4 w-full bg-[#00C6F7] border-b-4 border-[#2B2929]" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-[#2B2929]/10 rounded-full transition-colors text-[#2B2929]"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h2 className="text-4xl font-black tracking-tighter text-[#2B2929] mb-2 uppercase">
                            One Last Step
                        </h2>
                        <p className="text-[#2B2929]/70 font-medium text-lg">
                            Complete your profile to unlock the full experience.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-[#FF5018]/10 border-2 border-[#FF5018] text-[#FF5018] p-4 font-bold text-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#FF5018] rounded-full" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#2B2929] uppercase tracking-wider flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                College Name
                            </label>
                            <input
                                type="text"
                                value={formData.college}
                                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                className="w-full p-4 bg-white border-2 border-[#2B2929] text-[#2B2929] font-medium focus:ring-4 focus:ring-[#00C6F7]/20 focus:border-[#00C6F7] outline-none transition-all placeholder:text-gray-400"
                                placeholder="e.g. Sri Guru Institute of Technology"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2B2929] uppercase tracking-wider flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    Department
                                </label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full p-4 bg-white border-2 border-[#2B2929] text-[#2B2929] font-medium focus:ring-4 focus:ring-[#00C6F7]/20 focus:border-[#00C6F7] outline-none transition-all placeholder:text-gray-400"
                                    placeholder="e.g. CSE"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2B2929] uppercase tracking-wider flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Passout Year
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full p-4 bg-white border-2 border-[#2B2929] text-[#2B2929] font-medium focus:ring-4 focus:ring-[#00C6F7]/20 focus:border-[#00C6F7] outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Year</option>
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#2B2929]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2B2929] text-white py-4 font-black uppercase tracking-widest hover:bg-[#00C6F7] hover:text-[#2B2929] transition-colors flex items-center justify-center gap-3 group mt-8 border-2 border-transparent hover:border-[#2B2929]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    SAVING...
                                </>
                            ) : (
                                <>
                                    GET STARTED
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default CompleteProfileDialog;
