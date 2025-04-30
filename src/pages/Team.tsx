
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { User, Kra } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamMembers from '@/components/team/TeamMembers';
import PendingKras from '@/components/team/PendingKras';
import { useToast } from '@/hooks/use-toast';

const TeamPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('members');
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
    
    // Redirect if not a manager
    if (parsedUser.role !== 'manager') {
      toast({
        title: "Access denied",
        description: "Only managers can access the team management page",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Management</CardTitle>
            <CardDescription>
              Manage your team members and review their KRAs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="members">Team Members</TabsTrigger>
                <TabsTrigger value="pending-kras">Pending KRAs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="members" className="mt-6">
                <TeamMembers managerId={user.id} />
              </TabsContent>
              
              <TabsContent value="pending-kras" className="mt-6">
                <PendingKras managerId={user.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TeamPage;
