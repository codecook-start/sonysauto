"use client";

import { Save, Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStyles, useSaveStyles } from "@/hooks/use-styles";
import Link from "next/link";

const StyleControl = () => {
  const { isLoading, userStyles, setUserStyles } = useStyles();
  const { mutate, isLoading: isSaving } = useSaveStyles();

  const handleSave = () => mutate(userStyles);

  if (isLoading)
    return (
      <div className="min-h-screen content-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
      </div>
    );

  return (
    <div className="container-md relative min-h-screen content-center">
      <header className="absolute left-4 top-4">
        <Link
          href="/"
          className="inline-block rounded-md p-2 hover:bg-secondary"
        >
          <Home className="h-6 w-6" />
        </Link>
      </header>
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Custom Styles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={userStyles}
            onChange={(e) => setUserStyles(e.target.value)}
            placeholder="Enter custom CSS..."
            className="h-40"
          />
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Styles
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleControl;
