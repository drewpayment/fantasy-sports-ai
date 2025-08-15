"use client";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const TeamsPage = () => {
  // For demonstration, we'll fetch teams from the user's first league.
  const leagues = useQuery(api.leagues.getLeaguesForUser);
  const firstLeagueId = leagues?.[0]?._id;
  const teams = useQuery(
    api.teams.getTeamsForLeague,
    firstLeagueId ? { leagueId: firstLeagueId } : "skip"
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Teams</h1>
        <Button>Add New Team</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams ? (
          teams.map((team) => (
            <Card key={team._id} className="bg-secondary text-secondary-foreground">
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Owner ID: {team.userId}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No teams found for this league.</p>
        )}
      </div>
    </Layout>
  );
};

export default TeamsPage;
