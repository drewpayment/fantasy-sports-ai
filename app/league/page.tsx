"use client";

import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const LeaguePage = () => {
  // For demonstration, we'll fetch the user's first league.
  // In a real app, this ID would come from the URL or state.
  const leagues = useQuery(api.leagues.getLeaguesForUser);
  const firstLeagueId = leagues?.[0]?._id;
  const league = useQuery(
    api.leagues.getLeagueById,
    firstLeagueId ? { leagueId: firstLeagueId } : "skip"
  );

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">
        {league ? league.name : "League Settings"}
      </h1>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
          <TabsTrigger value="rosters">Rosters</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <div className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-lg mt-4">
            <h2 className="text-xl font-bold mb-4">General Settings</h2>
            {league ? (
              <pre>{JSON.stringify(league.settings, null, 2)}</pre>
            ) : (
              <p>General league settings will go here.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="scoring">
          <div className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-lg mt-4">
            <h2 className="text-xl font-bold mb-4">Scoring Settings</h2>
            <p>Scoring settings will go here.</p>
          </div>
        </TabsContent>
        <TabsContent value="rosters">
          <div className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-lg mt-4">
            <h2 className="text-xl font-bold mb-4">Roster Settings</h2>
            <p>Roster settings will go here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default LeaguePage;
