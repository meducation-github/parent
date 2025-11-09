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
} from "lucide-react";
import { supabase } from "../../config/env";

const STAFF_ID = localStorage.getItem("staff_id");

const Profile = () => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({});

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const { data, error } = await supabase
        .from("staff")
        .select("*")
        .eq("id", STAFF_ID)
        .single();

      if (error) throw error;
      setStaff(data);
      setEditedFields(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("staff")
        .update({
          name: editedFields.name,
          address: editedFields.address,
          updated_at: new Date(),
        })
        .eq("id", STAFF_ID);

      if (error) throw error;
      setIsEditing(false);
      fetchStaffData();
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="">
      <PageHeader
        title={"Profile"}
        subtitle={`See your profile details and update them if needed.`}
      />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg p-6 mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Basic Information
            </h2>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEditing ? (
                <>
                  <Save size={20} className="mr-2" />
                  Save Changes
                </>
              ) : (
                "Edit Profile"
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Editable Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <div className="relative">
                  <User
                    size={20}
                    className="absolute left-3 top-2.5 text-gray-400"
                  />
                  <input
                    type="text"
                    name="name"
                    value={editedFields.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <MapPin
                    size={20}
                    className="absolute left-3 top-2.5 text-gray-400"
                  />
                  <input
                    type="text"
                    name="address"
                    value={editedFields.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Non-editable Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-3 top-2.5 text-gray-400"
                  />
                  <input
                    type="email"
                    value={staff?.email || "Not provided"}
                    disabled
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <Phone
                    size={20}
                    className="absolute left-3 top-2.5 text-gray-400"
                  />
                  <input
                    type="tel"
                    value={staff?.phone || "Not provided"}
                    disabled
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
