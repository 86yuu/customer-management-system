
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings Dashboard</CardTitle>
          <CardDescription>
            This section is under development. Check back soon for account and application settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-[300px] items-center justify-center border-t">
          <p className="text-center text-muted-foreground">
            Settings functionality coming soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
