import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Droplets, Dumbbell, Book, Brain, Palette, Moon, Heart, Star, Zap, Coffee, Music, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = [
  { id: 'droplets', icon: Droplets, label: 'Water' },
  { id: 'dumbbell', icon: Dumbbell, label: 'Gym' },
  { id: 'book', icon: Book, label: 'Reading' },
  { id: 'brain', icon: Brain, label: 'Mental' },
  { id: 'palette', icon: Palette, label: 'Creative' },
  { id: 'moon', icon: Moon, label: 'Sleep' },
  { id: 'heart', icon: Heart, label: 'Health' },
  { id: 'star', icon: Star, label: 'Goals' },
  { id: 'zap', icon: Zap, label: 'Energy' },
  { id: 'coffee', icon: Coffee, label: 'Habits' },
  { id: 'music', icon: Music, label: 'Music' },
  { id: 'camera', icon: Camera, label: 'Photos' },
];

interface CreateTrackerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, icon: string) => void;
}

export const CreateTrackerDialog = ({ open, onOpenChange, onSubmit }: CreateTrackerDialogProps) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('star');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), selectedIcon);
      setName('');
      setSelectedIcon('star');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Tracker</DialogTitle>
          <DialogDescription>
            Give your tracker a name and pick an icon. You'll add custom keys later!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tracker Name</Label>
            <Input
              id="name"
              placeholder="e.g., Water intake, Gym, Study..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>Choose an Icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {icons.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedIcon(id)}
                  className={cn(
                    "aspect-square rounded-xl flex items-center justify-center transition-all",
                    selectedIcon === id
                      ? "gradient-primary text-primary-foreground scale-110 shadow-lg"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  )}
                  title={label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 gradient-primary"
              disabled={!name.trim()}
            >
              Create Tracker
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
