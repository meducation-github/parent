import { useState } from "react";
import PropTypes from "prop-types";
import { StudentsContext } from "./contexts";

export const StudentsProvider = ({ children }) => {
  const [studentsState, setStudentsState] = useState([]);

  const setStudents = (students) => {
    setStudentsState(students);
  };

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
