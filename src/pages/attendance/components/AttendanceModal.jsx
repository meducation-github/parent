import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  BarChart2,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
} from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../../config/env";

// Constants
const STAFF_ID = localStorage.getItem("staff_id");
const SESSION_ID = JSON.parse(localStorage.getItem("session"))?.id;

const AttendanceModal = ({ person, isOpen, onClose, type }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && person) {
      fetchAttendanceData();
    }
  }, [isOpen, person, currentDate, viewMode]);

  const fetchAttendanceData = async () => {
    setLoading(true);

    supabase
      .from("staff_attendances")
      .select("*")
      .eq("staff_id", STAFF_ID)
      .eq("session_id", SESSION_ID)
      .gte("attendance_date", format(startOfMonth(currentDate), "yyyy-MM-dd"))
      .lte("attendance_date", format(endOfMonth(currentDate), "yyyy-MM-dd"))
      .then(({ data, error }) => {
        if (error) throw error;
        setAttendanceData(data || []);
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getAttendanceStatus = (date) => {
    const record = attendanceData.find((record) =>
      isSameDay(new Date(record.attendance_date), date)
    );
    return record?.status || null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-500 text-white";
      case "absent":
        return "bg-red-500 text-white";
      case "leave":
        return "bg-yellow-500 text-white";
      case "half_day":
        return "bg-blue-500 text-white";
      case "wfh":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4" />;
      case "absent":
        return <XCircle className="h-4 w-4" />;
      case "leave":
        return <AlertCircle className="h-4 w-4" />;
      case "half_day":
        return <Clock className="h-4 w-4" />;
      case "wfh":
        return <Calendar className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusLetter = (status) => {
    switch (status) {
      case "present":
        return "P";
      case "absent":
        return "A";
      case "leave":
        return "L";
      case "half_day":
        return "HD";
      case "wfh":
        return "WFH";
      default:
        return "";
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center py-3 text-sm font-semibold text-gray-700"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const status = getAttendanceStatus(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toString()}
                className={`relative min-h-[80px] border-r border-b border-gray-100 p-2 transition-all duration-200 hover:bg-gray-50 ${
                  !isCurrentMonth ? "bg-gray-50" : "bg-white"
                } ${isCurrentDay ? "ring-2 ring-blue-500 ring-inset" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${
                      !isCurrentMonth ? "text-gray-400" : "text-gray-900"
                    } ${isCurrentDay ? "text-blue-600" : ""}`}
                  >
                    {format(day, "d")}
                  </span>
                  {status && (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor(
                        status
                      )}`}
                    >
                      {getStatusIcon(status)}
                    </div>
                  )}
                </div>

                {status && (
                  <div className="mt-1">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        status
                      )}`}
                    >
                      {getStatusLetter(status)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Week Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center py-3 text-sm font-semibold text-gray-700"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const status = getAttendanceStatus(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toString()}
                className={`relative min-h-[120px] border-r border-b border-gray-100 p-3 transition-all duration-200 hover:bg-gray-50 ${
                  !isCurrentMonth ? "bg-gray-50" : "bg-white"
                } ${isCurrentDay ? "ring-2 ring-blue-500 ring-inset" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-medium ${
                      !isCurrentMonth ? "text-gray-400" : "text-gray-900"
                    } ${isCurrentDay ? "text-blue-600" : ""}`}
                  >
                    {format(day, "d")}
                  </span>
                  {status && (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor(
                        status
                      )}`}
                    >
                      {getStatusIcon(status)}
                    </div>
                  )}
                </div>

                {status && (
                  <div className="space-y-1">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        status
                      )}`}
                    >
                      {getStatusLetter(status)}
                    </span>
                    <p className="text-xs text-gray-600 capitalize">
                      {status.replace("_", " ")}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const yearStart = startOfYear(currentDate);
    const yearEnd = endOfYear(currentDate);
    const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

    // Prepare data for the chart
    const chartData = months.map((month) => {
      const monthAttendance = attendanceData.filter(
        (record) =>
          new Date(record.attendance_date).getMonth() === month.getMonth() &&
          new Date(record.attendance_date).getFullYear() === month.getFullYear()
      );

      const present = monthAttendance.filter(
        (a) => a.status === "present"
      ).length;
      const absent = monthAttendance.filter(
        (a) => a.status === "absent"
      ).length;
      const leave = monthAttendance.filter((a) => a.status === "leave").length;
      const halfDay = monthAttendance.filter(
        (a) => a.status === "half_day"
      ).length;
      const wfh = monthAttendance.filter((a) => a.status === "wfh").length;

      return {
        month: format(month, "MMM"),
        present,
        absent,
        leave,
        halfDay,
        wfh,
      };
    });

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar
                dataKey="present"
                stackId="a"
                fill="#10B981"
                name="Present"
              />
              <Bar dataKey="absent" stackId="a" fill="#EF4444" name="Absent" />
              <Bar dataKey="leave" stackId="a" fill="#F59E0B" name="Leave" />
              <Bar
                dataKey="halfDay"
                stackId="a"
                fill="#3B82F6"
                name="Half Day"
              />
              {type === "staff" && (
                <Bar dataKey="wfh" stackId="a" fill="#8B5CF6" name="WFH" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Attendance Calendar
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {type === "student" ? "Student" : "Staff"} Attendance Records
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* View Mode Tabs */}
          <div className="mb-6">
            <div className="bg-gray-100 rounded-lg p-1">
              <div className="flex">
                <button
                  onClick={() => setViewMode("month")}
                  className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    viewMode === "month"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Month View
                </button>
                <button
                  onClick={() => setViewMode("week")}
                  className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    viewMode === "week"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Week View
                </button>
                <button
                  onClick={() => setViewMode("year")}
                  className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    viewMode === "year"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Year View
                </button>
              </div>
            </div>
          </div>

          {/* Navigation and Title */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                if (viewMode === "month") {
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                  );
                } else if (viewMode === "week") {
                  setCurrentDate(subWeeks(currentDate, 1));
                } else {
                  setCurrentDate(
                    new Date(
                      currentDate.setFullYear(currentDate.getFullYear() - 1)
                    )
                  );
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>

            <h3 className="text-lg font-semibold text-gray-900">
              {viewMode === "month"
                ? format(currentDate, "MMMM yyyy")
                : viewMode === "week"
                ? `${format(startOfWeek(currentDate), "MMM d")} - ${format(
                    endOfWeek(currentDate),
                    "MMM d, yyyy"
                  )}`
                : format(currentDate, "yyyy")}
            </h3>

            <button
              onClick={() => {
                if (viewMode === "month") {
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() + 1))
                  );
                } else if (viewMode === "week") {
                  setCurrentDate(addWeeks(currentDate, 1));
                } else {
                  setCurrentDate(
                    new Date(
                      currentDate.setFullYear(currentDate.getFullYear() + 1)
                    )
                  );
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Calendar Content */}
          {!loading && (
            <div>
              {viewMode === "month" && renderCalendar()}
              {viewMode === "week" && renderWeekView()}
              {viewMode === "year" && renderYearView()}
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Legend</h4>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Present</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Absent</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Leave</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Half Day</span>
              </div>
              {type === "staff" && (
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">WFH</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;
