import { useState } from "react";
import { Eye, Calendar, BarChart3, TrendingUp } from "lucide-react";
import AttendanceModal from "./AttendanceModal";

const STUDENT_ID = localStorage.getItem("student_id");

function StudentAttendance() {
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedView, setSelectedView] = useState("calendar");

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Attendance Overview
          </h3>
          <p className="text-sm text-gray-600">
            View detailed attendance records and analytics
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowAttendanceModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Calendar
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-gray-50 rounded-lg p-1">
        <div className="flex">
          <button
            onClick={() => setSelectedView("calendar")}
            className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              selectedView === "calendar"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </button>
          <button
            onClick={() => setSelectedView("analytics")}
            className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              selectedView === "analytics"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setSelectedView("trends")}
            className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              selectedView === "trends"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-gray-50 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
        {selectedView === "calendar" && (
          <div className="text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Calendar View
            </h3>
            <p className="text-gray-600 mb-4">
              Click "View Calendar" to see your detailed attendance calendar
            </p>
            <button
              onClick={() => setShowAttendanceModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Open Calendar
            </button>
          </div>
        )}

        {selectedView === "analytics" && (
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Analytics View
            </h3>
            <p className="text-gray-600">
              Detailed attendance analytics and reports coming soon
            </p>
          </div>
        )}

        {selectedView === "trends" && (
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Trends View
            </h3>
            <p className="text-gray-600">
              Attendance trends and patterns analysis coming soon
            </p>
          </div>
        )}
      </div>

      {/* Attendance Modal */}
      <AttendanceModal
        person={{ id: STUDENT_ID }}
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        type="student"
      />
    </div>
  );
}

export default StudentAttendance;
