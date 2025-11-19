import { useContext, useEffect, useState } from "react";
import { ParentContext, InstituteContext } from "../../context/contexts";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { supabase } from "../../config/env";
import { toast } from "react-hot-toast";
import {
  LucideUserCog,
  LucideSchool,
  LucideCheckCircle,
  LucideLoader2,
} from "lucide-react";

const Settings = () => {
  const { parentState, setParent } = useContext(ParentContext);
  const { instituteState } = useContext(InstituteContext);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    occupation: "",
    relationship: "",
    address: "",
  });

  useEffect(() => {
    if (parentState) {
      setFormData({
        first_name: parentState.first_name || "",
        last_name: parentState.last_name || "",
        email: parentState.email || "",
        phone: parentState.phone || "",
        occupation: parentState.occupation || "",
        relationship: parentState.relationship || "",
        address: parentState.address || "",
      });
    }
  }, [parentState]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!parentState?.id) return;
    setIsSaving(true);
    const payload = {
      ...formData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("parents")
      .update(payload)
      .eq("id", parentState.id)
      .select()
      .single();

    setIsSaving(false);

    if (error) {
      console.error("Error updating profile:", error);
      toast.error("Unable to update your profile");
      return;
    }

    setParent(data);
    localStorage.setItem("parent", JSON.stringify(data));
    toast.success("Profile updated successfully");
  };

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Settings
        </p>
        <h1 className="text-3xl font-bold text-foreground">
          Personalize your parent profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Keep your contact details up to date so the institute can reach you instantly.
          Changes sync with the connected institute in real-time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <LucideUserCog className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Profile details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update your contact information for institute communication.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="first_name">First name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 0000000"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    placeholder="Father / Mother / Guardian"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Primary address</Label>
                <Textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House no, street, city"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Last updated{" "}
                  {parentState?.updated_at
                    ? new Date(parentState.updated_at).toLocaleString()
                    : "not available"}
                </div>
                <Button type="submit" className="min-w-[140px]" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <LucideLoader2 className="h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      <LucideCheckCircle className="h-4 w-4" />
                      Save changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <LucideSchool className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Connected institute</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Details of the institute linked with your account.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Institute name</p>
                <p className="text-base font-semibold">
                  {instituteState?.name || "Not linked"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parent ID</p>
                <p className="font-mono text-sm">
                  {parentState?.id || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supabase user ID</p>
                <p className="font-mono text-xs break-all">
                  {parentState?.user_id || "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Settings;
