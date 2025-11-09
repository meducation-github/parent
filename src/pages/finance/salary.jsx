import { useState, useEffect, useContext } from "react";
import {
  Calendar,
  User,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  BarChart4,
  AlertCircle,
  TrendingUp,
  Wallet,
  Receipt,
  CalendarDays,
  Building2,
  GraduationCap,
  PhoneCall,
  AtSign,
  Home,
  CalendarCheck,
} from "lucide-react";
import { supabase } from "../../config/env";
import { InstituteContext, SessionContext } from "../../context/contexts.jsx";

const STAFF_ID = localStorage.getItem("staff_id");
const SESSION_ID = JSON.parse(localStorage.getItem("session"))?.id;

// Main component
export default function Salary() {
  const { instituteState } = useContext(InstituteContext);
  const { sessionState } = useContext(SessionContext);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [salaries, setSalaries] = useState([]);

  // Fetch staff and session data on component mount
  useEffect(() => {
    fetchStaffData();
    fetchSessionData();
    fetchSalaryData();
  }, []);

  // Fetch specific staff data
  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .eq("id", STAFF_ID)
        .single();

      if (error) throw error;

      setSelectedStaff(data);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch session data
  const fetchSessionData = async () => {
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", SESSION_ID)
        .single();

      if (error) throw error;

      setSessionData(data);

      if (data) {
        generateMonthlyData(data.start_date, data.end_date);
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  // Fetch salary data
  const fetchSalaryData = async () => {
    try {
      const { data, error } = await supabase
        .from("salaries")
        .select("*")
        .eq("session_id", SESSION_ID)
        .eq("staff_id", STAFF_ID);

      if (error) throw error;

      setSalaries(data || []);
    } catch (error) {
      console.error("Error fetching salary data:", error);
    }
  };

  // Generate monthly data based on session start and end dates
  const generateMonthlyData = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];

    let current = new Date(start);

    while (current <= end) {
      months.push({
        month: current.toLocaleString("default", { month: "long" }),
        year: current.getFullYear(),
        date: new Date(current),
      });

      current.setMonth(current.getMonth() + 1);
    }

    setMonthlyData(months);
  };

  // Check if a staff has a salary for a specific month
  const isSalaryPaid = (staffId, month, year) => {
    return salaries.some(
      (s) => s.staff_id === staffId && s.month === month && s.year === year
    );
  };

  // Get salary details for a specific month
  const getSalaryDetails = (staffId, month, year) => {
    return salaries.find(
      (s) => s.staff_id === staffId && s.month === month && s.year === year
    );
  };

  // Calculate statistics for a specific staff member
  const calculateStaffStats = (staffMember) => {
    if (!staffMember || !monthlyData.length)
      return { paid: 0, unpaid: 0, total: 0 };

    let paid = 0;
    let unpaid = 0;

    monthlyData.forEach(({ month, year }) => {
      const isPaid = isSalaryPaid(staffMember.id, month, year);
      if (isPaid) {
        const salaryDetail = getSalaryDetails(staffMember.id, month, year);
        paid += salaryDetail ? salaryDetail.amount : 0;
      } else {
        unpaid += staffMember.salary || 0;
      }
    });

    return {
      paid,
      unpaid,
      total: paid + unpaid,
    };
  };

  // Get count of paid/unpaid months for a staff member
  const getMonthsStats = (staffMember) => {
    if (!staffMember || !monthlyData.length) return { paid: 0, unpaid: 0 };

    let paidMonths = 0;
    let unpaidMonths = 0;

    monthlyData.forEach(({ month, year }) => {
      if (isSalaryPaid(staffMember.id, month, year)) {
        paidMonths++;
      } else {
        unpaidMonths++;
      }
    });

    return { paidMonths, unpaidMonths };
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-slate-600 font-medium">
                Loading your salary information...
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Please wait while we fetch your data
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedStaff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Staff Information Not Found
              </h3>
              <p className="text-slate-600">
                We couldn't retrieve your salary information. Please contact
                support.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { paidMonths, unpaidMonths } = getMonthsStats(selectedStaff);
  const stats = calculateStaffStats(selectedStaff);

  return (
    <div className="">
      <div className="container mx-auto px-4 py-8">
        {/* Salary Analytics */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">
              Salary Overview
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                  {paidMonths} paid
                </span>
              </div>
              <p className="text-sm font-medium text-emerald-700 mb-1">
                Total Paid
              </p>
              <p className="text-2xl font-bold text-emerald-900 mb-1">
                {formatCurrency(stats.paid)}
              </p>
              <p className="text-xs text-emerald-600">Successfully processed</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                  {unpaidMonths} pending
                </span>
              </div>
              <p className="text-sm font-medium text-amber-700 mb-1">
                Total Pending
              </p>
              <p className="text-2xl font-bold text-amber-900 mb-1">
                {formatCurrency(stats.unpaid)}
              </p>
              <p className="text-xs text-amber-600">Awaiting processing</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                  Total
                </span>
              </div>
              <p className="text-sm font-medium text-blue-700 mb-1">
                Total Salary Amount
              </p>
              <p className="text-2xl font-bold text-blue-900 mb-1">
                {formatCurrency(stats.total)}
              </p>
              <p className="text-xs text-blue-600">For entire session</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
                  Monthly
                </span>
              </div>
              <p className="text-sm font-medium text-purple-700 mb-1">
                Base Salary
              </p>
              <p className="text-2xl font-bold text-purple-900 mb-1">
                {formatCurrency(selectedStaff.salary || 0)}
              </p>
              <p className="text-xs text-purple-600">Per month</p>
            </div>
          </div>
        </div>

        {/* Monthly Salary Status */}
        <div>
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">
              Monthly Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {monthlyData.length > 0 ? (
              monthlyData.map(({ month, year }) => {
                const isPaid = isSalaryPaid(selectedStaff.id, month, year);
                const salaryDetail = isPaid
                  ? getSalaryDetails(selectedStaff.id, month, year)
                  : null;

                return (
                  <div
                    key={`${month}-${year}`}
                    className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                      isPaid
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                              isPaid ? "bg-green-100" : "bg-slate-100"
                            }`}
                          >
                            {isPaid ? (
                              <CalendarCheck className="h-5 w-5 text-green-600" />
                            ) : (
                              <Calendar className="h-5 w-5 text-slate-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {month}
                            </p>
                            <p className="text-sm text-slate-500">{year}</p>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isPaid
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isPaid ? "Paid" : "Pending"}
                        </div>
                      </div>

                      {isPaid ? (
                        <div className="space-y-3">
                          <div className="bg-white rounded-xl p-3 border border-green-100">
                            <p className="text-xs text-slate-500 mb-1">
                              Amount Received
                            </p>
                            <p className="text-lg font-bold text-green-700">
                              {formatCurrency(salaryDetail.amount)}
                            </p>
                          </div>
                          <div className="text-xs text-slate-500">
                            <span className="font-medium">Paid on:</span>{" "}
                            {new Date(
                              salaryDetail.payment_date
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <p className="text-xs text-slate-500 mb-1">
                              Expected Amount
                            </p>
                            <p className="text-lg font-bold text-slate-700">
                              {formatCurrency(selectedStaff.salary || 0)}
                            </p>
                          </div>
                          <div className="text-xs text-slate-400 italic">
                            Payment will be processed by administration
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800 mb-2">
                    No Session Data Available
                  </h4>
                  <p className="text-slate-600">
                    Please check with your administrator about session dates.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
