
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@/types';
import KraList from '@/components/kra/KraList';
import KraForm from '@/components/kra/KraForm';
import { useToast } from '@/hooks/use-toast';

interface KraManagementProps {
  user: User;
}

const KraManagement: React.FC<KraManagementProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('view');
  const { toast } = useToast();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>KRA Management</CardTitle>
        <CardDescription>
          Manage your Key Result Areas (KRAs) and Key Performance Indicators (KPIs)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View KRAs</TabsTrigger>
            <TabsTrigger value="add">Add KRA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="mt-4">
            <KraList user={user} />
          </TabsContent>
          
          <TabsContent value="add" className="mt-4">
            <KraForm 
              user={user}
              onSuccess={() => {
                setActiveTab('view');
                toast({
                  title: "KRA Submitted",
                  description: "Your KRA has been submitted for manager validation",
                });
              }}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default KraManagement;
