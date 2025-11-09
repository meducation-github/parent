import { useState, useEffect, useContext } from "react";
import {
  CreditCard,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
  LogIn,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { supabase } from "../config/env";
import { Link, useNavigate } from "react-router-dom";
import { StudentsContext, ParentContext } from "../context/contexts";

const Home = () => {
  const { studentsState } = useContext(StudentsContext);
  const { parentState } = useContext(ParentContext);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Set loading to false when students and parent are loaded from context
    if (studentsState !== undefined && parentState !== undefined) {
      setLoading(false);
    }
  }, [studentsState, parentState]);

  const handleMagicLogin = async (student) => {
    setLoginLoading((prev) => ({ ...prev, [student.id]: true }));

    try {
      // Get current session and access token
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);

        return;
      }

      if (!session) {
        console.error("No active session found. Please login again.");
        return;
      }

      // Get the access token
      const accessToken = session.access_token;

      if (!accessToken) {
        console.error("No access token found. Please login again.");
        return;
      }

      // Redirect to student portal with access token
      const redirectUrl = `https://student.meducation.pk?token=${encodeURIComponent(
        accessToken
      )}&student_id=${encodeURIComponent(student.id)}`;

      // Open in new tab/window
      window.open(redirectUrl, "_blank");
    } catch (error) {
      console.error("Redirect error:", error);
      console.error("An error occurred. Please try again.");
    } finally {
      setLoginLoading((prev) => ({ ...prev, [student.id]: false }));
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error logging out:", error);
        return;
      }

      // Clear localStorage
      localStorage.removeItem("students");
      localStorage.removeItem("parent");
      localStorage.removeItem("user_id");
      localStorage.removeItem("session");
      localStorage.removeItem("staff_id");
      localStorage.removeItem("student_id");
      localStorage.removeItem("entryCreated");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-2">MEd Parent</h1>
          <p className="text-gray-600">
            Manage your children's education journey
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Parent Information Section */}
      {parentState && (
        <div className="mb-8 bg-white rounded-xl border border-gray-300 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Parent Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Chat</span>
                <Link to="/chat" className="text-sm font-medium">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                </Link>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">
                  {parentState.first_name} {parentState.last_name}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{parentState.email}</span>
              </div>
              {parentState.phone && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Phone:</span>
                  <span className="text-sm">{parentState.phone}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {parentState.occupation && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Occupation:</span>
                  <span className="text-sm">{parentState.occupation}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">Relationship:</span>
                <span className="text-sm">{parentState.relationship}</span>
              </div>
              {parentState.address && (
                <div className="flex items-start space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <span className="text-sm font-medium">Address:</span>
                  <span className="text-sm">{parentState.address}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Account Created:</span>
                <span className="text-sm">
                  {formatDateTime(parentState.created_at)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Last Updated:</span>
                <span className="text-sm">
                  {formatDateTime(parentState.updated_at)}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <GraduationCap className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Students:</span>
                <span className="text-sm">
                  {studentsState?.length || 0} registered
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {studentsState?.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Students Found
          </h3>
          <p className="text-gray-500">
            No students are currently associated with your account.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentsState?.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-xl transition-all duration-300 border border-gray-300 overflow-hidden"
            >
              {/* Header with gradient */}
              <div className="bg-blue-50 text-blue-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className="text-sm">
                        Student ID: {student.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.status === "Active"
                        ? "bg-green-500/20 text-green-700"
                        : "bg-red-500/20 text-red-700"
                    }`}
                  >
                    {student.status}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Student Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Father: {student.father_name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-sm">
                      Age: {getAge(student.date_of_birth)} years
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">
                      Admitted: {formatDate(student.admission_date)}
                    </span>
                  </div>

                  {student.phone && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Phone className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">{student.phone}</span>
                    </div>
                  )}

                  {student.email && (
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Mail className="w-4 h-4 text-red-500" />
                      <span className="text-sm truncate">{student.email}</span>
                    </div>
                  )}

                  {student.address && (
                    <div className="flex items-start space-x-3 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-sm line-clamp-2">
                        {student.address}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleMagicLogin(student)}
                    disabled={loginLoading[student.id]}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      loginLoading[student.id]
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    {loginLoading[student.id] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Redirecting...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Open Student Portal</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>
          Click "Open Student Portal" to redirect to the student portal with
          secure access
        </p>
        <p className="mt-1">
          The portal will open in a new tab at student.meducation.pk
        </p>
      </div>
    </div>
  );
};

export default Home;
