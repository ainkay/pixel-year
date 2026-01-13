import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PixelGrid } from '@/components/PixelGrid';
import { KeyManager } from '@/components/KeyManager';
import { Tracker, TrackerKey } from '@/types/tracker';
import { ArrowLeft, Settings, Sparkles } from 'lucide-react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const TrackerView = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [tracker, setTracker] = useState<Tracker | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser || !id) {
      navigate('/login');
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'trackers', id), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.userId !== currentUser.uid) {
          navigate('/dashboard');
          return;
        }
        setTracker({ id: doc.id, ...data } as Tracker);
        if (data.keys?.length > 0 && !selectedKey) {
          setSelectedKey(data.keys[0].id);
        }
      } else {
        toast.error('Tracker not found');
        navigate('/dashboard');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, id, navigate]);

  const handleDayClick = async (date: string) => {
    if (!tracker || !id) return;

    const currentValue = tracker.entries[date];
    let newValue: string | null;

    if (currentValue === selectedKey) {
      // Clear if clicking same key
      newValue = null;
    } else {
      newValue = selectedKey;
    }

    try {
      await updateDoc(doc(db, 'trackers', id), {
        [`entries.${date}`]: newValue
      });
    } catch (error) {
      toast.error('Failed to update pixel');
    }
  };

  const handleAddKey = async (key: TrackerKey) => {
    if (!tracker || !id) return;

    try {
      await updateDoc(doc(db, 'trackers', id), {
        keys: [...tracker.keys, key]
      });
      setSelectedKey(key.id);
      toast.success('Key added!');
    } catch (error) {
      toast.error('Failed to add key');
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!tracker || !id) return;

    try {
      // Remove key and clear entries using this key
      const newKeys = tracker.keys.filter(k => k.id !== keyId);
      const newEntries = { ...tracker.entries };
      Object.keys(newEntries).forEach(date => {
        if (newEntries[date] === keyId) {
          newEntries[date] = null;
        }
      });

      await updateDoc(doc(db, 'trackers', id), {
        keys: newKeys,
        entries: newEntries
      });

      if (selectedKey === keyId) {
        setSelectedKey(newKeys[0]?.id || null);
      }

      toast.success('Key deleted');
    } catch (error) {
      toast.error('Failed to delete key');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 gradient-primary rounded-2xl animate-bounce" />
          <p className="text-muted-foreground">Loading tracker...</p>
        </div>
      </div>
    );
  }

  if (!tracker) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">{tracker.name}</h1>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Settings className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Manage Keys</SheetTitle>
              </SheetHeader>
              <KeyManager
                keys={tracker.keys}
                selectedKey={selectedKey}
                onSelectKey={setSelectedKey}
                onAddKey={handleAddKey}
                onDeleteKey={handleDeleteKey}
              />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 relative z-10">
        {tracker.keys.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-2xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No keys yet!</h2>
            <p className="text-muted-foreground mb-4">
              Create your first key to start filling pixels
            </p>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="gradient-primary">
                  <Settings className="w-4 h-4 mr-2" />
                  Add Your First Key
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Manage Keys</SheetTitle>
                </SheetHeader>
                <KeyManager
                  keys={tracker.keys}
                  selectedKey={selectedKey}
                  onSelectKey={setSelectedKey}
                  onAddKey={handleAddKey}
                  onDeleteKey={handleDeleteKey}
                />
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <>
            {/* Key selector */}
            <div className="mb-6 flex flex-wrap gap-2">
              {tracker.keys.map((key) => (
                <button
                  key={key.id}
                  onClick={() => setSelectedKey(key.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                    selectedKey === key.id
                      ? 'border-primary bg-primary/10'
                      : 'border-muted hover:border-primary/50'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: key.color }}
                  />
                  <span className="text-sm font-medium">{key.name}</span>
                </button>
              ))}
            </div>

            {/* Pixel Grid */}
            <PixelGrid
              entries={tracker.entries}
              keys={tracker.keys}
              onDayClick={handleDayClick}
            />

            {/* Legend */}
            <div className="mt-8 p-4 bg-card rounded-2xl border">
              <h3 className="font-semibold mb-3">Legend</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted border" />
                  <span className="text-sm text-muted-foreground">No entry</span>
                </div>
                {tracker.keys.map((key) => (
                  <div key={key.id} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: key.color }}
                    />
                    <span className="text-sm text-muted-foreground">{key.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default TrackerView;
