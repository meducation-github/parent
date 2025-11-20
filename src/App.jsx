import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { supabase } from "./config/env";
import {
  UserContext,
  SidenavContext,
  StudentsContext,
  ParentContext,
  InstituteContext,
} from "./context/contexts";
import { Button } from "./components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";
import { Sidenav } from "./components/sidenav";
import { LucideMenu, LucideBell, LucideMessageCircle } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { useNotifications } from "./context/notificationContext";
import { Toaster } from "react-hot-toast";
import { useChatPreferences } from "./context/chatPreferencesContext";
import ChatPopup from "./pages/chat/chatPopup";

function App() {
  const { login, setUser } = useContext(UserContext);
  const { studentsState, setStudents } = useContext(StudentsContext);
  const { parentState, setParent } = useContext(ParentContext);
  const { instituteState, setInstitute } = useContext(InstituteContext);
  const { setUser: setNotificationUser, unreadCount } = useNotifications();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navigation = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { floatingEnabled } = useChatPreferences();

  useEffect(() => {
    const handleResize = () => {
      setIsMinimized(window.innerWidth < 1280);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let progressInterval;
    const fetchUser = async () => {
      setLoading(true);
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + Math.random() * 10 : prev));
      }, 50);
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        login(data.user);
        setNotificationUser(data.user);
        localStorage.setItem("user_id", data.user.id);

        const { data: userData, error: userError } = await supabase
          .from("parents")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          setLoading(false);
          clearInterval(progressInterval);
          navigation("/login");
          return;
        }
        setUser(userData);
        localStorage.setItem("parent", JSON.stringify(userData));
        setParent(userData);

        const { data: instituteData, error: instituteError } = await supabase
          .from("institutes")
          .select("*")
          .eq("id", userData.institute_id)
          .single();

        if (!instituteError && instituteData) {
          setInstitute(instituteData);
        }

        const studentIds = userData.student_ids
          ? userData.student_ids.split(",").map((id) => id.trim())
          : [];
        const studentsArray = [];

        for (const studentId of studentIds) {
          if (!studentId) continue;
          const { data: studentData, error: studentError } = await supabase
            .from("students")
            .select("*")
            .eq("id", studentId)
            .single();
          if (studentError) {
            console.error("Error fetching student data:", studentError);
            continue;
          }
          studentsArray.push(studentData);
        }

        localStorage.setItem("students", JSON.stringify(studentsArray));
        setStudents(studentsArray);

        setProgress(100);
        setTimeout(() => setLoading(false), 150);
        clearInterval(progressInterval);
      } else {
        setLoading(false);
        clearInterval(progressInterval);
        navigation("/login");
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [
    login,
    navigation,
    setInstitute,
    setNotificationUser,
    setParent,
    setStudents,
    setUser,
  ]);

  const studentCount = studentsState?.length ?? 0;

  return (
    <SidenavContext.Provider value={{ isMinimized, setIsMinimized }}>
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <div className="flex h-screen min-h-screen bg-muted/40 overflow-hidden">
          <aside className="hidden lg:block">
            <div className="sticky top-0 h-screen">
              <Sidenav />
            </div>
          </aside>

          <SheetContent
            side="left"
            className="w-[85%] border-r p-0 sm:max-w-sm lg:hidden"
          >
            <Sidenav
              isMobile
              onNavigate={() => setIsMobileNavOpen(false)}
            />
          </SheetContent>

          <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
            <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60 lg:px-8">
              <div className="flex items-center gap-3">
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Toggle sidebar"
                  >
                    <LucideMenu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {instituteState?.name || "MEducation Institute"}
                  </p>
                  <h1 className="text-lg font-semibold text-foreground">
                    Welcome back{" "}
                    {parentState?.first_name
                      ? parentState.first_name
                      : "there"}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="relative"
                  onClick={() => navigation("/notifications")}
                >
                  <LucideBell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-[11px]">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => navigation("/chat")}
                >
                  <LucideMessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Open chat</span>
                </Button>
              </div>
            </header>

            <main className="flex-1 min-h-0 overflow-y-auto px-4 py-6 lg:px-10">
              {loading ? (
                <div className="flex h-[70vh] flex-col items-center justify-center gap-5">
                  <h1 className="text-3xl font-black tracking-wide text-primary">
                    MEducation
                  </h1>
                  <div className="h-2 w-48 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full w-full origin-left rounded-full bg-primary transition-all duration-200"
                      style={{ transform: `scaleX(${progress / 100})` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Preparing your personalized parent dashboard...
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border bg-white/80 p-4 shadow-sm">
                      <p className="text-xs uppercase text-muted-foreground tracking-wide">
                        Students linked
                      </p>
                      <p className="mt-2 text-3xl font-semibold">
                        {studentCount}
                      </p>
                    </div>
                    <div className="rounded-2xl border bg-white/80 p-4 shadow-sm">
                      <p className="text-xs uppercase text-muted-foreground tracking-wide">
                        Notifications
                      </p>
                      <p className="mt-2 text-3xl font-semibold">
                        {unreadCount}
                      </p>
                    </div>
                  </div> */}
                  <Outlet />
                </div>
              )}
            </main>
          </div>
        </div>
        {floatingEnabled && location.pathname !== "/chat" && <ChatPopup />}
        <Toaster position="top-right" />
      </Sheet>
    </SidenavContext.Provider>
  );
}

export default App;
