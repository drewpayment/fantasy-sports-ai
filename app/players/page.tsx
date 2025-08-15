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
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const PlayersPage = () => {
  const players = useQuery(api.players.getPlayers);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Players</h1>
      <div className="flex space-x-4 mb-4">
        <Input placeholder="Search by name..." className="max-w-xs" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="qb">QB</SelectItem>
            <SelectItem value="rb">RB</SelectItem>
            <SelectItem value="wr">WR</SelectItem>
            <SelectItem value="te">TE</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by team" />
          </SelectTrigger>
          <SelectContent>{/* Add NFL teams here */}</SelectContent>
        </Select>
      </div>
      <div className="bg-secondary text-secondary-foreground rounded-lg shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-secondary-foreground">Name</TableHead>
              <TableHead className="text-secondary-foreground">
                Position
              </TableHead>
              <TableHead className="text-secondary-foreground">Team</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players ? (
              players.map((player) => (
                <TableRow key={player._id}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.position}</TableCell>
                  <TableCell>{player.nflTeam}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>Loading players...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default PlayersPage;
