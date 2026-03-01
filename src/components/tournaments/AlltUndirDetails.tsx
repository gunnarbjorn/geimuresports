import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import alltUndirBg from "@/assets/allt-undir-bg.jpeg";
import {
  ArrowLeft,
  Calendar,
  Globe,
  Users,
  Trophy,
  Gamepad2,
  ChevronDown,
  ShieldCheck,
  MessageCircle,
  Clock,
  Ticket,
  Loader2,
  AlertCircle,
  Crosshair,
  TrendingUp,
  Timer,
  Tv,
  Ban,
  Check,
  ArrowRight,
} from "lucide-react";

const DISCORD_INVITE_URL = "https://discord.gg/AzwK64zz";
const TWITCH_URL = "https://www.twitch.tv/geimuresports";

const TOURNAMENT_DATES = [
  { date: "2026-03-05", label: "Fimmtudagur 5. mars", short: "5. mars" },
  { date: "2026-03-12", label: "Fimmtudagur 12. mars", short: "12. mars" },
  { date: "2026-03-19", label: "Fimmtudagur 19. mars", short: "19. mars" },
  { date: "2026-03-26", label: "Fimmtudagur 26. mars", short: "26. mars" },
];

const TOURNAMENT_CONFIG = {
  name: "ALLT UNDIR",
  game: "Fortnite",
  format: "Solo",
  formatLabel: "1 leikmaður",
  location: "Online",
  ageLimit: "13+",
  entryFee: 3057,
  prizeContribution: 3000,
  maxPlayers: 100,
  registrationCloseTime: "17:30",
  gameStartTime: "18:00",
};

const PRIZE_DIST = {
  first: 0.4167,
  second: 0.1667,
  third: 0.0833,
  elimPool: 0.3333,
};

type DateStatus = 'upcoming' | 'active' | 'completed';

function getCountdown(targetDate: string, closeTime: string) {
  const [hours, mins] = closeTime.split(":").map(Number);
  const target = new Date(`${targetDate}T${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:00`);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s, total: diff };
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [countdown, setCountdown] = useState(() =>
    getCountdown(targetDate, TOURNAMENT_CONFIG.registrationCloseTime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(targetDate, TOURNAMENT_CONFIG.registrationCloseTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!countdown) {
    return (
      <Badge variant="destructive" className="text-sm px-4 py-2">
        <Clock className="h-4 w-4 mr-2" />
        Skráning lokað
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="text-sm px-4 py-2 font-mono">
      <Timer className="h-4 w-4 mr-2 text-[hsl(var(--arena-green))]" />
      Skráning lokar eftir: {String(countdown.h).padStart(2, "0")}:{String(countdown.m).padStart(2, "0")}:{String(countdown.s).padStart(2, "0")}
    </Badge>
  );
}

function PrizePoolWidget({ playerCount }: { playerCount: number }) {
  const pot = playerCount * TOURNAMENT_CONFIG.prizeContribution;
  const maxElims = TOURNAMENT_CONFIG.maxPlayers;
  const elimTotal = pot * PRIZE_DIST.elimPool;
  const perElim = maxElims > 0 ? Math.round(elimTotal / maxElims) : 0;

  return (
    <Card className="border-[hsl(var(--arena-green)/0.4)] bg-card/80 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[hsl(var(--arena-green))] to-transparent" />
      <CardContent className="p-5 md:p-6 relative">
        <div className="text-center mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--arena-green))] mb-1">
            Verðlaunapottur
          </p>
          <p className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--arena-green))]">
            {pot.toLocaleString("is-IS")} kr
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {playerCount} skráðir · {TOURNAMENT_CONFIG.prizeContribution.toLocaleString("is-IS")} kr á leikmann fer í pottinn
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[hsl(var(--arena-green)/0.05)] border border-[hsl(var(--arena-green)/0.15)] text-center">
            <p className="text-xs text-muted-foreground">🥇 1. sæti (41.67%)</p>
            <p className="font-bold text-[hsl(var(--arena-green))]">
              {Math.round(pot * PRIZE_DIST.first).toLocaleString("is-IS")} kr
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
            <p className="text-xs text-muted-foreground">🥈 2. sæti (16.67%)</p>
            <p className="font-bold">
              {Math.round(pot * PRIZE_DIST.second).toLocaleString("is-IS")} kr
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
            <p className="text-xs text-muted-foreground">🥉 3. sæti (8.33%)</p>
            <p className="font-bold">
              {Math.round(pot * PRIZE_DIST.third).toLocaleString("is-IS")} kr
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border text-center">
            <p className="text-xs text-muted-foreground">
              <Crosshair className="inline h-3.5 w-3.5 mr-1" />
              Per elim (33.33%)
            </p>
            <p className="font-bold">
              {perElim.toLocaleString("is-IS")} kr
            </p>
            <p className="text-[10px] text-muted-foreground">hámark {maxElims} elims</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DynamicSlotCounter({ count, max, isCompleted }: { count: number; max: number; isCompleted: boolean }) {
  if (isCompleted) {
    return <span className="text-sm text-muted-foreground">{count} keppendur</span>;
  }
  const remaining = max - count;
  if (count >= 80) {
    return <span className="text-sm font-semibold text-[hsl(var(--destructive))]">Aðeins {remaining} pláss eftir</span>;
  }
  if (count >= 50) {
    return <span className="text-sm text-muted-foreground">Færri en {max - 49} pláss eftir</span>;
  }
  return <span className="text-sm text-muted-foreground">{remaining} laus pláss</span>;
}

function RegistrationForm({
  selectedDate,
  dateStatuses,
  onSuccess,
}: {
  selectedDate: string;
  dateStatuses: Record<string, DateStatus>;
  onSuccess: () => void;
}) {
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status");
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [kennitala, setKennitala] = useState("");
  const [fortniteName, setFortniteName] = useState("");
  const [gmail, setGmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptRules, setAcceptRules] = useState(false);
  const [confirmUsername, setConfirmUsername] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  useEffect(() => {
    const availableDates = TOURNAMENT_DATES
      .filter(td => dateStatuses[td.date] !== 'completed')
      .map(td => td.date);
    if (availableDates.includes(selectedDate)) {
      setSelectedDates([selectedDate]);
    } else if (availableDates.length > 0) {
      setSelectedDates([availableDates[0]]);
    }
  }, [selectedDate, dateStatuses]);

  const toggleDate = (date: string) => {
    setSelectedDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const totalPrice = selectedDates.length * TOURNAMENT_CONFIG.entryFee;
  const allCompleted = TOURNAMENT_DATES.every(td => dateStatuses[td.date] === 'completed');
  const registrationClosed = allCompleted || selectedDates.every(d => !getCountdown(d, TOURNAMENT_CONFIG.registrationCloseTime));

  if (statusParam === "success") {
    return (
      <Card className="border-[hsl(var(--arena-green)/0.4)] bg-card">
        <CardContent className="p-6 text-center space-y-3">
          <div className="text-4xl">🎮</div>
          <h3 className="font-display text-xl font-bold text-[hsl(var(--arena-green))]">
            Skráning og greiðsla móttekin!
          </h3>
          <p className="text-sm text-muted-foreground">
            Custom matchmaking key verður deilt í{" "}
            <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--arena-green))] underline">
              Geimur Discord
            </a>{" "}
            fyrir kl. {TOURNAMENT_CONFIG.gameStartTime}.
          </p>
          <p className="text-xs text-muted-foreground">Staðfesting hefur verið send á netfangið þitt.</p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedDates.length === 0) {
      setError("Veldu a.m.k. einn dag");
      return;
    }

    setIsSubmitting(true);

    const kt = kennitala.replace(/[\s-]/g, "");
    if (kt.length !== 10 || !/^\d{10}$/.test(kt)) {
      setError("Kennitala verður að vera 10 tölustafir");
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke("allt-undir-payment-create", {
        body: {
          fullName: fullName.trim(),
          kennitala: kt,
          fortniteName: fortniteName.trim(),
          gmail: gmail.trim(),
          dates: selectedDates,
          baseUrl: window.location.origin,
        },
      });

      if (fnError || !data?.paymentUrl || !data?.fields) {
        setError(data?.error || "Villa við skráningu — reyndu aftur");
        setIsSubmitting(false);
        return;
      }

      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.paymentUrl;
      form.style.display = "none";
      for (const [key, value] of Object.entries(data.fields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("Payment error:", err);
      setError("Villa — reyndu aftur");
      setIsSubmitting(false);
    }
  };

  const accent = "arena-green";

  return (
    <>
      {statusParam === "cancelled" && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Greiðsla hætt við — skráning var ekki kláruð.</AlertDescription>
        </Alert>
      )}
      {statusParam === "error" && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Villa í greiðslu — prófaðu aftur.</AlertDescription>
        </Alert>
      )}
      <Card className="glass-card border-[hsl(var(--arena-green)/0.3)] overflow-hidden glow-green-sm">
        <CardHeader className="bg-gradient-to-r from-[hsl(var(--arena-green)/0.1)] to-transparent border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--arena-green)/0.1)] flex items-center justify-center">
              <Trophy className="h-4 w-4 text-[hsl(var(--arena-green))]" />
            </div>
            <div>
              <CardTitle className="font-display text-lg">Skrá og greiða</CardTitle>
              <p className="text-sm text-muted-foreground">Solo — 1 leikmaður</p>
            </div>
            {!allCompleted && (
              <div className="ml-auto flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-[hsl(var(--arena-green))]' : 'bg-muted-foreground/30'}`} />
                <span className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-[hsl(var(--arena-green))]' : 'bg-muted-foreground/30'}`} />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-5 md:p-6">
          {allCompleted ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground font-medium">Öllum leikjum lokið fyrir þetta tímabil.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Step 1: Date selection */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Veldu daga</Label>
                    <div className="space-y-2">
                      {TOURNAMENT_DATES.map((td) => {
                        const isCompleted = dateStatuses[td.date] === 'completed';
                        const isSelected = selectedDates.includes(td.date);
                        return (
                          <label
                            key={td.date}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                              isCompleted
                                ? 'opacity-50 cursor-not-allowed border-border bg-muted/20'
                                : isSelected
                                ? `border-[hsl(var(--${accent})/0.5)] bg-[hsl(var(--${accent})/0.05)]`
                                : `border-border hover:border-[hsl(var(--${accent})/0.3)] hover:bg-muted/30`
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={isCompleted}
                                onChange={() => !isCompleted && toggleDate(td.date)}
                                className={`h-4 w-4 rounded border-border accent-[hsl(var(--${accent}))]`}
                              />
                              <span className={`text-sm font-medium ${isCompleted ? 'text-muted-foreground line-through' : ''}`}>
                                {td.short}
                              </span>
                              {isCompleted && (
                                <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                                  <Check className="h-3 w-3 mr-1" />
                                  Lokið
                                </Badge>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`text-sm font-mono ${isCompleted ? 'text-muted-foreground' : 'text-foreground'}`}>
                                {TOURNAMENT_CONFIG.entryFee.toLocaleString("is-IS")} kr
                              </span>
                              <p className="text-[10px] text-muted-foreground leading-tight">
                                3.000 kr + 57 kr kortabókunargjald
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price summary */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {selectedDates.length} {selectedDates.length === 1 ? 'dagur' : 'dagar'} valdir
                      </span>
                      <span className="font-bold text-foreground text-lg">
                        {totalPrice.toLocaleString("is-IS")} kr
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      💡 {TOURNAMENT_CONFIG.prizeContribution.toLocaleString("is-IS")} kr á leikmann fer í pottinn á hverjum degi.
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="lg"
                    className="w-full btn-arena-gradient text-base"
                    disabled={selectedDates.length === 0}
                    onClick={() => {
                      if (selectedDates.length > 0) {
                        setStep(2);
                      }
                    }}
                  >
                    Áfram <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Step 2: Personal info */}
              {step === 2 && (
                <div className="space-y-4">
                  <button
                    type="button"
                    className={`text-sm text-[hsl(var(--${accent}))] hover:underline flex items-center gap-1`}
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Til baka
                  </button>

                  <div className="p-3 rounded-lg bg-muted/30 border border-border text-sm">
                    <span className="text-muted-foreground">
                      {selectedDates.length} {selectedDates.length === 1 ? 'dagur' : 'dagar'} ·{" "}
                    </span>
                    <span className="font-bold text-foreground">
                      {totalPrice.toLocaleString("is-IS")} kr
                    </span>
                  </div>

                  <div>
                    <Label htmlFor="fullName">Fullt nafn</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nafnið þitt"
                      required
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fortniteName">
                      <Gamepad2 className="inline h-3.5 w-3.5 mr-1" />
                      Fortnite nafn
                    </Label>
                    <Input
                      id="fortniteName"
                      value={fortniteName}
                      onChange={(e) => setFortniteName(e.target.value)}
                      placeholder="Fortnite username"
                      required
                      maxLength={50}
                    />
                    <p className="text-xs text-[hsl(var(--destructive))] mt-1 font-medium">
                      ⚠️ Ekki er hægt að breyta Fortnite nafni eftir skráningu
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="gmail">Netfang</Label>
                    <Input
                      id="gmail"
                      type="email"
                      value={gmail}
                      onChange={(e) => setGmail(e.target.value)}
                      placeholder="netfang@gmail.com"
                      required
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Label htmlFor="kennitala">Kennitala</Label>
                    <Input
                      id="kennitala"
                      value={kennitala}
                      onChange={(e) => setKennitala(e.target.value)}
                      placeholder="0101001234"
                      required
                      maxLength={11}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Notuð eingöngu við greiðslu verðlauna.
                    </p>
                  </div>

                  {/* Required checkboxes */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 group">
                      <input
                        id="acceptRules"
                        type="checkbox"
                        checked={acceptRules}
                        onChange={(e) => setAcceptRules(e.target.checked)}
                        className={`mt-1 h-4 w-4 rounded border-border accent-[hsl(var(--${accent}))]`}
                        required
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        <label htmlFor="acceptRules" className="cursor-pointer">
                          Ég hef lesið og samþykki{" "}
                        </label>
                        <button
                          type="button"
                          className={`text-[hsl(var(--${accent}))] underline`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const item = document.getElementById("allt-undir-reglur-item");
                            const trigger = document.getElementById("allt-undir-reglur-trigger");
                            if (trigger && item?.getAttribute("data-state") !== "open") {
                              (trigger as HTMLButtonElement).click();
                            }
                            setTimeout(() => {
                              item?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }, 220);
                          }}
                        >
                          reglurnar
                        </button>
                      </span>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={confirmUsername}
                        onChange={(e) => setConfirmUsername(e.target.checked)}
                        className={`mt-1 h-4 w-4 rounded border-border accent-[hsl(var(--${accent}))]`}
                        required
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        Ég staðfesti að Fortnite notendanafnið mitt sé rétt skráð og mun ekki breyta því fyrir mótið
                      </span>
                    </label>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full btn-arena-gradient text-base"
                    disabled={isSubmitting || !acceptRules || !confirmUsername || selectedDates.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Vinnsla...
                      </>
                    ) : (
                      <>
                        Greiða og staðfesta — {totalPrice.toLocaleString("is-IS")} kr
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    {TOURNAMENT_CONFIG.prizeContribution.toLocaleString("is-IS")} kr fara í verðlaunapott + kortaþóknun · Örugg greiðsla hjá Teya/Borgun
                  </p>
                </div>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export function AlltUndirDetails({ onBack }: { onBack?: () => void }) {
  const [dateStatuses, setDateStatuses] = useState<Record<string, DateStatus>>({});
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  const selectedDate = useMemo(() => {
    const firstOpen = TOURNAMENT_DATES.find(td => dateStatuses[td.date] !== 'completed');
    return firstOpen?.date || TOURNAMENT_DATES[0].date;
  }, [dateStatuses]);

  const [activeDate, setActiveDate] = useState(selectedDate);

  useEffect(() => {
    setActiveDate(selectedDate);
  }, [selectedDate]);

  const accent = "arena-green";

  const fetchDateStatuses = async () => {
    try {
      const statusMap: Record<string, DateStatus> = {};
      for (const td of TOURNAMENT_DATES) {
        const statusId = `allt-undir-${td.date}`;
        const { data } = await (supabase as any)
          .from('tournament_statuses')
          .select('status')
          .eq('tournament_id', statusId)
          .maybeSingle();
        if (data?.status === 'completed') {
          statusMap[td.date] = 'completed';
        } else {
          statusMap[td.date] = 'active';
        }
      }
      setDateStatuses(statusMap);
    } catch (err) {
      console.error("Error fetching date statuses:", err);
    }
  };

  const fetchCounts = async () => {
    setIsLoading(true);
    try {
      const counts: Record<string, number> = {};
      for (const td of TOURNAMENT_DATES) {
        const { data } = await (supabase.rpc as any)("get_verified_registration_count", {
          _type: `allt-undir-${td.date}`,
        });
        counts[td.date] = (data as number) || 0;
      }
      setRegistrationCounts(counts);
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDateStatuses();
    fetchCounts();
  }, []);

  const currentCount = registrationCounts[activeDate] || 0;
  const selectedDateObj = TOURNAMENT_DATES.find((d) => d.date === activeDate)!;
  const isActiveDateCompleted = dateStatuses[activeDate] === 'completed';

  return (
    <div className="relative">
      {/* Background image */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-screen h-screen z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-80 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${alltUndirBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
      </div>
      <div className="relative z-10 space-y-6">
        {/* Hero */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={onBack}
              asChild={!onBack}
            >
              {onBack ? (
                <span>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Öll mót
                </span>
              ) : (
                <Link to="/keppa">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Öll mót
                </Link>
              )}
            </Button>
            <Badge
              variant="outline"
              className={`text-xs px-3 py-1.5 bg-card border-[hsl(var(--${accent})/0.5)]`}
            >
              <Globe className={`h-3.5 w-3.5 mr-1.5 text-[hsl(var(--${accent}))]`} />
              Online
            </Badge>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
            {TOURNAMENT_CONFIG.name}
          </h2>
          <p className="text-muted-foreground mb-4">
            {TOURNAMENT_CONFIG.game} · {TOURNAMENT_CONFIG.format} · {TOURNAMENT_CONFIG.ageLimit}
          </p>

          {/* Date selector pills */}
          <div className="grid grid-cols-2 justify-center gap-2 mb-4 max-w-xs mx-auto sm:flex sm:max-w-none">
            {TOURNAMENT_DATES.map((td) => {
              const isCompleted = dateStatuses[td.date] === 'completed';
              const isActive = activeDate === td.date;
              return (
                <Button
                  key={td.date}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={
                    isCompleted
                      ? "opacity-60 cursor-pointer"
                      : isActive
                      ? "btn-arena-gradient"
                      : ""
                  }
                  onClick={() => setActiveDate(td.date)}
                >
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  {td.short}
                  {isCompleted && (
                    <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
                      Lokið
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Countdown or completed notice */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {isActiveDateCompleted ? (
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Check className="h-4 w-4 mr-2" />
                Þessum leik er lokið
              </Badge>
            ) : (
              <CountdownTimer targetDate={activeDate} />
            )}
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Clock className="h-4 w-4 mr-2 text-[hsl(var(--planet-tournament))]" />
              Leikur kl. {TOURNAMENT_CONFIG.gameStartTime}
            </Badge>
          </div>
          {!isActiveDateCompleted && (
            <Button
              size="lg"
              className="btn-arena-gradient text-base"
              onClick={() => {
                const el = document.getElementById("skraning-allt-undir");
                if (el) {
                  const offset = el.getBoundingClientRect().top + window.scrollY - 104;
                  window.scrollTo({ top: offset, behavior: "smooth" });
                }
              }}
            >
              Skrá mig <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Live prize pool */}
        <PrizePoolWidget playerCount={currentCount} />

        {/* Registration status with dynamic counter */}
        <Card className={`bg-card border-[hsl(var(--${accent})/0.3)]`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className={`h-5 w-5 text-[hsl(var(--${accent}))]`} />
                <span className="font-semibold">
                  {selectedDateObj.short}
                </span>
                {isActiveDateCompleted && (
                  <Badge variant="secondary" className="text-[10px]">Lokið</Badge>
                )}
              </div>
              <DynamicSlotCounter count={currentCount} max={TOURNAMENT_CONFIG.maxPlayers} isCompleted={isActiveDateCompleted} />
            </div>
            <Progress
              value={(currentCount / TOURNAMENT_CONFIG.maxPlayers) * 100}
              className="h-3 mb-3"
            />
            <div className="flex justify-between text-sm">
              <span className={`text-[hsl(var(--${accent}))] font-bold`}>
                {currentCount} / {TOURNAMENT_CONFIG.maxPlayers} skráðir
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Registration form */}
        <div id="skraning-allt-undir" className="scroll-mt-24">
          <RegistrationForm
            selectedDate={activeDate}
            dateStatuses={dateStatuses}
            onSuccess={fetchCounts}
          />
        </div>

        {/* Info accordions */}
        <Accordion type="single" collapsible>
          <AccordionItem
            value="hvernig"
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full bg-[hsl(var(--${accent})/0.1)] flex items-center justify-center shrink-0`}>
                  <TrendingUp className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
                </div>
                <span className="font-display font-semibold text-left">
                  Hvernig virkar þetta?
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">1.</strong> Skráðu þig og greiddu{" "}
                  {TOURNAMENT_CONFIG.prizeContribution.toLocaleString("is-IS")} kr (+ 57 kr kortabókunargjald).{" "}
                  {TOURNAMENT_CONFIG.prizeContribution.toLocaleString("is-IS")} kr fara beint í verðlaunapottinn.
                </p>
                <p>
                  <strong className="text-foreground">2.</strong> Custom matchmaking key er deilt á{" "}
                  <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" className={`text-[hsl(var(--${accent}))] underline`}>
                    Geimur Discord
                  </a>{" "}
                  <strong className="text-foreground">30 mín fyrir leikbyrjun</strong> — aðeins skráðir leikmenn hafa aðgang.
                </p>
                <p>
                  <strong className="text-foreground">3.</strong> 1 leikur, Solo. Leikur byrjar kl. {TOURNAMENT_CONFIG.gameStartTime}.
                </p>
                <p>
                  <strong className="text-foreground">4.</strong> Niðurstöður birtast strax á{" "}
                  <a href={TWITCH_URL} target="_blank" rel="noopener noreferrer" className={`text-[hsl(var(--${accent}))] underline`}>
                    Twitch
                  </a>{" "}
                  og í Discord.
                </p>
                <p>
                  <strong className="text-foreground">5.</strong> Vinningshafar fá útborgað gegnum reikning sem kennitala er tengd við, í lok mánaðar.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Prize breakdown accordion */}
        <Accordion type="single" collapsible>
          <AccordionItem
            value="verdlaun"
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full bg-[hsl(var(--${accent})/0.1)] flex items-center justify-center shrink-0`}>
                  <Trophy className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
                </div>
                <span className="font-display font-semibold text-left">
                  Verðlaun & stigakerfi
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <p className="font-medium">Þátttökugjald</p>
                  <div className="text-right">
                    <p className={`text-xl font-bold text-[hsl(var(--${accent}))]`}>
                      {TOURNAMENT_CONFIG.prizeContribution.toLocaleString("is-IS")} kr
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      á leikmann fer í pottinn
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      (greitt: {TOURNAMENT_CONFIG.entryFee.toLocaleString("is-IS")} kr — 57 kr er kortabókunargjald)
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Verðlaun reiknast sem hlutfall af heildar verðlaunapotti ({TOURNAMENT_CONFIG.prizeContribution.toLocaleString("is-IS")} kr × fjöldi skráðra).
                </p>

                <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                  <div className={`flex items-center justify-between px-4 py-3 bg-[hsl(var(--${accent})/0.06)]`}>
                    <div className="flex items-center gap-3">
                      <span>🥇</span>
                      <span className="text-sm font-semibold">1. sæti</span>
                    </div>
                    <span className={`font-bold text-[hsl(var(--${accent}))]`}>41.67%</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span>🥈</span>
                      <span className="text-sm">2. sæti</span>
                    </div>
                    <span className="font-bold">16.67%</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span>🥉</span>
                      <span className="text-sm">3. sæti</span>
                    </div>
                    <span className="font-bold">8.33%</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Crosshair className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Per elimination</span>
                    </div>
                    <span className="font-bold">33.33% ÷ elims</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 border border-border text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Dæmi (100 spilarar = 300.000 kr):</p>
                  <ul className="space-y-1">
                    <li>🥇 1. sæti: 125.000 kr</li>
                    <li>🥈 2. sæti: 50.000 kr</li>
                    <li>🥉 3. sæti: 25.000 kr</li>
                    <li>🎯 Per elim: 1.000 kr (hámark 100 elims = 100.000 kr)</li>
                  </ul>
                </div>

                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <strong className="text-foreground">Útborgun:</strong> Vinningshafar senda bankaupplýsingar gegnum kennitölu sem var skráð. Verðlaun eru greidd út með reikningi frá Geimur í lok mánaðar.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Results info */}
        <Accordion type="single" collapsible>
          <AccordionItem
            value="nidurstodur"
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Tv className="h-4 w-4 text-primary" />
                </div>
                <span className="font-display font-semibold text-left">
                  Niðurstöður & streymi
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Leaderboard birtist beint á streymi strax eftir leikinn:{" "}
                  <a href={TWITCH_URL} target="_blank" rel="noopener noreferrer" className={`text-[hsl(var(--${accent}))] underline`}>
                    twitch.tv/geimuresports
                  </a>
                </p>
                <p>
                  Einnig birt í{" "}
                  <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" className={`text-[hsl(var(--${accent}))] underline`}>
                    Geimur Discord
                  </a>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* How to join */}
        <Accordion type="single" collapsible>
          <AccordionItem
            value="lobby"
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full bg-[hsl(var(--${accent})/0.1)] flex items-center justify-center shrink-0`}>
                  <Gamepad2 className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
                </div>
                <span className="font-display font-semibold text-left">
                  Hvernig joina ég lobby?
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Custom matchmaking key er deilt <strong className="text-foreground">eingöngu</strong> í{" "}
                  <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer" className={`text-[hsl(var(--${accent}))] underline`}>
                    Geimur Discord
                  </a>.
                </p>
                <p>Aðeins skráðir leikmenn hafa aðgang að Discord og lykilorðinu.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* How to compete */}
        <Accordion type="single" collapsible>
          <AccordionItem
            value="hvernig-keppa"
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full bg-[hsl(var(--${accent})/0.1)] flex items-center justify-center shrink-0`}>
                  <Gamepad2 className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
                </div>
                <span className="font-display font-semibold text-left">
                  Ég hef aldrei keppt áður, hjálp
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 space-y-5">
              <div className="aspect-video rounded-lg overflow-hidden border border-border bg-muted/30">
                <video
                  src="/clips/geimur-tutorial.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                />
              </div>
              <ol className="space-y-3">
                {[
                  "Opnaðu Fortnite",
                  "Scrollaðu niður og leitaðu að Tournament",
                  "Smelltu á Battle Royale Tournament Settings",
                  "Ýttu á Select",
                  "Scrollaðu niður og ýttu á Custom Key — sláðu inn lyklinn sem kemur á Discord",
                  "Ýttu á Play og bíddu eftir að Geimur byrjar leikinn",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full bg-[hsl(var(--${accent})/0.15)] text-[hsl(var(--${accent}))] flex items-center justify-center text-sm font-bold`}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted-foreground pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Rules */}
        <Accordion type="single" collapsible className="space-y-3">
          <AccordionItem
            id="allt-undir-reglur-item"
            value="reglur"
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <AccordionTrigger id="allt-undir-reglur-trigger" className="px-5 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <span className="font-display font-semibold text-left">
                  Reglur
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <div className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className={`text-[hsl(var(--${accent}))] mt-0.5`}>•</span>
                    <span>Aldurstakmark: <strong className="text-foreground">13+</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={`text-[hsl(var(--${accent}))] mt-0.5`}>•</span>
                    <span>Engin endurgreiðsla nema afbókun sé gerð a.m.k. 24 klukkustundum fyrir viðburð.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={`text-[hsl(var(--${accent}))] mt-0.5`}>•</span>
                    <span>
                      Fortnite nafn <strong className="text-foreground">má ekki breyta</strong> eftir skráningu — ef nafni er breytt er ekki víst að hægt sé að greiða út verðlaun þar sem við getum ekki staðfest hver leikmaðurinn er.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={`text-[hsl(var(--${accent}))] mt-0.5`}>•</span>
                    <span>
                      <strong className="text-foreground">Óheimilt</strong> að streama leikinn.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--destructive))] mt-0.5">•</span>
                    <span>
                      Svindl leiðir til banns frá öllum Geimur mótum það sem eftir er árs.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[hsl(var(--destructive))] mt-0.5">•</span>
                    <span>
                      Að deila custom matchmaking key leiðir til <strong className="text-foreground">brottvísunar strax</strong>.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={`text-[hsl(var(--${accent}))] mt-0.5`}>•</span>
                    <span>
                      Óskráðir leikmenn sem koma inn í lobby fá engin verðlaun — engin ástæða til að koma inn án skráningar þar sem aðgangseyrir kostar jafn mikið og Subway samloka, svo skráðu þig.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className={`text-[hsl(var(--${accent}))] mt-0.5`}>•</span>
                    <span>
                      Ef leikur eða server krassjar, byrjar nýr leikur 30 mínútum eftir upprunalegan byrjunartíma (t.d. ef leikur byrjar kl. 18:00 og krassjar kl. 18:14, byrjar nýr leikur kl. 18:30 — allt annað helst óbreytt).
                    </span>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Event Disclaimer */}
        <div className="mt-8">
          <div className="h-px w-full bg-border mb-6" />
          <div className="rounded-xl bg-muted/40 border border-border px-5 py-6 space-y-4">
            <h3 className="font-display text-sm font-semibold tracking-wide uppercase text-muted-foreground">
              Event Disclaimer
            </h3>
            <div className="space-y-3 text-[11px] leading-relaxed text-muted-foreground/70">
              <p>
                THIS EVENT IS IN NO WAY SPONSORED, ENDORSED, OR ADMINISTERED BY, OR OTHERWISE
                ASSOCIATED WITH, EPIC GAMES, INC. THE INFORMATION PLAYERS PROVIDE IN CONNECTION WITH
                THIS EVENT IS BEING PROVIDED TO EVENT ORGANIZER AND NOT TO EPIC GAMES, INC.
              </p>
              <p>
                BY PARTICIPATING IN THIS EVENT, TO THE EXTENT PERMITTED BY APPLICABLE LAW, PLAYERS
                AGREE TO RELEASE AND HOLD HARMLESS EPIC GAMES, INC., ITS LICENSORS, ITS AND THEIR
                AFFILIATES, AND ITS AND THEIR EMPLOYEES, OFFICERS, DIRECTORS, AGENTS, CONTRACTORS,
                AND OTHER REPRESENTATIVES FROM ALL CLAIMS, DEMANDS, ACTIONS, LOSSES, LIABILITIES,
                AND EXPENSES RELATED TO THE EVENT.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
