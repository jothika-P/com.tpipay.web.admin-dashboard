import MainLayout from "../layout/MainLayout";

const LegalTeamDashboard = () => {
  return (
    <MainLayout>
      <div style={{ padding: "20px" }}>
        <h1>Legal Team Dashboard</h1>
        <p>Welcome Legal Team 👨‍⚖️</p>

        <div style={{ marginTop: "20px" }}>
          <h3>Full Access Features:</h3>
          <ul>
            <li>✔ User Management</li>
            <li>✔ KYC Verification</li>
            <li>✔ Analytics Reports</li>
            <li>✔ Compliance Tracking</li>
            <li>✔ Admin-Level Controls</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default LegalTeamDashboard;