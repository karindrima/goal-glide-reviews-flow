
import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, FileText } from 'lucide-react';

interface TeamMembersProps {
  managerId: string;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ managerId }) => {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchTeamMembers = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        // Mock team members data
        const mockTeamMembers: User[] = [
          { id: '101', name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'employee', managerId },
          { id: '102', name: 'Bob Smith', email: 'bob.smith@example.com', role: 'employee', managerId },
          { id: '103', name: 'Charlie Brown', email: 'charlie.brown@example.com', role: 'employee', managerId },
          { id: '104', name: 'Diana Prince', email: 'diana.prince@example.com', role: 'employee', managerId },
        ];
        
        setTeamMembers(mockTeamMembers);
        setLoading(false);
      }, 500);
    };
    
    fetchTeamMembers();
  }, [managerId]);
  
  const viewEmployeeKras = (employeeId: string, employeeName: string) => {
    toast({
      title: "Viewing KRAs",
      description: `Viewing ${employeeName}'s KRAs`,
    });
    // In a real app, this would navigate to a detailed view or open a modal
    console.log(`View KRAs for employee ${employeeId}`);
  };
  
  if (loading) {
    return <p className="text-center py-8">Loading team members...</p>;
  }
  
  if (teamMembers.length === 0) {
    return <p className="text-center py-8">No team members found.</p>;
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    {member.name}
                  </div>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell className="capitalize">{member.role}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => viewEmployeeKras(member.id, member.name)}
                  >
                    <FileText className="h-4 w-4" />
                    View KRAs
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TeamMembers;
