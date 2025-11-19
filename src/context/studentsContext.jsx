import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { StudentsContext } from "./contexts";

export const StudentsProvider = ({ children }) => {
  const [studentsState, setStudentsState] = useState([]);

  const setStudents = useCallback(
    (students) => {
      setStudentsState(students);
    },
    [setStudentsState]
  );

  return (
    <StudentsContext.Provider
      value={{
        studentsState,
        setStudents,
      }}
    >
      {children}
    </StudentsContext.Provider>
  );
};

StudentsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
