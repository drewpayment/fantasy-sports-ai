import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TeamsPage = () => {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Teams</h1>
        <Button>Add New Team</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="bg-secondary text-secondary-foreground">
          <CardHeader>
            <CardTitle>Team 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Owner: John Doe</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary text-secondary-foreground">
          <CardHeader>
            <CardTitle>Team 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Owner: Jane Smith</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TeamsPage;
