"use client";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const TeamsPage = () => {
  // For demonstration, we'll fetch teams from the user's first league.
  const leagues = useQuery(api.leagues.getLeaguesForUser);
  const firstLeagueId = leagues?.[0]?._id;
  const teams = useQuery(
    api.teams.getTeamsForLeague,
    firstLeagueId ? { leagueId: firstLeagueId } : "skip"
  );
  const createTeam = useMutation(api.teams.createTeam);
  const [newTeamName, setNewTeamName] = useState("");

  const handleCreateTeam = async () => {
    if (newTeamName && firstLeagueId) {
      await createTeam({ name: newTeamName, leagueId: firstLeagueId });
      setNewTeamName("");
      // Close dialog
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Teams</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Team</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Team</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Team Name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
              <Button onClick={handleCreateTeam}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
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
