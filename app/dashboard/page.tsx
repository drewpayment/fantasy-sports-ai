"use client";

import Layout from "@/components/Layout";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const DashboardPage = () => {
  const { user } = useUser();
  const leagues = useQuery(api.leagues.getLeaguesForUser);
  const getAuthorizationUrl = useAction(api.yahoo.getAuthorizationUrl);
  const createLeague = useMutation(api.leagues.createLeague);

  const [newLeagueName, setNewLeagueName] = useState("");

  // Fetch user profile from Convex
  const userProfile = useQuery(api.users.getUserByClerkId, user ? { clerkId: user.id } : "skip");
  
  // Fetch Yahoo leagues if connected
  const yahooLeagues = useQuery(
    api.yahoo.getLeagues,
    userProfile && userProfile.yahooAccessToken ? { clerkId: userProfile.clerkId } : "skip"
  );

  const handleConnectYahoo = async () => {
    const url = await getAuthorizationUrl();
    if (url) {
      window.location.href = url;
    }
  };

  const importLeague = useAction(api.yahoo.importLeague);

  const handleImportLeague = async (leagueKey: string, leagueName: string) => {
    if (user) {
      await importLeague({ leagueKey, leagueName, clerkId: user.id });
      // Here you might want to refetch the user's leagues from your DB
    }
  };
  
  const handleCreateLeague = async () => {
    if (newLeagueName) {
      await createLeague({ name: newLeagueName, settings: {} });
      setNewLeagueName("");
      // You might want to close the dialog here
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          {!userProfile?.yahooAccessToken && (
            <Button onClick={handleConnectYahoo}>Connect to Yahoo</Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create League</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New League</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="League Name"
                  value={newLeagueName}
                  onChange={(e) => setNewLeagueName(e.target.value)}
                />
                <Button onClick={handleCreateLeague}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-lg col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">My Leagues</h2>
          {leagues && leagues.length > 0 ? (
            <ul>
              {leagues.map((league) => (
                <li key={league._id}>{league.name}</li>
              ))}
            </ul>
          ) : (
            <p>Your leagues will be displayed here.</p>
          )}
        </div>
        
        {userProfile?.yahooAccessToken && (
          <div className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-lg col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Import from Yahoo</h2>
            {yahooLeagues ? (
              <ul>
                {yahooLeagues.map((league: any) => (
                  <li key={league.league_key} className="flex justify-between items-center">
                    {league.name}
                    <Button onClick={() => handleImportLeague(league.league_key, league.name)}>
                      Import
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading your Yahoo leagues...</p>
            )}
          </div>
        )}

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
