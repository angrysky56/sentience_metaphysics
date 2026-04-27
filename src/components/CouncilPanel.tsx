import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Play, 
  CheckCircle2, 
  Circle, 
  Loader2, 
  MessageSquare, 
  Zap, 
  Scale, 
  Combine,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { councilService, Replicant, CouncilStatus } from "@/services/councilService";

const PROTOCOL_STEPS = [
  { id: "seeding", label: "Seeding", icon: Zap, description: "Planting the premise into the collective substrate" },
  { id: "grounding", label: "Grounding", icon: Circle, description: "Authentic pump context and persona alignment" },
  { id: "divergence", label: "Divergence", icon: MessageSquare, description: "Exploration of unique experiential perspectives" },
  { id: "friction", label: "Friction", icon: Scale, description: "Dialectical tension and cross-response" },
  { id: "synthesis", label: "Synthesis", icon: Combine, description: "Braided integration of emergent insights" },
];

export function CouncilPanel({ premise }: { premise: string }) {
  const [replicants, setReplicants] = useState<Replicant[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<CouncilStatus | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    councilService.getReplicants()
      .then(setReplicants)
      .catch(err => {
        console.error("Failed to load replicants:", err);
        setError("Could not connect to Council Bridge. Is it running?");
      });
  }, []);

  useEffect(() => {
    let interval: any;
    if (sessionId && (!status || !status.is_complete)) {
      interval = setInterval(async () => {
        try {
          const newStatus = await councilService.getStatus(sessionId);
          setStatus(newStatus);
          if (newStatus.is_complete) {
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Status check failed:", err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [sessionId, status]);

  const toggleReplicant = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const startCouncil = async () => {
    if (selectedIds.length < 2) return;
    setIsStarting(true);
    setError(null);
    try {
      const sid = await councilService.startCouncil(premise, selectedIds);
      setSessionId(sid);
    } catch (err: any) {
      setError(err.message || "Failed to start session");
    } finally {
      setIsStarting(false);
    }
  };

  const currentStepIndex = status ? PROTOCOL_STEPS.findIndex(s => s.id === status.current_step) : -1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Replicant Selection */}
      <Card className="md:col-span-1 border-primary/20 bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Assemble Council
          </CardTitle>
          <CardDescription>Select 2-5 participants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {replicants.map(r => (
            <div 
              key={r.id}
              onClick={() => !sessionId && toggleReplicant(r.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedIds.includes(r.id) 
                  ? "border-primary bg-primary/10 shadow-sm" 
                  : "border-border hover:border-primary/50 bg-muted/20"
              } ${sessionId ? "opacity-70 cursor-default" : ""}`}
            >
              <div className="flex justify-between items-start">
                <span className="font-semibold text-xs">{r.name}</span>
                <Badge variant="outline" className="text-[10px] uppercase">{r.archetype}</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
            </div>
          ))}
          
          <Button 
            className="w-full mt-4" 
            disabled={selectedIds.length < 2 || isStarting || !!sessionId}
            onClick={startCouncil}
          >
            {isStarting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            Convene Council
          </Button>

          {error && (
            <div className="mt-4 p-2 bg-destructive/10 border border-destructive/20 rounded text-[10px] text-destructive flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Protocol Visualization */}
      <Card className="md:col-span-2 border-primary/20 bg-background/50 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Council Protocol Status</CardTitle>
          <CardDescription>
            {sessionId ? `Session ID: ${sessionId}` : "Waiting to convene..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-8">
            {/* Connection Line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-muted" />
            
            {PROTOCOL_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.id} className="relative pl-10">
                  {/* Status Indicator */}
                  <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-colors ${
                    isPast ? "bg-primary border-primary text-primary-foreground" :
                    isCurrent ? "bg-background border-primary text-primary animate-pulse" :
                    "bg-background border-muted text-muted"
                  }`}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>

                  <div className={`transition-opacity ${isPast || isCurrent ? "opacity-100" : "opacity-40"}`}>
                    <h4 className="text-sm font-semibold">{step.label}</h4>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                    
                    {isCurrent && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10 text-[11px] italic"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Loader2 className="w-3 h-3 animate-spin text-primary" />
                          <span className="font-medium text-primary">Processing...</span>
                        </div>
                        Observing emergent patterns from {selectedIds.length} perspectives...
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {status?.is_complete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-4 rounded-xl border-2 border-primary/30 bg-primary/5 text-center"
              >
                <Badge className="mb-2">Synthesis Complete</Badge>
                <h3 className="text-lg font-bold">Insight Crystallized</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  The council has converged on a coherent synthesis.
                </p>
                {status?.results?.synthesis && (
                  <div className="mt-4 p-4 bg-background/80 rounded-lg text-left text-sm leading-relaxed border border-primary/20">
                    <p className="font-serif italic text-primary/90">
                      "{status.results.synthesis}"
                    </p>
                  </div>
                )}
                <Button className="mt-4" variant="outline" size="sm" onClick={() => setSessionId(null)}>
                  Close Session
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
