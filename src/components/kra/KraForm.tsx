
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';

interface KraFormProps {
  user: User;
  onSuccess: () => void;
}

const KraForm: React.FC<KraFormProps> = ({ user, onSuccess }) => {
  const [kraTitle, setKraTitle] = useState('');
  const [kraDescription, setKraDescription] = useState('');
  const [importance, setImportance] = useState('medium');
  const [urgency, setUrgency] = useState('medium');

  const [kpis, setKpis] = useState([
    { description: '', target: '', unit: '', weight: 0 }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate total weight to ensure it's 100%
  const totalWeight = kpis.reduce((sum, kpi) => sum + (parseInt(kpi.weight.toString()) || 0), 0);
  const isWeightValid = totalWeight === 100;

  const addKpi = () => {
    setKpis([...kpis, { description: '', target: '', unit: '', weight: 0 }]);
  };

  const removeKpi = (index: number) => {
    if (kpis.length > 1) {
      setKpis(kpis.filter((_, i) => i !== index));
    }
  };

  const handleKpiChange = (index: number, field: string, value: string | number) => {
    const updatedKpis = [...kpis];
    (updatedKpis[index] as any)[field] = value;
    setKpis(updatedKpis);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!kraTitle) {
      toast({
        variant: "destructive",
        title: "Missing title",
        description: "Please enter a KRA title",
      });
      return;
    }
    
    if (!isWeightValid) {
      toast({
        variant: "destructive",
        title: "Invalid weights",
        description: "Total KPI weight must equal 100%",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      console.log("Submitting KRA:", {
        title: kraTitle,
        description: kraDescription,
        importance,
        urgency,
        kpis,
        employeeId: user.id,
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setKraTitle('');
      setKraDescription('');
      setImportance('medium');
      setUrgency('medium');
      setKpis([{ description: '', target: '', unit: '', weight: 0 }]);
      
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit KRA",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="kra-title">KRA Title</Label>
          <Input
            id="kra-title"
            value={kraTitle}
            onChange={(e) => setKraTitle(e.target.value)}
            placeholder="e.g., Increase Sales Revenue"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="kra-description">Description</Label>
          <Textarea
            id="kra-description"
            value={kraDescription}
            onChange={(e) => setKraDescription(e.target.value)}
            placeholder="Describe the purpose and scope of this KRA"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="importance">Importance</Label>
            <Select value={importance} onValueChange={setImportance}>
              <SelectTrigger>
                <SelectValue placeholder="Select importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Key Performance Indicators</h4>
        </div>
        
        {kpis.map((kpi, index) => (
          <Card key={index} className="border">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h6 className="text-sm font-medium">KPI #{index + 1}</h6>
                {kpis.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKpi(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`kpi-${index}`}>Description</Label>
                <Textarea
                  id={`kpi-${index}`}
                  value={kpi.description}
                  onChange={(e) => handleKpiChange(index, 'description', e.target.value)}
                  placeholder="e.g., Achieve quarterly sales target"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`target-${index}`}>Target</Label>
                  <Input
                    id={`target-${index}`}
                    value={kpi.target}
                    onChange={(e) => handleKpiChange(index, 'target', e.target.value)}
                    placeholder="e.g., 100,000"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`unit-${index}`}>Unit</Label>
                  <Input
                    id={`unit-${index}`}
                    value={kpi.unit}
                    onChange={(e) => handleKpiChange(index, 'unit', e.target.value)}
                    placeholder="e.g., USD, Units, %"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`weight-${index}`}>Weight (%)</Label>
                  <Input
                    id={`weight-${index}`}
                    type="number"
                    min="0"
                    max="100"
                    value={kpi.weight}
                    onChange={(e) => handleKpiChange(index, 'weight', parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addKpi}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" /> Add KPI
        </Button>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-medium mr-2">Total Weight:</span>
            <span className={`${isWeightValid ? 'text-green-600' : 'text-red-600'} font-bold`}>
              {totalWeight}%
            </span>
            {!isWeightValid && (
              <div className="flex items-center ml-2 text-red-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span className="text-xs">Must equal 100%</span>
              </div>
            )}
          </div>
          <Button type="submit" disabled={isLoading || !isWeightValid}>
            {isLoading ? 'Submitting...' : 'Submit KRA for Validation'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default KraForm;
