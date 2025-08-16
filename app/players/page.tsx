"use client";

import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePaginatedQuery, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PaginationOptions } from "convex/server";
import { Id } from "@/convex/_generated/dataModel";

const PlayersPage = () => {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("all");
  const [paginationOpts, setPaginationOpts] = useState<PaginationOptions>({ numItems: 10, cursor: null });

  // Get the user's first team to add players to (for demonstration)
  const teams = useQuery(api.teams.getTeamsForUser);
  const firstTeamId = teams?.[0]?._id;

  const addPlayerToRoster = useMutation(api.rosters.addPlayerToRoster);

  const {
    results: players,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.players.getPlayers,
    { paginationOpts },
    { initialNumItems: 10 }
  );

  const handleAddPlayer = async (playerId: Id<"players">) => {
    if (!firstTeamId) {
      alert("No team available to add players to."); // Replace with better UI later
      return;
    }
    try {
      await addPlayerToRoster({ playerId, teamId: firstTeamId });
      alert("Player added successfully!"); // Replace with better UI later
    } catch (error) {
      alert(`Error adding player: ${(error as Error).message}`); // Replace with better UI later
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Players</h1>
      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Search by name..."
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={position} onValueChange={setPosition}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            <SelectItem value="QB">QB</SelectItem>
            <SelectItem value="RB">RB</SelectItem>
            <SelectItem value="WR">WR</SelectItem>
            <SelectItem value="TE">TE</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-secondary text-secondary-foreground rounded-lg shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-secondary-foreground">Name</TableHead>
              <TableHead className="text-secondary-foreground">Position</TableHead>
              <TableHead className="text-secondary-foreground">Team</TableHead>
              <TableHead className="text-secondary-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players?.map((player) => (
              <TableRow key={player._id}>
                <TableCell>{player.fullName}</TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>{player.team}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" onClick={() => handleAddPlayer(player._id)}>Add Player</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => loadMore(10)}
          disabled={status !== "CanLoadMore"}
        >
          {status === "LoadingMore" ? "Loading..." : "Load More"}
        </Button>
      </div>
    </Layout>
  );
};

export default PlayersPage;
