
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CycleCreationForm from '@/components/cycle/CycleCreationForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ReviewCycle, User, CycleCreationFormData } from '@/types';

const CyclesPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeCycles, setActiveCycles] = useState<ReviewCycle[]>([]);
  const [closedCycles, setClosedCycles] = useState<ReviewCycle[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    // Only admins should access this page
    if (parsedUser.role !== 'admin') {
      navigate('/dashboard');
      toast({
        title: "Access denied",
        description: "Only administrators can access cycle management",
        variant: "destructive"
      });
      return;
    }
    
    // Fetch mock cycle data
    fetchCycles();
  }, [navigate]);

  const fetchCycles = () => {
    // Mock data with different cycle types
    setTimeout(() => {
      const mockCycles: ReviewCycle[] = [
        {
          id: '1',
          name: 'FY 2024-25 Performance Cycle',
          startDate: new Date('2024-04-01'),
          endDate: new Date('2025-03-31'),
          frequency: 'quarterly',
          status: 'open',
        },
        {
          id: '2',
          name: 'Mid-Year 2024 Cycle',
          startDate: new Date('2024-07-01'),
          endDate: new Date('2024-12-31'),
          frequency: 'half-yearly',
          status: 'open',
        },
        {
          id: '3',
          name: 'FY 2023-24 Performance Cycle',
          startDate: new Date('2023-04-01'),
          endDate: new Date('2024-03-31'),
          frequency: 'quarterly',
          status: 'closed',
        }
      ];
      
      setActiveCycles(mockCycles.filter(cycle => cycle.status === 'open'));
      setClosedCycles(mockCycles.filter(cycle => cycle.status === 'closed'));
    }, 500);
  };

  const handleCreateCycle = async (data: CycleCreationFormData) => {
    // In a real app, this would send data to an API
    console.log('Creating new cycle:', data);
    
    // Mock success with timeout to simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newCycle: ReviewCycle = {
          id: `cycle-${Date.now()}`, // Generate fake ID
          name: data.name,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          frequency: data.frequency,
          status: 'open'
        };
        
        setActiveCycles(prev => [...prev, newCycle]);
        resolve();
      }, 800);
    });
  };

  const handleCloseCycle = (cycleId: string) => {
    // In a real app, this would send a request to the API
    console.log('Closing cycle:', cycleId);
    
    // Update local state to reflect the change
    const cycleToClose = activeCycles.find(cycle => cycle.id === cycleId);
    if (cycleToClose) {
      const updatedCycle = { ...cycleToClose, status: 'closed' as const };
      
      setActiveCycles(activeCycles.filter(cycle => cycle.id !== cycleId));
      setClosedCycles([...closedCycles, updatedCycle]);
      
      toast({
        title: "Cycle closed",
        description: `${updatedCycle.name} has been closed successfully`,
      });
    }
  };

  const formatDateRange = (start: Date, end: Date) => {
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const getFrequencyLabel = (frequency: string) => {
    switch(frequency) {
      case 'quarterly': return 'Quarterly (4 reviews/year)';
      case 'half-yearly': return 'Half-Yearly (2 reviews/year)';
      default: return frequency;
    }
  };

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <Layout user={user} onLogout={() => {
      sessionStorage.removeItem('user');
      navigate('/login');
    }}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Performance Cycles</h1>
            <p className="text-muted-foreground">
              Create and manage performance review cycles
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Cycles</TabsTrigger>
            <TabsTrigger value="closed">Closed Cycles</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {activeCycles.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No active cycles found</p>
                </CardContent>
              </Card>
            ) : (
              activeCycles.map((cycle) => (
                <Card key={cycle.id}>
                  <CardHeader>
                    <CardTitle>{cycle.name}</CardTitle>
                    <CardDescription>
                      {formatDateRange(new Date(cycle.startDate), new Date(cycle.endDate))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Review Frequency:</span>
                        <span>{getFrequencyLabel(cycle.frequency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Status:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">View Details</Button>
                    <Button variant="destructive" onClick={() => handleCloseCycle(cycle.id)}>
                      Close Cycle
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="closed" className="space-y-4">
            {closedCycles.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No closed cycles found</p>
                </CardContent>
              </Card>
            ) : (
              closedCycles.map((cycle) => (
                <Card key={cycle.id}>
                  <CardHeader>
                    <CardTitle>{cycle.name}</CardTitle>
                    <CardDescription>
                      {formatDateRange(new Date(cycle.startDate), new Date(cycle.endDate))}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Review Frequency:</span>
                        <span>{getFrequencyLabel(cycle.frequency)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Status:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Closed
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">View Details</Button>
                    <Button variant="outline">Export Data</Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="create">
            <CycleCreationForm onSubmit={handleCreateCycle} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CyclesPage;
