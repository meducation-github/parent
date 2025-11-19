import { Context } from "./contexts";
import { InstituteProvider } from "./instituteContext";
import { SessionProvider } from "./sessionContext";
import { StudentsProvider } from "./studentsContext";
import { ParentProvider } from "./parentContext";
import { UserProvider } from "./userContext";
import { NotificationProvider } from "./notificationContext";
import { ChatPreferencesProvider } from "./chatPreferencesContext";
import PropTypes from "prop-types";

export const ContextProvider = ({ children }) => {
  return (
    <Context.Provider>
      <UserProvider>
        <NotificationProvider>
          <ChatPreferencesProvider>
            <InstituteProvider>
              <SessionProvider>
                <StudentsProvider>
                  <ParentProvider>{children}</ParentProvider>
                </StudentsProvider>
              </SessionProvider>
            </InstituteProvider>
          </ChatPreferencesProvider>
        </NotificationProvider>
      </UserProvider>
    </Context.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
