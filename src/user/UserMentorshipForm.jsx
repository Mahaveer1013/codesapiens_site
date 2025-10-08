import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // Adjust path to your Supabase client
import { Loader2, X } from "lucide-react";

const UserMentorshipForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    reasonForMentorship: "",
    skillsToDevelop: "",
    domain: "",
    topicsInterested: "",
    expectations: "",
    previousProjects: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  // Check authentication status and fetch existing mentorship data
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        setAuthChecking(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error("[Frontend] : Auth error:", authError);
          setIsAuthenticated(false);
          setError("Authentication failed. Please log in.");
          return;
        }
        if (!user) {
          setIsAuthenticated(false);
          setError("Please log in to submit the mentorship form.");
          return;
        }

        setIsAuthenticated(true);
        setFormData((prev) => ({ ...prev, email: user.email || "" }));

        // Fetch existing mentorship request data
        const { data, error: fetchError } = await supabase
          .from("users")
          .select("mentorship_request")
          .eq("uid", user.id)
          .single();

        if (fetchError) {
          console.error("[Frontend] : Error fetching mentorship data:", fetchError);
          setError("Failed to fetch existing data. Please try again.");
          return;
        }

        if (data && data.mentorship_request) {
          setHasExistingData(true);
        } else {
          setHasExistingData(false);
        }
      } catch (err) {
        console.error("[Frontend] : Error checking auth or fetching data:", err);
        setError("Failed to verify authentication or fetch data. Please try again.");
      } finally {
        setAuthChecking(false);
      }
    };
    checkAuthAndFetchData();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("User not authenticated. Please log in.");
      }
      if (!user.email) {
        throw new Error("User email not available. Please ensure your account has an email.");
      }

      const mentorshipRequest = {
        reasonForMentorship: formData.reasonForMentorship.trim(),
        skillsToDevelop: formData.skillsToDevelop.split(",").map((s) => s.trim()).filter(Boolean),
        domain: formData.domain.trim(),
        topicsInterested: formData.topicsInterested.split(",").map((t) => t.trim()).filter(Boolean),
        expectations: formData.expectations.trim(),
        previousProjects: formData.previousProjects.trim(),
      };

      console.log("[Frontend] : Submitting mentorship request for user:", user.id, "Email:", user.email, "Data:", mentorshipRequest);

      const { data, error } = await supabase
        .from("users")
        .upsert(
          {
            uid: user.id,
            email: user.email, // Include email to satisfy NOT NULL constraint
            mentorship_request: mentorshipRequest,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "uid" }
        )
        .select("*")
        .single();

      if (error) {
        console.error("[Frontend] : Error saving mentorship request:", error);
        throw new Error(
          error.code === "23502"
            ? `Missing required field: ${error.message.includes("email") ? "email" : "unknown"}`
            : error.code === "42501"
            ? "Permission denied. Check RLS policies for the 'users' table."
            : error.code === "42P01"
            ? "Table 'users' does not exist or 'mentorship_request' column is missing."
            : error.message || "Failed to save mentorship request."
        );
      }

      console.log("[Frontend] : Mentorship request saved:", data);
      setSuccess("Mentorship request submitted successfully!");
      setHasExistingData(true); // Update state to show message and hide form
      setFormData({
        email: user.email || "",
        reasonForMentorship: "",
        skillsToDevelop: "",
        domain: "",
        topicsInterested: "",
        expectations: "",
        previousProjects: "",
      });
    } catch (err) {
      console.error("[Frontend] : Submission error:", err);
      setError(err.message || "Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion of mentorship request data
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("User not authenticated. Please log in.");
      }

      console.log("[Frontend] : Deleting mentorship request for user:", user.id);

      const { data, error } = await supabase
        .from("users")
        .update({ mentorship_request: null, updated_at: new Date().toISOString() })
        .eq("uid", user.id)
        .select("*")
        .single();

      if (error) {
        console.error("[Frontend] : Error deleting mentorship request:", error);
        throw new Error(
          error.code === "42501"
            ? "Permission denied. Check RLS policies for the 'users' table."
            : error.code === "42P01"
            ? "Table 'users' does not exist or 'mentorship_request' column is missing."
            : error.message || "Failed to delete mentorship request."
        );
      }

      console.log("[Frontend] : Mentorship request deleted:", data);
      setSuccess("Mentorship request deleted successfully!");
      setHasExistingData(false); // Show form again after deletion
    } catch (err) {
      console.error("[Frontend] : Deletion error:", err);
      setError(err.message || "Failed to delete data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">{error || "Please log in to submit the mentorship form."}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (hasExistingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg p-4 bg-white rounded-xl shadow-md relative">
          {/* Loading Bar */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />
          )}
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          {success && <p className="text-sm text-green-500 mb-4">{success}</p>}
          <p className="text-sm text-blue-500 mb-4">
            You have already submitted a mentorship request.
          </p>
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white transition ${
              loading ? "bg-red-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Deleting...
              </div>
            ) : (
              "Delete All Data"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Fixed Image */}
      <div className="fixed top-0 left-0 w-full md:w-1/2 h-screen">
        <img
          src="https://res.cloudinary.com/dqudvximt/image/upload/v1759813806/sea-7456253_1280_vbb9f8.jpg"
          alt="Mentorship"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Scrollable Form */}
      <div className="w-full md:ml-[50%] md:w-1/2 flex justify-center items-start bg-gray-50 overflow-y-auto min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-lg flex-col gap-4 bg-white p-4 md:p-8 rounded-xl shadow-md relative my-4 md:my-8"
        >
          {/* Loading Bar */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />
          )}

          <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
            Join Our Mentorship
          </h2>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {success && <p className="text-sm text-green-500 text-center">{success}</p>}

          {/* Email Field */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@example.com"
              required
              disabled
              className="border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Reason for Mentorship */}
          <div className="flex flex-col">
            <label htmlFor="reasonForMentorship" className="mb-1 text-sm font-medium text-gray-700">
              Why do you need a mentor?
            </label>
            <textarea
              id="reasonForMentorship"
              name="reasonForMentorship"
              value={formData.reasonForMentorship}
              onChange={handleInputChange}
              placeholder="E.g., I need guidance on career growth or technical skills..."
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              rows="3"
            />
          </div>

          {/* Specific Skills or Goals */}
          <div className="flex flex-col">
            <label htmlFor="skillsToDevelop" className="mb-1 text-sm font-medium text-gray-700">
              Specific skills or goals to develop
            </label>
            <textarea
              id="skillsToDevelop"
              name="skillsToDevelop"
              value={formData.skillsToDevelop}
              onChange={handleInputChange}
              placeholder="E.g., React, Node.js, Cloud Computing (list them separated by commas)"
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              rows="2"
            />
          </div>

          {/* Domain */}
          <div className="flex flex-col">
            <label htmlFor="domain" className="mb-1 text-sm font-medium text-gray-700">
              Your domain
            </label>
            <input
              type="text"
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleInputChange}
              placeholder="E.g., Web Development, Data Science, AI"
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Topics Interested In */}
          <div className="flex flex-col">
            <label htmlFor="topicsInterested" className="mb-1 text-sm font-medium text-gray-700">
              Topics you are interested in
            </label>
            <textarea
              id="topicsInterested"
              name="topicsInterested"
              value={formData.topicsInterested}
              onChange={handleInputChange}
              placeholder="E.g., Frontend frameworks, Backend APIs, DevOps..."
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              rows="2"
            />
          </div>

          {/* Expectations from Mentorship */}
          <div className="flex flex-col">
            <label htmlFor="expectations" className="mb-1 text-sm font-medium text-gray-700">
              What do you expect from this mentorship?
            </label>
            <textarea
              id="expectations"
              name="expectations"
              value={formData.expectations}
              onChange={handleInputChange}
              placeholder="E.g., Weekly sessions, project feedback, career advice..."
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              rows="3"
            />
          </div>

          {/* Previous Projects */}
          <div className="flex flex-col">
            <label htmlFor="previousProjects" className="mb-1 text-sm font-medium text-gray-700">
              Previous projects you have worked on
            </label>
            <textarea
              id="previousProjects"
              name="previousProjects"
              value={formData.previousProjects}
              onChange={handleInputChange}
              placeholder="E.g., Built a personal portfolio website, contributed to open-source..."
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              rows="3"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserMentorshipForm;