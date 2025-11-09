import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../../components/pageHeader";
import StudentAttendance from "./components/StudentAttendance";

function Attendance() {
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    attendanceRate: 0,
    currentStreak: 0,
  });

  // Mock stats - in real app, this would come from API
  useEffect(() => {
    setStats({
      totalDays: 180,
      presentDays: 165,
      absentDays: 8,
      attendanceRate: 91.7,
      currentStreak: 12,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <PageHeader
        title={"Attendance Dashboard"}
        subtitle={"Track and manage your attendance records"}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 px-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalDays}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Days</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.presentDays}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absent Days</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.absentDays}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Attendance Rate
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {stats.attendanceRate}%
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Current Streak
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.currentStreak}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Attendance Calendar
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              View your attendance history and track your progress
            </p>
          </div>

          <div className="p-6">
            <StudentAttendance />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
