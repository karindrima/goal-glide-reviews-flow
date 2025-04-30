
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/components/dashboard/Dashboard';
import KraManagement from '@/components/kra/KraManagement';
import EmployeeProfile from '@/components/employee/EmployeeProfile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, DashboardStats, ReviewCycle, ReviewWindow } from '@/types';
import { useToast } from '@/hooks/use-toast';

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
  const [employeeProfile, setEmployeeProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
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
    
    // Fetch mock employee profile
    fetchEmployeeProfile();
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
  
  const fetchEmployeeProfile = () => {
    // Simulate API delay
    setTimeout(() => {
      const mockProfile = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'employee',
        department: 'Engineering',
        position: 'Senior Developer',
        joinDate: new Date('2020-05-15'),
        manager: {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
        },
      };
      
      setEmployeeProfile(mockProfile);
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
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="kra">KRA Management</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <Dashboard 
              user={user} 
              stats={stats} 
              exportData={handleExportData} 
              manageCycles={user.role === 'admin' ? handleManageCycles : undefined} 
            />
          </TabsContent>
          
          <TabsContent value="kra" className="mt-6">
            <KraManagement user={user} />
          </TabsContent>
          
          <TabsContent value="profile" className="mt-6">
            {employeeProfile && <EmployeeProfile employee={employeeProfile} />}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DashboardPage;
