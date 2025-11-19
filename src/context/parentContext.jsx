import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { ParentContext } from "./contexts";

export const ParentProvider = ({ children }) => {
  const [parentState, setParentState] = useState(null);

  const setParent = useCallback(
    (parent) => {
      setParentState(parent);
    },
    [setParentState]
  );

  return (
    <ParentContext.Provider
      value={{
        parentState,
        setParent,
      }}
    >
      {children}
    </ParentContext.Provider>
  );
};

ParentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
