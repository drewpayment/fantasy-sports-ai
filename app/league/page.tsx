import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LeaguePage = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">League Settings</h1>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
          <TabsTrigger value="rosters">Rosters</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <div className="bg-secondary text-secondary-foreground p-6 rounded-lg shadow-lg mt-4">
            <h2 className="text-xl font-bold mb-4">General Settings</h2>
            <p>General league settings will go here.</p>
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
