
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { User, ReviewCycle } from '@/types';

interface GoalAssignmentFormProps {
  employees: User[];
  cycles: ReviewCycle[];
  onSubmit: (data: any) => Promise<void>;
}

const GoalAssignmentForm: React.FC<GoalAssignmentFormProps> = ({ employees, cycles, onSubmit }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedCycle, setSelectedCycle] = useState<string>('');
  const [kras, setKras] = useState<Array<{
    title: string;
    kpis: Array<{
      description: string;
      target: string;
      unit: string;
      weight: number;
    }>;
  }>>([
    {
      title: '',
      kpis: [{ description: '', target: '', unit: '', weight: 0 }],
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate total weight to ensure it's 100%
  const totalWeight = kras.reduce(
    (sum, kra) => sum + kra.kpis.reduce((kpiSum, kpi) => kpiSum + (kpi.weight || 0), 0),
    0
  );
  
  const isWeightValid = totalWeight === 100;

  const addKra = () => {
    setKras([
      ...kras,
      {
        title: '',
        kpis: [{ description: '', target: '', unit: '', weight: 0 }],
      },
    ]);
  };

  const removeKra = (kraIndex: number) => {
    setKras(kras.filter((_, index) => index !== kraIndex));
  };

  const addKpi = (kraIndex: number) => {
    const updatedKras = [...kras];
    updatedKras[kraIndex].kpis.push({ description: '', target: '', unit: '', weight: 0 });
    setKras(updatedKras);
  };

  const removeKpi = (kraIndex: number, kpiIndex: number) => {
    const updatedKras = [...kras];
    updatedKras[kraIndex].kpis = updatedKras[kraIndex].kpis.filter((_, index) => index !== kpiIndex);
    setKras(updatedKras);
  };

  const handleKraChange = (index: number, value: string) => {
    const updatedKras = [...kras];
    updatedKras[index].title = value;
    setKras(updatedKras);
  };

  const handleKpiChange = (kraIndex: number, kpiIndex: number, field: string, value: string | number) => {
    const updatedKras = [...kras];
    updatedKras[kraIndex].kpis[kpiIndex][field as keyof typeof updatedKras[typeof kraIndex]['kpis'][typeof kpiIndex]] = value;
    setKras(updatedKras);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWeightValid) {
      toast({
        variant: "destructive",
        title: "Invalid weights",
        description: "Total weight must equal 100%",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onSubmit({
        employeeId: selectedEmployee,
        cycleId: selectedCycle,
        kras,
      });
      
      toast({
        title: "Success",
        description: "Goals assigned successfully",
      });
      
      // Reset form
      setSelectedEmployee('');
      setSelectedCycle('');
      setKras([
        {
          title: '',
          kpis: [{ description: '', target: '', unit: '', weight: 0 }],
        },
      ]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign goals",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assign Goals</CardTitle>
        <CardDescription>
          Create Key Result Areas (KRAs) and Key Performance Indicators (KPIs)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cycle">Review Cycle</Label>
              <Select value={selectedCycle} onValueChange={setSelectedCycle} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select review cycle" />
                </SelectTrigger>
                <SelectContent>
                  {cycles.map((cycle) => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      {cycle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-6">
            {kras.map((kra, kraIndex) => (
              <div key={kraIndex} className="border rounded-md p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">KRA #{kraIndex + 1}</h4>
                  {kras.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeKra(kraIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`kra-${kraIndex}`}>KRA Title</Label>
                  <Input
                    id={`kra-${kraIndex}`}
                    value={kra.title}
                    onChange={(e) => handleKraChange(kraIndex, e.target.value)}
                    placeholder="e.g., Increase Sales Revenue"
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <h5 className="text-sm font-medium">KPIs</h5>
                  
                  {kra.kpis.map((kpi, kpiIndex) => (
                    <div key={kpiIndex} className="border-l-2 pl-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h6 className="text-sm font-medium">KPI #{kpiIndex + 1}</h6>
                        {kra.kpis.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeKpi(kraIndex, kpiIndex)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`kpi-${kraIndex}-${kpiIndex}`}>Description</Label>
                        <Textarea
                          id={`kpi-${kraIndex}-${kpiIndex}`}
                          value={kpi.description}
                          onChange={(e) => handleKpiChange(kraIndex, kpiIndex, 'description', e.target.value)}
                          placeholder="e.g., Achieve quarterly sales target"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`target-${kraIndex}-${kpiIndex}`}>Target</Label>
                          <Input
                            id={`target-${kraIndex}-${kpiIndex}`}
                            value={kpi.target}
                            onChange={(e) => handleKpiChange(kraIndex, kpiIndex, 'target', e.target.value)}
                            placeholder="e.g., 100,000"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`unit-${kraIndex}-${kpiIndex}`}>Unit</Label>
                          <Input
                            id={`unit-${kraIndex}-${kpiIndex}`}
                            value={kpi.unit}
                            onChange={(e) => handleKpiChange(kraIndex, kpiIndex, 'unit', e.target.value)}
                            placeholder="e.g., USD, Units, %"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`weight-${kraIndex}-${kpiIndex}`}>Weight (%)</Label>
                          <Input
                            id={`weight-${kraIndex}-${kpiIndex}`}
                            type="number"
                            min="0"
                            max="100"
                            value={kpi.weight}
                            onChange={(e) => handleKpiChange(kraIndex, kpiIndex, 'weight', parseInt(e.target.value))}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addKpi(kraIndex)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add KPI
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addKra}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" /> Add KRA
            </Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-medium mr-2">Total Weight:</span>
              <span className={`${isWeightValid ? 'text-kra-success' : 'text-kra-danger'} font-bold`}>
                {totalWeight}%
              </span>
              {!isWeightValid && (
                <div className="flex items-center ml-2 text-kra-danger">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Must equal 100%</span>
                </div>
              )}
            </div>
            <Button type="submit" disabled={isLoading || !isWeightValid}>
              {isLoading ? 'Saving...' : 'Assign Goals'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalAssignmentForm;
