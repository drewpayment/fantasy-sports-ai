import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PlayersPage = () => {
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
          <SelectContent>
            {/* Add NFL teams here */}
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Player data will be mapped here */}
            <TableRow>
              <TableCell>Patrick Mahomes</TableCell>
              <TableCell>QB</TableCell>
              <TableCell>KC</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Christian McCaffrey</TableCell>
              <TableCell>RB</TableCell>
              <TableCell>SF</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default PlayersPage;
