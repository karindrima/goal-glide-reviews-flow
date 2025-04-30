
import React, { useState } from 'react';
import { User, Kra, KpiStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Calendar, Target, Flag, AlertTriangle } from 'lucide-react';

interface KraListProps {
  user: User;
}

const KraList: React.FC<KraListProps> = ({ user }) => {
  // Mock data - in a real app, this would come from an API call
  const [kras, setKras] = useState<Kra[]>([
    {
      id: '1',
      employeeId: user.id,
      cycleId: '1',
      title: 'Increase Sales Revenue',
      description: 'Focus on increasing the overall sales revenue for the team',
      status: 'pending_validation',
      importance: 'high',
      urgency: 'medium',
      endDate: new Date('2025-03-31'),
      progress: 25,
      kpis: [
        {
          id: '1',
          kraId: '1',
          description: 'Achieve quarterly sales target',
          target: '100000',
          unit: 'USD',
          weight: 40,
          progress: 30,
          status: 'in_progress'
        },
        {
          id: '2',
          kraId: '1',
          description: 'Increase customer retention rate',
          target: '90',
          unit: '%',
          weight: 60,
          progress: 20,
          status: 'in_progress'
        }
      ]
    },
    {
      id: '2',
      employeeId: user.id,
      cycleId: '1',
      title: 'Improve Team Productivity',
      description: 'Enhance overall team efficiency and output',
      status: 'validated',
      importance: 'medium',
      urgency: 'high',
      endDate: new Date('2024-12-31'),
      progress: 50,
      kpis: [
        {
          id: '3',
          kraId: '2',
          description: 'Reduce average task completion time',
          target: '25',
          unit: '%',
          weight: 50,
          progress: 40,
          status: 'in_progress'
        },
        {
          id: '4',
          kraId: '2',
          description: 'Implement process improvements',
          target: '5',
          unit: 'processes',
          weight: 50,
          progress: 60,
          status: 'in_progress'
        }
      ]
    }
  ]);

  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_validation':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Pending Validation</Badge>;
      case 'validated':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Validated</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch(importance) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-300">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch(urgency) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-300">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const updateKpiProgress = (kraId: string, kpiId: string, newProgress: number) => {
    setKras(prevKras => {
      return prevKras.map(kra => {
        if (kra.id === kraId) {
          // Update the specific KPI
          const updatedKpis = kra.kpis.map(kpi => 
            kpi.id === kpiId ? { ...kpi, progress: newProgress } : kpi
          );
          
          // Calculate new KRA progress based on KPI weights and progress
          const newKraProgress = updatedKpis.reduce((acc, kpi) => 
            acc + (kpi.progress * kpi.weight / 100), 0);
          
          return {
            ...kra,
            kpis: updatedKpis,
            progress: Math.round(newKraProgress)
          };
        }
        return kra;
      });
    });
  };

  if (kras.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No KRAs found. Click on Add KRA to create your first key result area.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {kras.map((kra) => (
        <Collapsible 
          key={kra.id} 
          open={openItems[kra.id]} 
          onOpenChange={() => toggleItem(kra.id)}
          className="border rounded-lg"
        >
          <CollapsibleTrigger asChild>
            <div className="p-4 cursor-pointer hover:bg-muted/50 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{kra.title}</h3>
                  {getStatusBadge(kra.status)}
                </div>
                <div className="text-sm text-muted-foreground mb-2">{kra.description}</div>
                <div className="flex flex-wrap gap-2 items-center text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Due: {kra.endDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flag className="h-3.5 w-3.5" />
                    <span className="mr-1">Importance:</span>
                    {getImportanceBadge(kra.importance)}
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span className="mr-1">Urgency:</span>
                    {getUrgencyBadge(kra.urgency)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{kra.progress}%</span>
                </div>
                <div className="w-24">
                  <Progress value={kra.progress} className="h-2" />
                </div>
                {openItems[kra.id] ? 
                  <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                }
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 pt-0 border-t">
              <h4 className="font-medium mb-3">Key Performance Indicators</h4>
              <div className="space-y-4">
                {kra.kpis.map((kpi) => (
                  <Card key={kpi.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium">{kpi.description}</h5>
                          <div className="text-sm flex items-center gap-2 mt-1">
                            <span>Target: {kpi.target} {kpi.unit}</span>
                            <span>•</span>
                            <span>Weight: {kpi.weight}%</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{kpi.progress}%</div>
                          <div className="w-32 mt-1">
                            <Progress value={kpi.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      {kra.status === 'validated' && user.role === 'employee' && (
                        <div className="mt-4 flex justify-end">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateKpiProgress(kra.id, kpi.id, Math.max(0, kpi.progress - 10))}
                              disabled={kpi.progress <= 0}
                            >
                              -10%
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="min-w-16"
                            >
                              {kpi.progress}%
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateKpiProgress(kra.id, kpi.id, Math.min(100, kpi.progress + 10))}
                              disabled={kpi.progress >= 100}
                            >
                              +10%
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {kra.status === 'pending_validation' && user.role === 'manager' && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" className="border-red-300 text-red-700 hover:text-red-800">
                    Reject KRA
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Validate KRA
                  </Button>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default KraList;
