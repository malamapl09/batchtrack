/**
 * Landing Page
 * Marketing page for BatchTrack
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  Calculator,
  Factory,
  BarChart3,
  Trash2,
  Bell,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">BatchTrack</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Know Your True
            <span className="text-primary"> Cost of Goods</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            BatchTrack helps bakeries, breweries, and food producers track inventory,
            manage recipes, and understand their real production costs.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div className="text-sm font-medium text-primary mb-2">Step 1</div>
              <h3 className="text-xl font-semibold mb-2">Add Ingredients</h3>
              <p className="text-muted-foreground">
                Enter your raw materials with purchase prices and unit conversions.
                BatchTrack calculates your cost per usage unit automatically.
              </p>
            </div>

            {/* Arrow (hidden on mobile) */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-muted-foreground/30" />
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <div className="text-sm font-medium text-primary mb-2">Step 2</div>
              <h3 className="text-xl font-semibold mb-2">Build Recipes</h3>
              <p className="text-muted-foreground">
                Create recipes with your ingredients. See real-time cost calculations
                as you build your bill of materials.
              </p>
            </div>

            {/* Arrow (hidden on mobile) */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-muted-foreground/30" />
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Factory className="h-8 w-8 text-primary" />
              </div>
              <div className="text-sm font-medium text-primary mb-2">Step 3</div>
              <h3 className="text-xl font-semibold mb-2">Track Production</h3>
              <p className="text-muted-foreground">
                Start batches from your recipes. Inventory updates automatically
                and you know exactly what each batch costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything You Need</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed for small production businesses
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <Package className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Ingredient Management</CardTitle>
                <CardDescription>
                  Track raw materials with automatic unit conversions. Know exactly
                  what a gram of flour costs you.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-0">
                <Link
                  href="/features#ingredients"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <Calculator className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Recipe Costing</CardTitle>
                <CardDescription>
                  Build recipes with precise costs. See exactly how much each
                  batch costs to produce.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-0">
                <Link
                  href="/features#recipes"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <Factory className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Batch Production</CardTitle>
                <CardDescription>
                  Scale recipes up or down. Track actual quantities used and
                  automatically update inventory.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-0">
                <Link
                  href="/features#production"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <Trash2 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Waste Tracking</CardTitle>
                <CardDescription>
                  Log waste by reason. Understand where you're losing money and
                  optimize your processes.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-0">
                <Link
                  href="/features#waste"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <Bell className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>
                  Never run out of ingredients. Get notified when stock drops
                  below your thresholds.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-0">
                <Link
                  href="/features#alerts"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Visualize costs, usage trends, and waste patterns. Make
                  data-driven decisions.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-0">
                <Link
                  href="/features#analytics"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Simple Pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>Perfect for small operations</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$39</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Up to 50 ingredients</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Up to 25 recipes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>1 user</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Basic reports</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link href="/sign-up">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pro</CardTitle>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    Popular
                  </span>
                </div>
                <CardDescription>For growing businesses</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$89</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Unlimited ingredients</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Unlimited recipes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Up to 5 users</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>CSV import/export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/sign-up">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Ready to Know Your True Costs?</h2>
          <p className="mt-4 text-lg opacity-90">
            Start your 14-day free trial. No credit card required.
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link href="/sign-up">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-semibold">BatchTrack</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} BatchTrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
