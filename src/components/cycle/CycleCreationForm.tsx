
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast'; // Changed from @/components/ui/toast
import { CycleCreationFormData, ReviewFrequency } from '@/types';

interface CycleCreationFormProps {
  onSubmit: (data: CycleCreationFormData) => Promise<void>;
}

const CycleCreationForm: React.FC<CycleCreationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CycleCreationFormData>({
    name: '',
    startDate: '',
    endDate: '',
    frequency: 'quarterly',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFrequencyChange = (value: ReviewFrequency) => {
    setFormData((prev) => ({
      ...prev,
      frequency: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit(formData);
      toast({
        title: "Success",
        description: "Review cycle created successfully",
      });
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        frequency: 'quarterly',
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create review cycle",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Review Cycle</CardTitle>
        <CardDescription>
          Set up a new performance review cycle with automatic review windows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Cycle Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="FY 2024-25 Performance Cycle"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate.toString()}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate.toString()}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Review Frequency</Label>
            <RadioGroup 
              defaultValue={formData.frequency} 
              onValueChange={(value) => handleFrequencyChange(value as ReviewFrequency)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="quarterly" id="quarterly" />
                <Label htmlFor="quarterly">Quarterly (4 reviews per year)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="half-yearly" id="half-yearly" />
                <Label htmlFor="half-yearly">Half-Yearly (2 reviews per year)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Review Cycle'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <p>Review windows will be automatically generated based on the cycle dates.</p>
      </CardFooter>
    </Card>
  );
};

export default CycleCreationForm;
