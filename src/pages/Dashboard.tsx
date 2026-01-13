import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { TrackerCard } from '@/components/TrackerCard';
import { CreateTrackerDialog } from '@/components/CreateTrackerDialog';
import { Plus, LogOut, Sparkles, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { Tracker } from '@/types/tracker';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const q = query(
      collection(db, 'trackers'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trackersData: Tracker[] = [];
      snapshot.forEach((doc) => {
        trackersData.push({ id: doc.id, ...doc.data() } as Tracker);
      });
      setTrackers(trackersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching trackers:', error);
      toast.error('Failed to load trackers');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleCreateTracker = async (name: string, icon: string) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, 'trackers'), {
        userId: currentUser.uid,
        name,
        icon,
        keys: [],
        entries: {},
        createdAt: new Date()
      });
      toast.success('Tracker created! 🎉');
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create tracker');
    }
  };

  const handleDeleteTracker = async (trackerId: string) => {
    try {
      await deleteDoc(doc(db, 'trackers', trackerId));
      toast.success('Tracker deleted');
    } catch (error) {
      toast.error('Failed to delete tracker');
    }
  };

  const handleUpdateTracker = async (trackerId: string, updates: Partial<Tracker>) => {
    try {
      await updateDoc(doc(db, 'trackers', trackerId), updates);
    } catch (error) {
      toast.error('Failed to update tracker');
    }
  };

  const calculateProgress = (tracker: Tracker) => {
    const totalDays = 365;
    const filledDays = Object.values(tracker.entries).filter(v => v !== null).length;
    return Math.round((filledDays / totalDays) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 gradient-primary rounded-2xl animate-bounce" />
          <p className="text-muted-foreground">Loading your pixels...</p>
        </div>
      </div>
    );
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
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Year in Pixels
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-xl"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-xl"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Hey there! 👋
          </h2>
          <p className="text-muted-foreground">
            {trackers.length === 0 
              ? "Create your first tracker and start filling pixels!"
              : `You have ${trackers.length} tracker${trackers.length > 1 ? 's' : ''}. Keep going!`
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trackers.map((tracker) => (
            <TrackerCard
              key={tracker.id}
              tracker={tracker}
              progress={calculateProgress(tracker)}
              onDelete={() => handleDeleteTracker(tracker.id)}
              onUpdate={(updates) => handleUpdateTracker(tracker.id, updates)}
            />
          ))}

          <button
            onClick={() => setCreateDialogOpen(true)}
            className="min-h-[200px] border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary/60 hover:bg-primary/5 transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus className="w-7 h-7 text-primary" />
            </div>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
              New Tracker
            </span>
          </button>
        </div>
      </main>

      <CreateTrackerDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateTracker}
      />
    </div>
  );
};

export default Dashboard;
