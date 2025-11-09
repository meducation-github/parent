import { useState, useEffect } from "react";
import PageHeader from "../../components/pageHeader";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  School,
  GraduationCap,
  Save,
  Eye,
  Plus,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { supabase } from "../../config/env";

const STAFF_ID = localStorage.getItem("staff_id");

// Module definitions with icons
const ModulesArr = [
  { name: "Home", path: "/home", icon: "🏠" },
  { name: "Profile", path: "/profile", icon: "👤" },
  { name: "Students", path: "/students", icon: "🎓" },
  { name: "Staff", path: "/staff", icon: "👥" },
  { name: "Parents", path: "/parents", icon: "👨‍👩‍👧‍👦" },
  { name: "Finance", path: "/finance", icon: "💰" },
  { name: "Attendance", path: "/attendance", icon: "📅" },
  { name: "Admissions", path: "/admissions", icon: "📝" },
  { name: "Curriculum", path: "/curriculum", icon: "📚" },
  { name: "Classroom", path: "/classroom", icon: "🏫" },
];

// Action definitions with icons and colors
const ActionIcons = {
  view: { icon: Eye, color: "text-blue-600", bgColor: "bg-blue-50" },
  add: { icon: Plus, color: "text-green-600", bgColor: "bg-green-50" },
  edit: { icon: Edit, color: "text-yellow-600", bgColor: "bg-yellow-50" },
  delete: { icon: Trash2, color: "text-red-600", bgColor: "bg-red-50" },
  manage: { icon: Shield, color: "text-purple-600", bgColor: "bg-purple-50" },
};

const Modules = () => {
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const { data, error } = await supabase
        .from("staff")
        .select("permissions")
        .eq("id", STAFF_ID)
        .single();

      if (error) throw error;
      setPermissions(data?.permissions || {});
    } catch (error) {
      console.error("Error fetching permissions:", error);
      // Set default permissions for demo
      setPermissions({
        "/home": ["view"],
        "/profile": ["view", "edit"],
        "/students": ["view", "add", "edit"],
        "/staff": ["view"],
        "/parents": ["view", "add"],
        "/finance": ["view"],
        "/attendance": ["view", "add", "edit"],
        "/admissions": ["view", "add"],
        "/curriculum": ["view"],
        "/classroom": ["view", "add"],
      });
    } finally {
      setLoading(false);
    }
  };

  const getModulePermissions = (modulePath) => {
    return permissions[modulePath] || [];
  };

  const hasPermission = (modulePath, action) => {
    const modulePermissions = getModulePermissions(modulePath);
    return modulePermissions.includes(action);
  };

  const getActionIcon = (action) => {
    const actionConfig = ActionIcons[action] || ActionIcons.view;
    const IconComponent = actionConfig.icon;
    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${actionConfig.bgColor} ${actionConfig.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {action}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="">
      <PageHeader
        title={"Module Permissions"}
        subtitle={`View and manage your access permissions across different modules.`}
      />

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Module Permissions
            </h2>
            <button
              onClick={() => window.open(`https://app.meducation.pk`, "_blank")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to MEducation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ModulesArr.filter((module) => {
              const modulePermissions = getModulePermissions(module.path);
              return modulePermissions.length > 0;
            }).map((module) => {
              const modulePermissions = getModulePermissions(module.path);
              const moduleRoute = module.path.replace("/", "");

              return (
                <div
                  key={module.path}
                  onClick={() =>
                    window.open(
                      `https://app.meducation.pk/${moduleRoute}`,
                      "_blank"
                    )
                  }
                  className="relative p-6 rounded-lg border transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm hover:shadow-md hover:scale-105 cursor-pointer group"
                >
                  {/* Module Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl group-hover:scale-110 transition-transform">
                        {module.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                          {module.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {modulePermissions.length} permission(s)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>

                  {/* Permissions List */}
                  <div className="space-y-2">
                    {modulePermissions.map((action) => (
                      <div
                        key={action}
                        className="flex items-center justify-between"
                      >
                        {getActionIcon(action)}
                      </div>
                    ))}
                  </div>

                  {/* Permission Summary */}
                  {/* <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
                      {modulePermissions.map((action) => (
                        <span
                          key={action}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white border border-gray-200 text-gray-700"
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div> */}

                  {/* Click indicator */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-xs text-blue-600 font-medium">
                      Click to open
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Section */}
          {/* <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Access Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    ModulesArr.filter(
                      (m) => getModulePermissions(m.path).length > 0
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Available Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(permissions).flat().length}
                </div>
                <div className="text-sm text-gray-600">Total Permissions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(ActionIcons).length}
                </div>
                <div className="text-sm text-gray-600">Permission Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {ModulesArr.length}
                </div>
                <div className="text-sm text-gray-600">
                  Total System Modules
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Modules;
