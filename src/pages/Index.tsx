
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, BarChart3, Users, FileText } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary"></div>
            <span className="text-xl font-bold">CRM System</span>
          </div>
          <nav className="hidden space-x-6 md:flex">
            <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              About
            </Link>
          </nav>
          <div className="space-x-2">
            {user ? (
              <Button asChild>
                <Link to="/dashboard">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 bg-gradient-to-b from-background to-muted">
        <div className="container flex flex-col items-center justify-center space-y-12 py-20 text-center md:py-32">
          <div className="space-y-6 md:w-2/3">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Simplify Customer Relationship Management
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              All the tools you need to manage your customer relationships in one
              powerful, easy-to-use platform. Track interactions, monitor
              performance, and grow your business.
            </p>
          </div>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link to="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Key Features
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to manage your customer relationships
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 rounded-lg border p-6">
              <Users className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-bold">Customer Management</h3>
              <p className="text-muted-foreground">
                Track all customer information in one place. Maintain detailed
                profiles and interaction history.
              </p>
            </div>
            <div className="space-y-4 rounded-lg border p-6">
              <BarChart3 className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-bold">Performance Analytics</h3>
              <p className="text-muted-foreground">
                Gain insights with customizable reports and dashboards. Monitor
                key metrics and track your business performance.
              </p>
            </div>
            <div className="space-y-4 rounded-lg border p-6">
              <FileText className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-bold">Documentation</h3>
              <p className="text-muted-foreground">
                Store all customer-related documents, notes, and files. Keep your
                information organized and accessible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted py-16 md:py-24">
        <div className="container flex flex-col items-center space-y-6 text-center md:w-2/3">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to transform your customer relationships?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of businesses that use our platform to manage and grow
            their customer relationships.
          </p>
          <Button size="lg" asChild>
            <Link to="/signup">
              Sign up now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 md:py-12">
        <div className="container flex flex-col gap-6 md:flex-row md:justify-between">
          <div className="space-y-4 md:w-1/3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary"></div>
              <span className="text-xl font-bold">CRM System</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Simplifying customer relationship management since 2023. A powerful,
              intuitive platform for businesses of all sizes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12 md:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/roadmap" className="hover:text-foreground">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/privacy" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2023 CRM System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
