
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/components/dashboard/Dashboard';
import { User, DashboardStats, ReviewCycle, ReviewWindow } from '@/types';
import { useToast } from '@/hooks/use-toast'; // Changed from @/components/ui/toast

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    employeesWithGoals: 0,
    totalEmployees: 0,
    completedReviews: 0,
    pendingReviews: 0,
    activeCycle: null,
    activeWindow: null,
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(storedUser));
    
    // Fetch mock dashboard data
    fetchDashboardData();
  }, [navigate]);
  
  // Mock data fetching function
  const fetchDashboardData = () => {
    // Simulate API delay
    setTimeout(() => {
      const mockCycle: ReviewCycle = {
        id: '1',
        name: 'FY 2024-25 Performance Cycle',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2025-03-31'),
        frequency: 'quarterly',
        status: 'open',
      };
      
      const mockWindow: ReviewWindow = {
        id: '1',
        cycleId: '1',
        label: 'Q1 Review',
        openDate: new Date('2024-06-15'),
        closeDate: new Date('2024-06-30'),
      };
      
      const mockStats: DashboardStats = {
        employeesWithGoals: 18,
        totalEmployees: 25,
        completedReviews: 12,
        pendingReviews: 13,
        activeCycle: mockCycle,
        activeWindow: mockWindow,
      };
      
      setStats(mockStats);
    }, 500);
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };
  
  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Your data export will be ready shortly",
    });
    // In a real app, this would trigger a download or generate a report
  };

  const handleManageCycles = () => {
    navigate('/cycles');
  };
  
  if (!user) {
    return null; // or a loading indicator
  }
  
  return (
    <Layout user={user} onLogout={handleLogout}>
      <Dashboard 
        user={user} 
        stats={stats} 
        exportData={handleExportData} 
        manageCycles={user.role === 'admin' ? handleManageCycles : undefined} 
      />
    </Layout>
  );
};

export default DashboardPage;
