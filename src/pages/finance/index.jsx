import PageHeader from "../../components/pageHeader";
import Salary from "./salary";

function Finance() {
  return (
    <>
      <PageHeader
        title={"Salary"}
        subtitle={"See all your salary information"}
      />

      <Salary />
    </>
  );
}

export default Finance;
