import { Context } from "./contexts";
import { DataProvider } from "./dataContext";
import { InstituteProvider } from "./instituteContext";
import { SessionProvider } from "./sessionContext";
import { StudentsProvider } from "./studentsContext";
import { ParentProvider } from "./parentContext";
import { UserProvider } from "./userContext";
import PropTypes from "prop-types";

export const ContextProvider = ({ children }) => {
  return (
    <Context.Provider>
      <UserProvider>
        <InstituteProvider>
          <SessionProvider>
            <StudentsProvider>
              <ParentProvider>{children}</ParentProvider>
            </StudentsProvider>
          </SessionProvider>
        </InstituteProvider>
      </UserProvider>
    </Context.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
