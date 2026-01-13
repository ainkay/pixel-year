import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tracker } from '@/types/tracker';
import { Trash2, ChevronRight, Droplets, Dumbbell, Book, Brain, Palette, Moon, Heart, Star, Zap, Coffee, Music, Camera } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const iconMap: Record<string, React.ElementType> = {
  droplets: Droplets,
  dumbbell: Dumbbell,
  book: Book,
  brain: Brain,
  palette: Palette,
  moon: Moon,
  heart: Heart,
  star: Star,
  zap: Zap,
  coffee: Coffee,
  music: Music,
  camera: Camera,
};

interface TrackerCardProps {
  tracker: Tracker;
  progress: number;
  onDelete: () => void;
  onUpdate: (updates: Partial<Tracker>) => void;
}

export const TrackerCard = ({ tracker, progress, onDelete }: TrackerCardProps) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[tracker.icon] || Star;

  const getProgressColor = () => {
    if (progress < 25) return 'bg-destructive';
    if (progress < 50) return 'bg-warning';
    if (progress < 75) return 'bg-secondary';
    return 'bg-success';
  };

  const getFilledDays = () => {
    return Object.values(tracker.entries).filter(v => v !== null).length;
  };

  return (
    <Card 
      className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 cursor-pointer pixel-shadow-sm hover:pixel-shadow"
      onClick={() => navigate(`/tracker/${tracker.id}`)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{tracker.name}</h3>
              <p className="text-sm text-muted-foreground">
                {getFilledDays()} / 365 days
              </p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Tracker</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{tracker.name}"? This action cannot be undone and all your pixel data will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Year Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-1">
            {tracker.keys.slice(0, 5).map((key, i) => (
              <div
                key={key.id}
                className="w-6 h-6 rounded-full border-2 border-card"
                style={{ backgroundColor: key.color }}
              />
            ))}
            {tracker.keys.length > 5 && (
              <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium">
                +{tracker.keys.length - 5}
              </div>
            )}
            {tracker.keys.length === 0 && (
              <span className="text-sm text-muted-foreground">No keys yet</span>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </CardContent>
    </Card>
  );
};
