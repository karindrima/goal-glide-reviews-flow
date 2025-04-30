
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardStats, ReviewCycle, User, UserRole } from '@/types';
import { AlertTriangle, Calendar, CheckCircle, Clock, Download, FileText, PieChart, UserCircle } from 'lucide-react';

interface DashboardProps {
  user: User;
  stats: DashboardStats;
  exportData?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, stats, exportData }) => {
  const { activeCycle, activeWindow, employeesWithGoals, totalEmployees, completedReviews, pendingReviews } = stats;
  
  const goalsCompletionRate = totalEmployees > 0 ? (employeesWithGoals / totalEmployees) * 100 : 0;
  const reviewsCompletionRate = (completedReviews + pendingReviews) > 0 
    ? (completedReviews / (completedReviews + pendingReviews)) * 100 
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">
            {user.role === 'admin' ? 'Admin Dashboard' : user.role === 'manager' ? 'Manager Dashboard' : 'Employee Dashboard'}
          </p>
        </div>
        
        {user.role === 'admin' && activeCycle?.status === 'closed' && (
          <Button onClick={exportData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cycle</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {activeCycle ? activeCycle.name : 'No Active Cycle'}
            </div>
            {activeCycle && (
              <p className="text-xs text-muted-foreground">
                {new Date(activeCycle.startDate).toLocaleDateString()} - {new Date(activeCycle.endDate).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Window</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {activeWindow ? activeWindow.label : 'None'}
            </div>
            {activeWindow && (
              <p className="text-xs text-muted-foreground">
                Closes on {new Date(activeWindow.closeDate).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Set</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{employeesWithGoals} of {totalEmployees}</div>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-muted-foreground">Completion rate</p>
              <Progress value={goalsCompletionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Completed</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{completedReviews} of {completedReviews + pendingReviews}</div>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-muted-foreground">Completion rate</p>
              <Progress value={reviewsCompletionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pending">Pending Actions</TabsTrigger>
          <TabsTrigger value="completed">Recently Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {!activeWindow ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-2">
                  <Calendar className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No Upcoming Windows</h3>
                <p className="text-sm text-muted-foreground">
                  There are no upcoming review windows scheduled.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Review Window</CardTitle>
                <CardDescription>
                  Prepare for the upcoming review cycle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Window:</span>
                  <span>{activeWindow.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Opens:</span>
                  <span>{new Date(activeWindow.openDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Closes:</span>
                  <span>{new Date(activeWindow.closeDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                {user.role === 'employee' && (
                  <Button variant="outline" className="w-full">Prepare Self Review</Button>
                )}
                {(user.role === 'manager' || user.role === 'admin') && (
                  <Button variant="outline" className="w-full">Review Dashboard</Button>
                )}
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingReviews === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-2">
                  <CheckCircle className="h-10 w-10 text-kra-success" />
                </div>
                <h3 className="text-lg font-medium">No Pending Actions</h3>
                <p className="text-sm text-muted-foreground">
                  You're all caught up! There are no pending actions requiring your attention.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Pending Actions</CardTitle>
                <CardDescription>
                  Actions that require your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.role === 'employee' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-kra-warning mr-2" />
                        <span>Complete your self review for {activeWindow?.label}</span>
                      </div>
                      <Button size="sm">Start Review</Button>
                    </div>
                  )}
                  {user.role === 'manager' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-kra-warning mr-2" />
                        <span>{pendingReviews} team members pending review</span>
                      </div>
                      <Button size="sm">Review Team</Button>
                    </div>
                  )}
                  {user.role === 'admin' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-kra-warning mr-2" />
                        <span>{totalEmployees - employeesWithGoals} employees without goals</span>
                      </div>
                      <Button size="sm">View Details</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Completed</CardTitle>
              <CardDescription>
                Recent activities and completed reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedReviews > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-kra-success mr-2" />
                        <span>Completed Q1 2024 review</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <UserCircle className="h-5 w-5 text-muted-foreground mr-2" />
                        <span>Updated employee goals</span>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No recently completed activities</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
