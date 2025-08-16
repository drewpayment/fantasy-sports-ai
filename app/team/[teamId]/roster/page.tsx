"use client";

import Layout from "@/components/Layout";

const RosterPage = ({ params }: { params: { teamId: string } }) => {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Team Roster
        </h1>
        {/* We can add a button to add players here later */}
      </div>
      <p>Display team roster for team ID: {params.teamId}</p>
      {/* Roster display logic will be implemented here */}
    </Layout>
  );
};

export default RosterPage;
