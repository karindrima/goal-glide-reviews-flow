
import React, { useState, useEffect } from 'react';
import { Kra } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Calendar, User as UserIcon, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PendingKrasProps {
  managerId: string;
}

interface ExtendedKra extends Kra {
  employeeName: string;
  employeeEmail: string;
}

const PendingKras: React.FC<PendingKrasProps> = ({ managerId }) => {
  const [pendingKras, setPendingKras] = useState<ExtendedKra[]>([]);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchPendingKras = () => {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        // Mock pending KRAs data
        const mockPendingKras: ExtendedKra[] = [
          {
            id: '201',
            employeeId: '101',
            employeeName: 'Alice Johnson',
            employeeEmail: 'alice.johnson@example.com',
            cycleId: '1',
            title: 'Improve Customer Satisfaction',
            description: 'Focus on increasing customer satisfaction scores through better service',
            status: 'pending_validation',
            importance: 'high',
            urgency: 'high',
            endDate: new Date('2025-03-31'),
            progress: 0,
            kpis: [
              {
                id: '2001',
                kraId: '201',
                description: 'Increase NPS score',
                target: '8.5',
                unit: 'score',
                weight: 60,
                progress: 0,
                status: 'not_started'
              },
              {
                id: '2002',
                kraId: '201',
                description: 'Reduce customer complaints',
                target: '30',
                unit: '%',
                weight: 40,
                progress: 0,
                status: 'not_started'
              }
            ]
          },
          {
            id: '202',
            employeeId: '102',
            employeeName: 'Bob Smith',
            employeeEmail: 'bob.smith@example.com',
            cycleId: '1',
            title: 'Process Optimization',
            description: 'Streamline internal processes to increase efficiency',
            status: 'pending_validation',
            importance: 'medium',
            urgency: 'medium',
            endDate: new Date('2024-12-15'),
            progress: 0,
            kpis: [
              {
                id: '2003',
                kraId: '202',
                description: 'Document current processes',
                target: '100',
                unit: '%',
                weight: 30,
                progress: 0,
                status: 'not_started'
              },
              {
                id: '2004',
                kraId: '202',
                description: 'Implement automation for repetitive tasks',
                target: '5',
                unit: 'tasks',
                weight: 70,
                progress: 0,
                status: 'not_started'
              }
            ]
          }
        ];
        
        setPendingKras(mockPendingKras);
        setLoading(false);
      }, 500);
    };
    
    fetchPendingKras();
  }, [managerId]);
  
  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const validateKra = (kraId: string, employeeName: string) => {
    // In a real app, this would send an API request to validate the KRA
    setPendingKras(prevKras => 
      prevKras.filter(kra => kra.id !== kraId)
    );
    
    toast({
      title: "KRA Validated",
      description: `You have validated ${employeeName}'s KRA`,
    });
  };
  
  const rejectKra = (kraId: string, employeeName: string) => {
    // In a real app, this would send an API request to reject the KRA
    setPendingKras(prevKras => 
      prevKras.filter(kra => kra.id !== kraId)
    );
    
    toast({
      title: "KRA Rejected",
      description: `You have rejected ${employeeName}'s KRA`,
      variant: "destructive",
    });
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
  
  if (loading) {
    return <p className="text-center py-8">Loading pending KRAs...</p>;
  }
  
  if (pendingKras.length === 0) {
    return <p className="text-center py-8">No KRAs pending validation.</p>;
  }
  
  return (
    <div className="space-y-4">
      {pendingKras.map((kra) => (
        <Collapsible 
          key={kra.id} 
          open={openItems[kra.id]} 
          onOpenChange={() => toggleItem(kra.id)}
          className="border rounded-lg"
        >
          <CollapsibleTrigger asChild>
            <div className="p-4 cursor-pointer hover:bg-muted/50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="h-4 w-4" />
                    <span className="font-medium text-sm">{kra.employeeName}</span>
                    <span className="text-sm text-muted-foreground">{kra.employeeEmail}</span>
                  </div>
                  <h3 className="font-semibold">{kra.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{kra.description}</p>
                  <div className="flex flex-wrap gap-2 items-center text-xs mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Due: {kra.endDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Importance:</span>
                      {getImportanceBadge(kra.importance)}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Urgency:</span>
                      {getUrgencyBadge(kra.urgency)}
                    </div>
                  </div>
                </div>
                <div>
                  {openItems[kra.id] ? 
                    <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  }
                </div>
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
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium">{kpi.description}</h5>
                          <div className="text-sm flex items-center gap-2 mt-1">
                            <span>Target: {kpi.target} {kpi.unit}</span>
                            <span>•</span>
                            <span>Weight: {kpi.weight}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  className="border-red-300 text-red-700 hover:text-red-800 flex items-center gap-1"
                  onClick={() => rejectKra(kra.id, kra.employeeName)}
                >
                  <X className="h-4 w-4" />
                  Reject KRA
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                  onClick={() => validateKra(kra.id, kra.employeeName)}
                >
                  <Check className="h-4 w-4" />
                  Validate KRA
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default PendingKras;
