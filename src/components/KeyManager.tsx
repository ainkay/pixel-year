import { useState } from 'react';
import { TrackerKey } from '@/types/tracker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const presetColors = [
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#a855f7', // purple
];

interface KeyManagerProps {
  keys: TrackerKey[];
  selectedKey: string | null;
  onSelectKey: (keyId: string | null) => void;
  onAddKey: (key: TrackerKey) => void;
  onDeleteKey: (keyId: string) => void;
}

export const KeyManager = ({ keys, selectedKey, onSelectKey, onAddKey, onDeleteKey }: KeyManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyColor, setNewKeyColor] = useState(presetColors[0]);

  const handleAddKey = () => {
    if (!newKeyName.trim()) return;

    const newKey: TrackerKey = {
      id: `key_${Date.now()}`,
      name: newKeyName.trim(),
      color: newKeyColor,
    };

    onAddKey(newKey);
    setNewKeyName('');
    setNewKeyColor(presetColors[Math.floor(Math.random() * presetColors.length)]);
    setIsAdding(false);
  };

  return (
    <div className="py-6 space-y-6">
      {/* Existing Keys */}
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Your Keys</Label>
        {keys.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No keys yet. Create your first one!
          </p>
        ) : (
          <div className="space-y-2">
            {keys.map((key) => (
              <div
                key={key.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border-2 transition-all",
                  selectedKey === key.id
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/30"
                )}
              >
                <button
                  onClick={() => onSelectKey(key.id)}
                  className="flex items-center gap-3 flex-1"
                >
                  <div
                    className="w-6 h-6 rounded-lg"
                    style={{ backgroundColor: key.color }}
                  />
                  <span className="font-medium">{key.name}</span>
                  {selectedKey === key.id && (
                    <Check className="w-4 h-4 text-primary ml-auto" />
                  )}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteKey(key.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Key */}
      {isAdding ? (
        <div className="space-y-4 p-4 bg-muted/50 rounded-xl">
          <div className="space-y-2">
            <Label htmlFor="keyName">Key Name</Label>
            <Input
              id="keyName"
              placeholder="e.g., Completed, Skipped, Partial..."
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewKeyColor(color)}
                  className={cn(
                    "w-8 h-8 rounded-lg transition-all",
                    newKeyColor === color && "ring-2 ring-primary ring-offset-2"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsAdding(false);
                setNewKeyName('');
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 gradient-primary"
              onClick={handleAddKey}
              disabled={!newKeyName.trim()}
            >
              Add Key
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Key
        </Button>
      )}

      {/* Instructions */}
      <div className="p-4 bg-muted/50 rounded-xl space-y-2">
        <p className="text-sm font-medium">How it works:</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Select a key and click on any pixel to fill it</li>
          <li>• Click the same pixel again to clear it</li>
          <li>• Create as many keys as you need</li>
          <li>• Each key represents a different state or value</li>
        </ul>
      </div>
    </div>
  );
};
