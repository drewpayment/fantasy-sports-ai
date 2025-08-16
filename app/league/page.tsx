"use client";

import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import React from "react";

// Define a type for our settings state
interface Settings {
  general: {
    name: string;
    maxTeams: number;
  };
  roster: { [key: string]: number };
  scoring: { [key: string]: number };
}

// Define a structure for roster settings
const rosterPositions = [
  { key: "QB", label: "Quarterback" },
  { key: "RB", label: "Running Back" },
  { key: "WR", label: "Wide Receiver" },
  { key: "TE", label: "Tight End" },
  { key: "W_R_T", label: "WR/RB/TE Flex" },
  { key: "K", label: "Kicker" },
  { key: "DEF", label: "Defense/Special Teams" },
  { key: "BN", label: "Bench" },
  { key: "IR", label: "Injured Reserve" },
];

// Define a structure for scoring settings
const scoringSettings = {
  Offense: [
    { key: "passingYards", label: "Passing Yards" },
    { key: "passingTouchdowns", label: "Passing Touchdowns" },
    { key: "interceptions", label: "Interceptions" },
    { key: "rushingYards", label: "Rushing Yards" },
    { key: "rushingTouchdowns", label: "Rushing Touchdowns" },
    { key: "receptions", label: "Receptions" },
  ],
  Kickers: [
    { key: "fieldGoals0to19", label: "Field Goals 0-19 Yards" },
    { key: "fieldGoals20to29", label: "Field Goals 20-29 Yards" },
  ],
  Defense: [
    { key: "sacks", label: "Sacks" },
    { key: "interceptions", label: "Interceptions" },
  ]
};


const LeagueSettingsPage = () => {
  const leagues = useQuery(api.leagues.getLeaguesForUser);
  const firstLeagueId = leagues?.[0]?._id;
  const league = useQuery(
    api.leagues.getLeagueById,
    firstLeagueId ? { leagueId: firstLeagueId } : "skip"
  );

  const updateLeagueSettings = useMutation(api.leagues.updateLeagueSettings);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState<Settings>({
    general: { name: "", maxTeams: 10 },
    roster: {},
    scoring: {},
  });

  useEffect(() => {
    if (league) {
      const currentSettings = league.settings || {};
      setSettings({
        general: {
          name: league.name, // Always use the league's name
          maxTeams: currentSettings.general?.maxTeams || 10,
        },
        roster: currentSettings.roster || {},
        scoring: currentSettings.scoring || {},
      });
    }
  }, [league]);

  const handleSettingChange = (
    category: keyof Settings, 
    key: string, 
    value: string | number
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };
  
  const handleSaveChanges = async () => {
    if (league) {
      setIsSaving(true);
      try {
        await updateLeagueSettings({
          leagueId: league._id,
          settings: settings,
          name: settings.general.name,
        });
        alert("Settings saved successfully!");
      } catch (error) {
        alert(`Error saving settings: ${(error as Error).message}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {league ? league.name : "League Settings"}
        </h1>
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card className="mt-4">
            <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="leagueName">League Name</Label>
                <Input id="leagueName" value={settings.general.name} onChange={(e) => handleSettingChange('general', 'name', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="maxTeams">Max Teams</Label>
                <Input id="maxTeams" type="number" value={settings.general.maxTeams} onChange={(e) => handleSettingChange('general', 'maxTeams', parseInt(e.target.value, 10))} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roster Settings Tab */}
        <TabsContent value="roster">
          <Card className="mt-4">
            <CardHeader><CardTitle>Roster Positions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {rosterPositions.map(({ key, label }) => (
                <div key={key}>
                  <Label htmlFor={key}>{label}</Label>
                  <Input id={key} type="number" value={settings.roster[key] || ''} onChange={(e) => handleSettingChange('roster', key, parseInt(e.target.value, 10))} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scoring Settings Tab */}
        <TabsContent value="scoring">
          <Card className="mt-4">
            <CardHeader><CardTitle>Scoring Settings</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Statistic</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(scoringSettings).map(([category, rules]) => (
                    <React.Fragment key={category}>
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={2} className="font-bold">{category}</TableCell>
                      </TableRow>
                      {rules.map(({ key, label }) => (
                        <TableRow key={key}>
                          <TableCell>{label}</TableCell>
                          <TableCell className="text-right">
                            <Input type="number" className="w-24 ml-auto" value={settings.scoring[key] || ''} onChange={(e) => handleSettingChange('scoring', key, parseFloat(e.target.value))} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default LeagueSettingsPage;
