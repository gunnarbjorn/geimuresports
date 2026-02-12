import { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MessageCircle,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Monitor,
  Play,
  Upload,
  CheckCircle2,
  Info,
  Search,
  Film,
  Settings,
} from "lucide-react";

const DISCORD_INVITE_URL = "https://discord.com/invite/57P9SAy4Fq";

const ALL_CHECK_IDS = [
  // Step 1 - Discord
  "d1", "d2", "d3",
  // Step 2 - Epic
  "e1", "e2", "e3", "e4", "e5", "e6",
  // Step 3 - Yunite
  "y1", "y2", "y3", "y4", "y5",
  // Step 4 - Replay (conditional)
  "r1",
];

export function CompetitorChecklist() {
  const accent = "arena-green";

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({ discord: true });
  const [showVideo, setShowVideo] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showWhyVerified, setShowWhyVerified] = useState(false);
  const [pcAnswer, setPcAnswer] = useState<"yes" | "no" | null>(null);
  const prevCheckedRef = useRef<Record<string, boolean>>({});

  const step1Ids = ["d1", "d2", "d3"];
  const step2Ids = ["e1", "e2", "e3", "e4", "e5", "e6"];
  const step3Ids = ["y1", "y2", "y3", "y4", "y5", "y6"];

  const toggleCheck = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Auto-open next step when current step is completed
  useEffect(() => {
    const allChecked = (ids: string[]) => ids.every((id) => checked[id]);
    const wasAllChecked = (ids: string[]) => ids.every((id) => prevCheckedRef.current[id]);

    // Step 1 just completed → open step 2
    if (allChecked(step1Ids) && !wasAllChecked(step1Ids) && !openSteps["epic"]) {
      setOpenSteps((prev) => ({ ...prev, epic: true }));
    }
    // Step 2 just completed → open step 3
    if (allChecked(step1Ids) && allChecked(step2Ids) && !wasAllChecked(step2Ids) && !openSteps["yunite"]) {
      setOpenSteps((prev) => ({ ...prev, yunite: true }));
    }
    // Step 3 just completed → open step 4
    if (allChecked(step1Ids) && allChecked(step2Ids) && allChecked(step3Ids) && !wasAllChecked(step3Ids) && !openSteps["replay"]) {
      setOpenSteps((prev) => ({ ...prev, replay: true }));
    }

    prevCheckedRef.current = { ...checked };
  }, [checked]);

  const toggleStep = (stepId: string) => {
    setOpenSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const mainChecks = ["d1", "d2", "d3", "e1", "e2", "e3", "e4", "e5", "e6", "y1", "y2", "y3", "y4", "y5", "y6"];
  const pcChecks = pcAnswer === "yes" ? ["r1"] : [];
  const step4Answered = pcAnswer !== null;
  const totalChecks = mainChecks.length + pcChecks.length;
  const checkedCount =
    mainChecks.filter((id) => checked[id]).length +
    pcChecks.filter((id) => checked[id]).length;
  const progressPercentage = totalChecks > 0 ? Math.round((checkedCount / totalChecks) * 100) : 0;
  const allDone = progressPercentage === 100 && step4Answered;

  const scrollToLeikdagur = () => {
    const el = document.querySelector('[data-value="leikdagur"]') || document.getElementById('leikdagur-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Try to open the accordion
      const trigger = el.querySelector('button');
      if (trigger && el.getAttribute('data-state') !== 'open') {
        trigger.click();
      }
    }
  };

  const isStepComplete = (ids: string[]) => ids.every((id) => checked[id]);

  const renderCheck = (id: string, label: React.ReactNode, extra?: React.ReactNode) => (
    <label key={id} className="flex items-center gap-3 cursor-pointer py-1">
      <Checkbox checked={!!checked[id]} onCheckedChange={() => toggleCheck(id)} />
      <span className={`text-sm ${checked[id] ? "text-muted-foreground line-through" : ""}`}>
        {label}
      </span>
      {extra}
    </label>
  );

  const stepHeader = (
    index: number,
    icon: React.ElementType,
    title: string,
    stepId: string,
    checkIds: string[],
    emphasized = false
  ) => {
    const Icon = icon;
    return (
      <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
            emphasized
              ? "bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]"
              : `bg-[hsl(var(--${accent})/0.15)] text-[hsl(var(--${accent}))]`
          }`}>
            {index}
          </span>
          <Icon className={`h-4 w-4 ${
            emphasized ? "text-[hsl(var(--destructive))]" : `text-[hsl(var(--${accent}))]`
          }`} />
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {isStepComplete(checkIds) && (
            <CheckCircle2 className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
          )}
          {openSteps[stepId] ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CollapsibleTrigger>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Card className={`bg-card border-[hsl(var(--${accent})/0.3)]`}>
        <CardContent className="p-5 md:p-6">
          {/* Progress */}
          <div className="mb-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Framvinda</span>
              <span className={`font-bold text-[hsl(var(--${accent}))]`}>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="space-y-3">
            {/* ─── STEP 1 – DISCORD ─── */}
            <Collapsible open={openSteps["discord"]} onOpenChange={() => toggleStep("discord")}>
              <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
                {stepHeader(1, MessageCircle, "Discord", "discord", ["d1", "d2", "d3"])}
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-3 border-t border-border">
                    <div className="mt-3 space-y-2">
                      {renderCheck("d1", "Ég er með Discord")}
                      {renderCheck("d2", "Ég er búin(n) að joina Fortnite Ísland")}
                      {renderCheck("d3", "Ég hef lesið Server Guide",
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Settings className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help ml-1 shrink-0" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[280px] text-xs leading-relaxed">
                            Server Guide er efst í vinstri dálknum inni á Discord server Fortnite Ísland. Þegar þú ert kominn inn á serverinn sérðu rásina "Server Guide". Þar inni eru mikilvægar upplýsingar sem þú verður að lesa.
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Join Discord
                          <ExternalLink className="ml-1.5 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* ─── STEP 2 – EPIC VERIFICATION ─── */}
            <Collapsible open={openSteps["epic"]} onOpenChange={() => toggleStep("epic")}>
              <div className="rounded-xl border border-[hsl(var(--destructive)/0.4)] bg-[hsl(var(--destructive)/0.04)] overflow-hidden">
                {stepHeader(2, ShieldCheck, "Epic Verification", "epic", ["e1", "e2", "e3", "e4", "e5", "e6"], true)}
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-3 border-t border-border">
                    {/* Warning */}
                    <div className="mt-3 flex items-start gap-3 p-3 rounded-lg bg-[hsl(var(--destructive)/0.08)] border border-[hsl(var(--destructive)/0.2)]">
                      <AlertTriangle className="h-5 w-5 text-[hsl(var(--destructive))] shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-[hsl(var(--destructive))]">
                        Án Verified by Yunite role kemstu ekki inn í custom lobby.
                      </p>
                    </div>

                    {/* Checklist */}
                    <div className="mt-3 space-y-2">
                      {renderCheck("e1", 'Ég er inni á Fortnite Ísland Discord')}
                      {renderCheck("e2", 'Ég fór í "Server Guide"')}
                      {renderCheck("e3", 'Ég opnaði rásina "Verify Epic Games Account"')}
                      {renderCheck("e4", "Ég ýtti á ✋ neðst í rásinni")}
                      {renderCheck("e5", "Ég fékk DM frá Yunite")}
                      {renderCheck("e6", "Ég er komin(n) með role: Verified by Yunite")}
                    </div>

                    {/* Collapsible video */}
                    <Collapsible open={showVideo} onOpenChange={setShowVideo}>
                      <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1">
                        <Film className="h-3.5 w-3.5" />
                        <span>Sjá kennslumyndband</span>
                        {showVideo ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 rounded-lg overflow-hidden aspect-video max-w-sm">
                          <iframe
                            src="https://www.youtube.com/embed/B4zESqrigBQ"
                            title="Epic Verification Guide"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Collapsible images */}
                    <Collapsible open={showImages} onOpenChange={setShowImages}>
                      <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <Search className="h-3.5 w-3.5" />
                        <span>🔍 Sýna myndir</span>
                        {showImages ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-muted/30 border border-border p-3 text-center">
                            <p className="text-xs text-muted-foreground">Server Guide staðsetning</p>
                          </div>
                          <div className="rounded-lg bg-muted/30 border border-border p-3 text-center">
                            <p className="text-xs text-muted-foreground">Verify Epic rás</p>
                          </div>
                          <div className="rounded-lg bg-muted/30 border border-border p-3 text-center">
                            <p className="text-xs text-muted-foreground">Link Epic Account</p>
                          </div>
                          <div className="rounded-lg bg-muted/30 border border-border p-3 text-center">
                            <p className="text-xs text-muted-foreground">DM frá Yunite</p>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* ─── STEP 3 – YUNITE DASHBOARD ─── */}
            <Collapsible open={openSteps["yunite"]} onOpenChange={() => toggleStep("yunite")}>
              <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
                {stepHeader(3, Monitor, "Yunite Dashboard", "yunite", ["y1", "y2", "y3", "y4", "y5", "y6"])}
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-3 border-t border-border">
                    <div className="mt-3 space-y-2">
                      {renderCheck("y1", "Ég fór á dash.yunite.xyz")}
                      {renderCheck("y2", 'Ég loggaði mig inn með Discord aðganginum mínum')}
                      {renderCheck("y3", 'Ég valdi Fortnite Ísland undir "Select your server"')}
                      {renderCheck("y4", 'Ég ýtti á "Join Now"')}
                      {renderCheck("y5", "Ég sé mótið mitt þar")}
                      {renderCheck("y6", "Allir liðsfélagar eru verified",
                        <button
                          onClick={() => setShowWhyVerified(!showWhyVerified)}
                          className="text-xs font-semibold text-[hsl(var(--destructive))] hover:underline ml-1 shrink-0"
                        >
                          Af hverju?
                        </button>
                      )}
                    </div>

                    {/* "Allir liðsfélagar verified" expanded explanation */}
                    {showWhyVerified && (
                      <div className="mt-2 p-3 rounded-lg bg-muted/30 border border-border space-y-3">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Ef liðsfélagi er ekki Verified kemst liðið ekki inn í custom lobby.
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Yunite notar Replay File skrár til að reikna stigin.
                          Ef Save Replays er ekki kveikt í Fortnite telja stigin ekki.
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Replay File er skrá sem býr til sjálfkrafa eftir hvern leik.
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Eftir hvern leik þarf að uploada replay á Yunite.
                          Ef þú notar Yunite Client forritið sendir það replay sjálfkrafa — svo lengi sem Save Replays er ON.
                        </p>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button variant="outline" size="sm" asChild>
                            <a href="https://yunite.xyz/replays" target="_blank" rel="noopener noreferrer">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Replay
                              <ExternalLink className="ml-1.5 h-3 w-3" />
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href="https://yunite.xyz/client" target="_blank" rel="noopener noreferrer">
                              <Monitor className="mr-2 h-4 w-4" />
                              Yunite Client
                              <ExternalLink className="ml-1.5 h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://dash.yunite.xyz" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Opna Yunite Dashboard
                          <ExternalLink className="ml-1.5 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

             {/* ─── STEP 4 – REPLAY (PC) ─── */}
            <Collapsible open={openSteps["replay"]} onOpenChange={() => toggleStep("replay")}>
              <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
                <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center bg-[hsl(var(--${accent})/0.15)] text-[hsl(var(--${accent}))]`}>
                      4
                    </span>
                    <Play className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
                    <span className="font-semibold text-sm">Replay (PC only)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {step4Answered && (pcAnswer === "no" || (pcAnswer === "yes" && checked["r1"])) && (
                      <CheckCircle2 className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
                    )}
                    {openSteps["replay"] ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-3 border-t border-border">
                    <div className="mt-3">
                      <span className="text-sm font-medium">Spilar þú á PC?</span>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant={pcAnswer === "yes" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPcAnswer("yes")}
                          className={pcAnswer === "yes" ? `bg-[hsl(var(--${accent}))] hover:bg-[hsl(var(--${accent})/0.9)] text-black` : ""}
                        >
                          Já
                        </Button>
                        <Button
                          variant={pcAnswer === "no" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPcAnswer("no")}
                          className={pcAnswer === "no" ? `bg-[hsl(var(--${accent}))] hover:bg-[hsl(var(--${accent})/0.9)] text-black` : ""}
                        >
                          Nei
                        </Button>
                      </div>
                    </div>

                    {pcAnswer === "yes" && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          {renderCheck("r1", <>Farðu í Fortnite → Settings → Game → <span className="font-bold">Save Replays ON</span></>)}
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-lg bg-[hsl(var(--destructive)/0.08)] border border-[hsl(var(--destructive)/0.2)]">
                          <AlertTriangle className="h-4 w-4 text-[hsl(var(--destructive))] shrink-0 mt-0.5" />
                          <p className="text-xs font-medium text-[hsl(var(--destructive))]">
                            Stillirðu þetta ekki → tapast stigin þín.
                          </p>
                        </div>
                      </div>
                    )}

                    {pcAnswer === "no" && (
                      <p className="text-xs text-muted-foreground">
                        Þú þarft ekki að hafa áhyggjur af Replay skrám.
                      </p>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            {/* ─── COMPLETION MESSAGE ─── */}
            {allDone && (
              <div className={`rounded-xl border border-[hsl(var(--${accent})/0.4)] bg-[hsl(var(--${accent})/0.06)] p-5 text-center space-y-3`}>
                <CheckCircle2 className={`h-8 w-8 text-[hsl(var(--${accent}))] mx-auto`} />
                <h3 className={`font-display font-bold text-lg text-[hsl(var(--${accent}))]`}>
                  Allt klárt! 🎉
                </h3>
                <p className="text-sm text-muted-foreground">
                  Þú ert tilbúin(n) fyrir mótið. Núna þarftu bara að vera tilbúin(n) á leikdag!
                </p>
                <Button
                  onClick={scrollToLeikdagur}
                  className="font-semibold w-full sm:w-auto text-black"
                  size="lg"
                  style={{
                    backgroundColor: 'hsl(var(--arena-green))',
                    borderColor: 'hsl(var(--arena-green))',
                    borderWidth: '2px',
                  }}
                >
                  Sjá leikdag →
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
