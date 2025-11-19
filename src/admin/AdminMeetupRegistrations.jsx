import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import {
    ArrowLeft,
    Search,
    Download,
    Mail,
    CheckCircle,
    XCircle,
    User,
    Calendar,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Filter,
    X,
    Phone,
    MapPin,
    Github,
    Linkedin,
    Globe,
    Award,
    BookOpen,
    Briefcase
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AdminMeetupRegistrations = () => {
    const { meetupId } = useParams();
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [meetupDetails, setMeetupDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchMeetupDetails();
        fetchRegistrations();
    }, [meetupId, page, searchTerm]);

    const fetchMeetupDetails = async () => {
        try {
            const { data, error } = await supabase
                .from("meetup")
                .select("title, start_date_time")
                .eq("id", meetupId)
                .single();

            if (error) throw error;
            setMeetupDetails(data);
        } catch (err) {
            console.error("Error fetching meetup details:", err);
            toast.error("Failed to load meetup details");
        }
    };

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("registrations")
                .select(`
          *,
          users:user_id (
            uid,
            display_name,
            email,
            phone_number,
            avatar,
            college,
            role,
            bio,
            github_url,
            linkedin_url,
            portfolio_url,
            skills,
            department,
            major,
            year
          )
        `, { count: "exact" })
                .eq("meetup_id", meetupId)
                .order("created_at", { ascending: false });

            if (searchTerm) {
                query = query.or(`user_name.ilike.%${searchTerm}%,user_email.ilike.%${searchTerm}%`);
            }

            const from = (page - 1) * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            const { data, count, error } = await query.range(from, to);

            if (error) throw error;

            setRegistrations(data);
            setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
        } catch (err) {
            console.error("Error fetching registrations:", err);
            toast.error("Failed to load registrations");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const toggleCheckIn = async (registrationId, currentStatus, e) => {
        e.stopPropagation(); // Prevent row click
        try {
            const { error } = await supabase
                .from("registrations")
                .update({
                    is_checked_in: !currentStatus,
                    checked_in_at: !currentStatus ? new Date().toISOString() : null
                })
                .eq("id", registrationId);

            if (error) throw error;

            setRegistrations(prev => prev.map(reg =>
                reg.id === registrationId
                    ? { ...reg, is_checked_in: !currentStatus, checked_in_at: !currentStatus ? new Date().toISOString() : null }
                    : reg
            ));

            toast.success(currentStatus ? "Check-in cancelled" : "User checked in");
        } catch (err) {
            toast.error("Failed to update check-in status");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 pb-12">
            <Toaster position="top-center" />

            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/admin/meetups")}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {meetupDetails?.title || "Loading..."}
                                </h1>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {meetupDetails?.start_date_time && new Date(meetupDetails.start_date_time).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search attendees..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="pl-9 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 rounded-xl text-sm w-64 transition-all"
                                />
                            </div>
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl border border-gray-200 bg-white">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="mt-4 sm:hidden relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search attendees..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-9 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 rounded-xl text-sm transition-all"
                        />
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* Table Header */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                    <th className="px-6 py-4">Attendee</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Registered</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
                                                <p className="text-gray-500 text-sm">Loading registrations...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : registrations.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                    <User className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="text-gray-900 font-medium">No registrations found</p>
                                                <p className="text-gray-500 text-sm">Try adjusting your search or share the event link.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    registrations.map((reg) => (
                                        <tr
                                            key={reg.id}
                                            className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                            onClick={() => setSelectedUser(reg.users)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 overflow-hidden">
                                                        {reg.users?.avatar ? (
                                                            <img src={reg.users.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                                        ) : (
                                                            (reg.user_name || "U").charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{reg.user_name}</p>
                                                        <p className="text-xs text-gray-500">{reg.users?.college || "Student"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail className="w-3 h-3" />
                                                        {reg.user_email}
                                                    </div>
                                                    {reg.users?.phone_number && (
                                                        <span className="text-xs text-gray-400 pl-5">{reg.users.phone_number}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {reg.is_checked_in ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Checked In
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(reg.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={(e) => toggleCheckIn(reg.id, reg.is_checked_in, e)}
                                                    className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${reg.is_checked_in
                                                            ? "text-red-600 hover:bg-red-50"
                                                            : "text-indigo-600 hover:bg-indigo-50"
                                                        }`}
                                                >
                                                    {reg.is_checked_in ? "Undo Check-in" : "Check In"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && registrations.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                            <p className="text-sm text-gray-500">
                                Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* User Detail Modal */}
            {selectedUser && (
                <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            )}
        </div>
    );
};

const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors backdrop-blur-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-8 pb-8">
                    {/* Profile Image & Basic Info */}
                    <div className="relative -mt-16 mb-6 flex flex-col sm:flex-row items-end sm:items-end gap-6">
                        <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg bg-white overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.display_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-bold">
                                    {(user.display_name || user.email || "U").charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 pb-2 text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-gray-900">{user.display_name || "Unknown User"}</h2>
                            <p className="text-gray-500">{user.role || "Student"}</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Contact Info</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm break-all">{user.email}</span>
                                </div>
                                {user.phone_number && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">{user.phone_number}</span>
                                    </div>
                                )}
                                {user.college && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">{user.college}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Academic & Professional */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Academic & Social</h3>
                            <div className="space-y-3">
                                {(user.department || user.major) && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{user.major || "Major N/A"}</span>
                                            <span className="text-xs text-gray-400">{user.department} {user.year ? `• Year ${user.year}` : ""}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 mt-2">
                                    {user.github_url && (
                                        <a href={user.github_url} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
                                            <Github className="w-5 h-5" />
                                        </a>
                                    )}
                                    {user.linkedin_url && (
                                        <a href={user.linkedin_url} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors">
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                    )}
                                    {user.portfolio_url && (
                                        <a href={user.portfolio_url} target="_blank" rel="noreferrer" className="p-2 bg-pink-50 hover:bg-pink-100 rounded-lg text-pink-700 transition-colors">
                                            <Globe className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        {user.bio && (
                            <div className="md:col-span-2 space-y-2">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">About</h3>
                                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {user.bio}
                                </p>
                            </div>
                        )}

                        {/* Skills */}
                        {user.skills && user.skills.length > 0 && (
                            <div className="md:col-span-2 space-y-2">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMeetupRegistrations;
