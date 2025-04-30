
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';
import { Mail, User as UserIcon, Users } from 'lucide-react';

interface EmployeeProfileProps {
  employee: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    position: string;
    joinDate: Date;
    manager?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Employee Profile</CardTitle>
        <CardDescription>
          Employee information and details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Personal Information
              </h3>
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="col-span-2 font-medium">{employee.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="col-span-2 text-kra-success">{employee.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="col-span-2 capitalize">{employee.role}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Job Details
              </h3>
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="col-span-2">{employee.department}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Position:</span>
                  <span className="col-span-2">{employee.position}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Join Date:</span>
                  <span className="col-span-2">{new Date(employee.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            {employee.manager && (
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Reporting Manager
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="col-span-2 font-medium">{employee.manager.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="col-span-2 text-kra-success">{employee.manager.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfile;
