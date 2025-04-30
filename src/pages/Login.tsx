
import React, { useState } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { useToast } from '@/components/ui/toast';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '@/types';

// This is a mock login function that would be replaced with real authentication
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock users for demonstration
  const users: Record<string, User> = {
    'admin@company.com': {
      id: '1',
      name: 'Admin User',
      email: 'admin@company.com',
      role: 'admin',
    },
    'manager@company.com': {
      id: '2',
      name: 'Manager User',
      email: 'manager@company.com',
      role: 'manager',
    },
    'employee@company.com': {
      id: '3',
      name: 'Employee User',
      email: 'employee@company.com',
      role: 'employee',
      managerId: '2',
    },
  };
  
  const user = users[email];
  
  if (user && password === 'password') {
    return user;
  }
  
  throw new Error('Invalid email or password');
};

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const user = await mockLogin(email, password);
      
      // Store user in session storage
      sessionStorage.setItem('user', JSON.stringify(user));
      
      navigate('/dashboard');
      
      toast({
        title: "Login successful",
        description: `Welcome, ${user.name}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-3xl font-bold text-kra-blue">KRA & Review System</h1>
        <p className="text-muted-foreground mt-2">
          Manage performance reviews and goals for your organization
        </p>
      </div>
      
      <AuthForm onLogin={handleLogin} />
      
      <div className="mt-8 text-center max-w-md">
        <h2 className="text-sm font-medium mb-2">Demo Accounts</h2>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="border rounded p-2">
            <p className="font-medium">Admin</p>
            <p className="text-muted-foreground">admin@company.com</p>
            <p className="text-muted-foreground">password</p>
          </div>
          <div className="border rounded p-2">
            <p className="font-medium">Manager</p>
            <p className="text-muted-foreground">manager@company.com</p>
            <p className="text-muted-foreground">password</p>
          </div>
          <div className="border rounded p-2">
            <p className="font-medium">Employee</p>
            <p className="text-muted-foreground">employee@company.com</p>
            <p className="text-muted-foreground">password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
