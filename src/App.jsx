import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { supabase } from "./config/env";
import {
  UserContext,
  SidenavContext,
  StudentsContext,
  ParentContext,
  InstituteContext,
} from "./context/contexts";
import { LucideSidebarClose, LucideSidebarOpen } from "lucide-react";
import { Sidenav } from "./components/sidenav";

function App() {
  const { login, setUser } = useContext(UserContext);
  const { setStudents } = useContext(StudentsContext);
  const { setParent } = useContext(ParentContext);
  const { setInstitute } = useContext(InstituteContext);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileSidenavOpen, setIsMobileSidenavOpen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const navigation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
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
      console.log(data);
      if (data?.user) {
        login(data.user);
        console.log(data.user.id);
        localStorage.setItem("user_id", data.user.id);

        const { data: userData, error: userError } = await supabase
          .from("parents")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          return;
        }
        setUser(userData);
        localStorage.setItem("parent", JSON.stringify(userData));
        setParent(userData); // Set parent in context

        // get institute associated with Parent
        const { data: instituteData, error: instituteError } = await supabase
          .from("institutes")
          .select("*")
          .eq("id", userData.institute_id)
          .single();

        if (instituteError) {
          console.error("Error fetching institute data:", instituteError);
          return;
        }
        setInstitute(instituteData);

        // string to array
        const studentIds = userData.student_ids.split(",");
        const studentsArray = []; // Create an array to store all students

        for (const studentId of studentIds) {
          const { data: studentData, error: studentError } = await supabase
            .from("students")
            .select("*")
            .eq("id", studentId)
            .single();
          if (studentError) {
            console.error("Error fetching student data:", studentError);
            return;
          }
          // student object store in array
          studentsArray.push(studentData);
          console.log(studentData);
        }

        localStorage.setItem("students", JSON.stringify(studentsArray));
        setStudents(studentsArray); // Set students in context

        setProgress(100);
        setTimeout(() => setLoading(false), 50); // allow bar to finish
        clearInterval(progressInterval);
      } else {
        setLoading(false);
        clearInterval(progressInterval);
        navigation("/login");
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <SidenavContext.Provider value={{ isMinimized, setIsMinimized }}>
      <div>
        {loading && (
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-all">
            <h1 className="text-4xl font-black mb-4 tracking-wide flex">
              {["M", "E", "d", " ", "P", "a", "r", "e", "n", "t"].map(
                (letter, index) => {
                  const letterProgress = (index + 1) * 10; // Each letter represents 10% progress
                  const isFilled = progress >= letterProgress;
                  return (
                    <span
                      key={index}
                      className={`transition-colors duration-300 ${
                        isFilled ? "text-blue-600" : "text-zinc-200"
                      }`}
                      style={{ letterSpacing: "0.05em" }}
                    >
                      {letter}
                    </span>
                  );
                }
              )}
            </h1>
          </div>
        )}
        <div className="sm:flex w-full h-screen">
          {/* <div className="block sm:hidden">
            <div className="flex items-center border-b border-gray-200 justify-between">
              <div className="flex-1">
                <div className="text-left ml-2 select-none flex items-center p-1 font-bold text-xl py-4 cursor-pointer hover:text-zinc-800 transition-colors">
                  <Link to="/">
                    <h1 className="text-center text-2xl font-semibold p-1">
                      MEd Staff
                    </h1>
                  </Link>
                </div>
              </div>
              <div
                className="hover:bg-gray-100 rounded-md mx-2 px-4 py-4"
                onClick={() => setIsMobileSidenavOpen(true)}
              >
                {isMobileSidenavOpen ? (
                  <LucideSidebarClose />
                ) : (
                  <LucideSidebarOpen />
                )}
              </div>
            </div>
          </div> */}
          {/* <div
            className={`fixed sm:sticky top-0 h-screen rounded-lg p-2 sm:block transition-all duration-300 ${
              isMinimized || isMediumScreen
                ? "sm:w-20"
                : "sm:w-3/12 md:w-2/12 lg:w-2/12 xl:w-2/12"
            } ${
              isMobileSidenavOpen
                ? "top-0 left-0 w-[80%] block"
                : "-left-full hidden"
            }  z-50`}
          >
            <Sidenav />
          </div>

          {isMobileSidenavOpen && (
            <div
              className="fixed inset-0 bg-black/10 z-40 sm:hidden"
              onClick={() => setIsMobileSidenavOpen(false)}
            />
          )} */}

          <div className="flex-1 pr-2 h-screen overflow-y-auto">
            <div
              className={`w-full rounded-lg my-2 transition-all duration-300 px-4 py-1`}
            >
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </SidenavContext.Provider>
  );
}

export default App;
