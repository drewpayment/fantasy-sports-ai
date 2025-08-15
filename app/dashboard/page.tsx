import Layout from "@/components/Layout";

const DashboardPage = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">My Leagues</h2>
          <p>Your leagues will be displayed here.</p>
        </div>
        <div className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Upcoming Drafts</h2>
          <p>Your upcoming drafts will be displayed here.</p>
        </div>
        <div className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Recent News</h2>
          <p>Recent fantasy football news will be displayed here.</p>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
