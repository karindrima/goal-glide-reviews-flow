
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/toast';
import { Assignment, Rating, ReviewWindow, User } from '@/types';

interface ManagerReviewFormProps {
  employee: User;
  assignments: Assignment[];
  selfRatings: Rating[];
  window: ReviewWindow;
  onSubmit: (data: { 
    ratings: Array<{ 
      assignmentId: string; 
      managerScore: number; 
      managerComment: string; 
    }> 
  }) => Promise<void>;
}

const ManagerReviewForm: React.FC<ManagerReviewFormProps> = ({ 
  employee, 
  assignments, 
  selfRatings, 
  window, 
  onSubmit 
}) => {
  const [managerRatings, setManagerRatings] = useState<Array<{ 
    assignmentId: string; 
    managerScore: number; 
    managerComment: string; 
  }>>(
    assignments.map((assignment) => ({
      assignmentId: assignment.id,
      managerScore: 0,
      managerComment: '',
    }))
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScoreChange = (index: number, value: string) => {
    const updatedRatings = [...managerRatings];
    updatedRatings[index].managerScore = parseInt(value, 10);
    setManagerRatings(updatedRatings);
  };

  const handleCommentChange = (index: number, value: string) => {
    const updatedRatings = [...managerRatings];
    updatedRatings[index].managerComment = value;
    setManagerRatings(updatedRatings);
  };

  const isFormComplete = managerRatings.every((rating) => rating.managerScore > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormComplete) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please rate all KPIs before submitting",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onSubmit({ ratings: managerRatings });
      toast({
        title: "Success",
        description: "Manager review submitted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit review",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 1: return "Below Expectations";
      case 2: return "Needs Improvement";
      case 3: return "Meets Expectations";
      case 4: return "Exceeds Expectations";
      case 5: return "Outstanding";
      default: return "Select Rating";
    }
  };

  // Find the self rating for a specific assignment
  const getSelfRating = (assignmentId: string) => {
    return selfRatings.find(rating => rating.assignmentId === assignmentId);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manager Review: {employee.name}</CardTitle>
        <CardDescription>
          {window.label} ({new Date(window.openDate).toLocaleDateString()} - {new Date(window.closeDate).toLocaleDateString()})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {assignments.map((assignment, index) => {
            const selfRating = getSelfRating(assignment.id);
            
            return (
              <div key={assignment.id} className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{assignment.kra}</h3>
                  <p className="text-muted-foreground">{assignment.kpi}</p>
                  <div className="mt-2 flex items-center">
                    <span className="text-sm font-medium">Target: </span>
                    <span className="ml-1 text-sm">{assignment.target} {assignment.unit}</span>
                    <span className="ml-3 text-sm font-medium">Weight: </span>
                    <span className="ml-1 text-sm">{assignment.weight}%</span>
                  </div>
                </div>
                
                {selfRating && (
                  <div className="bg-muted/50 p-3 rounded-md space-y-2">
                    <h4 className="text-sm font-medium">Employee Self Rating: {selfRating.score} - {getScoreLabel(selfRating.score)}</h4>
                    <p className="text-sm">{selfRating.comment}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="text-sm">Your Rating</Label>
                  <RadioGroup 
                    value={managerRatings[index].managerScore.toString()} 
                    onValueChange={(value) => handleScoreChange(index, value)}
                    className="flex space-x-2"
                  >
                    {[1, 2, 3, 4, 5].map((score) => (
                      <div key={score} className="flex flex-col items-center">
                        <RadioGroupItem value={score.toString()} id={`manager-score-${index}-${score}`} className="peer sr-only" />
                        <Label
                          htmlFor={`manager-score-${index}-${score}`}
                          className="h-10 w-10 rounded-full flex items-center justify-center border peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white cursor-pointer hover:bg-muted"
                        >
                          {score}
                        </Label>
                        <span className="text-xs mt-1">{getScoreLabel(score).split(' ')[0]}</span>
                      </div>
                    ))}
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground mt-1">
                    {managerRatings[index].managerScore > 0 
                      ? `Selected: ${getScoreLabel(managerRatings[index].managerScore)}` 
                      : 'Please select a rating'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`manager-comment-${index}`}>Your Feedback</Label>
                  <Textarea
                    id={`manager-comment-${index}`}
                    value={managerRatings[index].managerComment}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                    placeholder="Provide constructive feedback, observations, and guidance..."
                    className="min-h-[100px]"
                  />
                </div>
                
                {index < assignments.length - 1 && <Separator />}
              </div>
            );
          })}
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !isFormComplete}>
              {isLoading ? 'Submitting...' : 'Submit Manager Review'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Your review will be shared with the employee after submission.
      </CardFooter>
    </Card>
  );
};

export default ManagerReviewForm;
