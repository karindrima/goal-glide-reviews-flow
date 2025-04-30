
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast'; // Changed from @/components/ui/toast
import { Assignment, ReviewWindow } from '@/types';

interface SelfReviewFormProps {
  assignments: Assignment[];
  window: ReviewWindow;
  onSubmit: (data: { ratings: Array<{ assignmentId: string; score: number; comment: string }> }) => Promise<void>;
}

const SelfReviewForm: React.FC<SelfReviewFormProps> = ({ assignments, window, onSubmit }) => {
  const [ratings, setRatings] = useState<Array<{ assignmentId: string; score: number; comment: string }>>(
    assignments.map((assignment) => ({
      assignmentId: assignment.id,
      score: 0,
      comment: '',
    }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScoreChange = (index: number, value: string) => {
    const updatedRatings = [...ratings];
    updatedRatings[index].score = parseInt(value, 10);
    setRatings(updatedRatings);
  };

  const handleCommentChange = (index: number, value: string) => {
    const updatedRatings = [...ratings];
    updatedRatings[index].comment = value;
    setRatings(updatedRatings);
  };

  const isFormComplete = ratings.every((rating) => rating.score > 0);

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
      await onSubmit({ ratings });
      toast({
        title: "Success",
        description: "Self review submitted successfully",
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Self Review Form</CardTitle>
        <CardDescription>
          {window.label} ({new Date(window.openDate).toLocaleDateString()} - {new Date(window.closeDate).toLocaleDateString()})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {assignments.map((assignment, index) => (
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
              
              <div className="space-y-2">
                <Label className="text-sm">Your Rating</Label>
                <RadioGroup 
                  value={ratings[index].score.toString()} 
                  onValueChange={(value) => handleScoreChange(index, value)}
                  className="flex space-x-2"
                >
                  {[1, 2, 3, 4, 5].map((score) => (
                    <div key={score} className="flex flex-col items-center">
                      <RadioGroupItem value={score.toString()} id={`score-${index}-${score}`} className="peer sr-only" />
                      <Label
                        htmlFor={`score-${index}-${score}`}
                        className="h-10 w-10 rounded-full flex items-center justify-center border peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white cursor-pointer hover:bg-muted"
                      >
                        {score}
                      </Label>
                      <span className="text-xs mt-1">{getScoreLabel(score).split(' ')[0]}</span>
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground mt-1">
                  {ratings[index].score > 0 ? `Selected: ${getScoreLabel(ratings[index].score)}` : 'Please select a rating'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`comment-${index}`}>Your Comments</Label>
                <Textarea
                  id={`comment-${index}`}
                  value={ratings[index].comment}
                  onChange={(e) => handleCommentChange(index, e.target.value)}
                  placeholder="Share your achievements, challenges, and progress for this goal..."
                  className="min-h-[100px]"
                />
              </div>
              
              {index < assignments.length - 1 && <Separator />}
            </div>
          ))}
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !isFormComplete}>
              {isLoading ? 'Submitting...' : 'Submit Self Review'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Your review will be shared with your manager after submission.
      </CardFooter>
    </Card>
  );
};

export default SelfReviewForm;
