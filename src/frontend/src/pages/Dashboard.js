import { useSearchParams } from "react-router-dom";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const ecMapping = searchParams.get("ec_mapping");

  return <h1>Welcome to Dashboard, EC Mapping: {ecMapping}</h1>;
};

export default Dashboard;
