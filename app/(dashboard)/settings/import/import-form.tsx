'use client';

/**
 * Import Form Component
 * File upload and import handling
 */

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
  importIngredients,
  importRecipes,
  getIngredientCSVTemplate,
  getRecipeCSVTemplate,
  type ImportResult,
} from '@/lib/actions/import';

export function ImportForm() {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setResult(null);

    try {
      const content = await file.text();
      const importResult =
        activeTab === 'ingredients'
          ? await importIngredients(content)
          : await importRecipes(content);

      setResult(importResult);
    } catch (error) {
      setResult({
        success: false,
        imported: 0,
        errors: [{ row: 0, message: 'Failed to process file' }],
      });
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  async function downloadTemplate() {
    const template =
      activeTab === 'ingredients'
        ? await getIngredientCSVTemplate()
        : await getRecipeCSVTemplate();

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
        <TabsTrigger value="recipes">Recipes</TabsTrigger>
      </TabsList>

      <TabsContent value="ingredients">
        <Card>
          <CardHeader>
            <CardTitle>Import Ingredients</CardTitle>
            <CardDescription>
              Upload a CSV file to bulk import ingredients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ingredients-file">CSV File</Label>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  id="ingredients-file"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={downloadTemplate}
                disabled={isLoading}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Importing...</span>
              </div>
            )}

            {result && <ImportResultDisplay result={result} />}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="recipes">
        <Card>
          <CardHeader>
            <CardTitle>Import Recipes</CardTitle>
            <CardDescription>
              Upload a CSV file to bulk import recipe definitions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipes-file">CSV File</Label>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  id="recipes-file"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={downloadTemplate}
                disabled={isLoading}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Importing...</span>
              </div>
            )}

            {result && <ImportResultDisplay result={result} />}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function ImportResultDisplay({ result }: { result: ImportResult }) {
  return (
    <div className="space-y-2">
      <div
        className={`flex items-center gap-2 p-3 rounded-md ${
          result.success
            ? 'bg-green-500/10 text-green-700 dark:text-green-400'
            : result.imported > 0
            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
            : 'bg-destructive/10 text-destructive'
        }`}
      >
        {result.success ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <span>
          {result.imported} row{result.imported !== 1 ? 's' : ''} imported
          {result.errors.length > 0 &&
            `, ${result.errors.length} error${result.errors.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {result.errors.length > 0 && (
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-medium mb-2">Errors:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {result.errors.slice(0, 10).map((error, i) => (
              <li key={i}>{error.message}</li>
            ))}
            {result.errors.length > 10 && (
              <li>...and {result.errors.length - 10} more errors</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
