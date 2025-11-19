import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { UserContext } from "./contexts";

export const UserProvider = ({ children }) => {
  const [userState, setUserState] = useState([]);
  const [authState, setAuthState] = useState([]);

  const setUser = useCallback(
    (user) => {
      setUserState(user);
    },
    [setUserState]
  );

  const login = useCallback(
    (user) => {
      setAuthState(user);
    },
    [setAuthState]
  );

  return (
    <UserContext.Provider
      value={{
        userState,
        authState,
        setUser,
        login,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
