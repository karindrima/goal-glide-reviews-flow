
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const handleGetStarted = () => {
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            KRA & Review System
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
            Streamline your performance management process with our all-in-one solution for goal setting,
            performance reviews, and feedback cycles.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Feature section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-3">Goal Management</h3>
              <p className="text-muted-foreground">
                Set and track Key Result Areas (KRAs) and Key Performance Indicators (KPIs) with customizable weights.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-3">Review Cycles</h3>
              <p className="text-muted-foreground">
                Quarterly or half-yearly review cycles with automated window generation and notifications.
              </p>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-3">360° Feedback</h3>
              <p className="text-muted-foreground">
                Self-reviews and manager assessments in one unified platform with actionable insights.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-muted py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} KRA & Review System. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button variant="ghost" size="sm">Privacy</Button>
            <Button variant="ghost" size="sm">Terms</Button>
            <Button variant="ghost" size="sm">Support</Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
