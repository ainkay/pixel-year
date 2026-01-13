import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Grid3X3, Palette, Trophy, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Year in Pixels</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="rounded-xl">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="gradient-primary rounded-xl">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Turn your life into pixels
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Year in Pixels
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Make progress visible. Track habits, moods, goals — your way.
            365 pixels. Zero guilt. Pure satisfaction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="gradient-primary rounded-xl h-14 px-8 text-lg">
                Start Your Pixel Year
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-32 max-w-5xl mx-auto">
          {[
            { icon: Grid3X3, title: "Visual Progress", desc: "See your entire year at a glance. Every day becomes a pixel that tells your story." },
            { icon: Palette, title: "Custom Keys", desc: "Create your own rules. Define what each color means. Track anything you want." },
            { icon: Trophy, title: "Gamified Fun", desc: "No boring charts. Just pixels filling up as you live. Dopamine included." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 bg-card rounded-2xl border-2 hover:border-primary/50 transition-all pixel-shadow-sm hover:pixel-shadow">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
