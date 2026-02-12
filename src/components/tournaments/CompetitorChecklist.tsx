import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  MessageCircle,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Monitor,
  BookOpen,
  Play,
  Upload,
  CheckCircle2,
} from "lucide-react";

const DISCORD_INVITE_URL = "https://discord.com/invite/57P9SAy4Fq";

interface CheckItem {
  id: string;
  label: string;
}

const STEPS = [
  {
    id: "discord",
    title: "Discord",
    icon: MessageCircle,
    emphasized: false,
    checks: [
      { id: "d1", label: "Ég er með Discord" },
      { id: "d2", label: "Ég er búin(n) að joina Fortnite Ísland" },
      { id: "d3", label: "Ég hef lesið Server Guide" },
    ] as CheckItem[],
    buttons: [
      { label: "Join Discord", href: DISCORD_INVITE_URL, icon: MessageCircle },
      { label: "Opna Server Guide", href: "https://discord.com/channels/720290498613313647/1338265979263684658", icon: BookOpen },
    ],
  },
  {
    id: "epic",
    title: "Epic Verification",
    icon: ShieldCheck,
    emphasized: true,
    warning: "Án Verified by Yunite role kemstu ekki inn í custom lobby.",
    checks: [
      { id: "e1", label: "Ég hef farið í #epic-verification" },
      { id: "e2", label: "Ég hef ýtt á ✋" },
      { id: "e3", label: "Ég er komin(n) með Verified role" },
    ] as CheckItem[],
    videoUrl: "https://www.youtube.com/embed/B4zESqrigBQ",
    buttons: [
      { label: "Fara í epic-verification", href: "https://discord.com/channels/720290498613313647/1319377696659959848", icon: ShieldCheck },
    ],
  },
  {
    id: "yunite",
    title: "Yunite Dashboard",
    icon: Monitor,
    emphasized: false,
    checks: [
      { id: "y1", label: "Ég hef loggað mig inn á dash.yunite.xyz" },
      { id: "y2", label: "Ég sé mótið mitt þar" },
      { id: "y3", label: "Allir liðsfélagar eru verified" },
    ] as CheckItem[],
    buttons: [
      { label: "Opna Yunite Dashboard", href: "https://dash.yunite.xyz", icon: ExternalLink },
    ],
  },
];

const REPLAY_CHECKS: CheckItem[] = [
  { id: "r1", label: "Save Replays ON" },
  { id: "r2", label: "Ég veit hvernig ég uploada replay" },
  { id: "r3", label: "Ég hef prófað einu sinni" },
];

export function CompetitorChecklist() {
  const accent = "arena-green";

  const allCheckIds = [
    ...STEPS.flatMap((s) => s.checks.map((c) => c.id)),
  ];

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({ discord: true });
  const [isPc, setIsPc] = useState(false);

  const toggleCheck = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const totalChecks = allCheckIds.length + (isPc ? REPLAY_CHECKS.length : 0);
  const checkedCount =
    allCheckIds.filter((id) => checked[id]).length +
    (isPc ? REPLAY_CHECKS.filter((c) => checked[c.id]).length : 0);
  const progressPercentage = totalChecks > 0 ? Math.round((checkedCount / totalChecks) * 100) : 0;

  const toggleStep = (stepId: string) => {
    setOpenSteps((prev) => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  return (
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

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step, index) => (
            <Collapsible key={step.id} open={openSteps[step.id]} onOpenChange={() => toggleStep(step.id)}>
              <div
                className={`rounded-xl border overflow-hidden transition-colors ${
                  step.emphasized
                    ? `border-[hsl(var(--destructive)/0.4)] bg-[hsl(var(--destructive)/0.04)]`
                    : "border-border bg-muted/20"
                }`}
              >
                <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      step.emphasized
                        ? "bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]"
                        : `bg-[hsl(var(--${accent})/0.15)] text-[hsl(var(--${accent}))]`
                    }`}>
                      {index + 1}
                    </span>
                    <step.icon className={`h-4 w-4 ${
                      step.emphasized ? "text-[hsl(var(--destructive))]" : `text-[hsl(var(--${accent}))]`
                    }`} />
                    <span className="font-semibold text-sm">{step.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {step.checks.every((c) => checked[c.id]) && (
                      <CheckCircle2 className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
                    )}
                    {openSteps[step.id] ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-3 border-t border-border">
                    {/* Warning */}
                    {step.warning && (
                      <div className="mt-3 flex items-start gap-3 p-3 rounded-lg bg-[hsl(var(--destructive)/0.08)] border border-[hsl(var(--destructive)/0.2)]">
                        <AlertTriangle className="h-5 w-5 text-[hsl(var(--destructive))] shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-[hsl(var(--destructive))]">{step.warning}</p>
                      </div>
                    )}

                    {/* Checklist */}
                    <div className="mt-3 space-y-2">
                      {step.checks.map((c) => (
                        <label
                          key={c.id}
                          className="flex items-center gap-3 cursor-pointer py-1"
                        >
                          <Checkbox
                            checked={!!checked[c.id]}
                            onCheckedChange={() => toggleCheck(c.id)}
                          />
                          <span className={`text-sm ${checked[c.id] ? "text-muted-foreground line-through" : ""}`}>
                            {c.label}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Video */}
                    {step.videoUrl && (
                      <div className="mt-2 rounded-lg overflow-hidden aspect-video">
                        <iframe
                          src={step.videoUrl}
                          title="Epic Verification Guide"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {/* Buttons */}
                    {step.buttons && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {step.buttons.map((btn) => (
                          <Button
                            key={btn.label}
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={btn.href} target="_blank" rel="noopener noreferrer">
                              <btn.icon className="mr-2 h-4 w-4" />
                              {btn.label}
                              <ExternalLink className="ml-1.5 h-3 w-3" />
                            </a>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}

          {/* STEP 4 – Replay (PC toggle) */}
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
                  {isPc && REPLAY_CHECKS.every((c) => checked[c.id]) && (
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
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-sm font-medium">Spilar þú á PC?</span>
                    <Switch checked={isPc} onCheckedChange={setIsPc} />
                  </div>

                  {isPc && (
                    <>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-[hsl(var(--destructive)/0.08)] border border-[hsl(var(--destructive)/0.2)]">
                        <AlertTriangle className="h-5 w-5 text-[hsl(var(--destructive))] shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-[hsl(var(--destructive))]">
                          Ef Save Replays er OFF telja stigin þín ekki.
                        </p>
                      </div>

                      <div className="space-y-2">
                        {REPLAY_CHECKS.map((c) => (
                          <label key={c.id} className="flex items-center gap-3 cursor-pointer py-1">
                            <Checkbox checked={!!checked[c.id]} onCheckedChange={() => toggleCheck(c.id)} />
                            <span className={`text-sm ${checked[c.id] ? "text-muted-foreground line-through" : ""}`}>
                              {c.label}
                            </span>
                          </label>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://dash.yunite.xyz" target="_blank" rel="noopener noreferrer">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload replay
                            <ExternalLink className="ml-1.5 h-3 w-3" />
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://yunite.xyz/download" target="_blank" rel="noopener noreferrer">
                            <Monitor className="mr-2 h-4 w-4" />
                            Yunite client
                            <ExternalLink className="ml-1.5 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}
