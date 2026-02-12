import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  MessageCircle,
  ShieldCheck,
  ExternalLink,
  HelpCircle,
  XCircle,
  Play,
  Upload,
  Download,
  Monitor,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const DISCORD_INVITE_URL = "https://discord.com/invite/57P9SAy4Fq";
const REPLAY_CHANNEL_URL = "https://discord.com/channels/1213089665960247367/1213200307836686376";

const TIMELINE = [
  { time: "18:00", label: "Mæta Discord", icon: MessageCircle },
  { time: "18:30", label: "Vera tilbúinn", icon: ShieldCheck },
  { time: "19:30", label: "Match start", icon: Play },
];

const LOBBY_STEPS: { text: string; suffix?: string; link?: string }[] = [
  { text: "Ýta á ✋ í ", suffix: "skráningarrás", link: REPLAY_CHANNEL_URL },
  { text: "Fá DM frá Yunite" },
  { text: "Accept friend request" },
  { text: "Invite bot í party" },
  { text: "Set bot sem leader" },
  { text: "Bot setur kóða" },
  { text: "Bot fer" },
  { text: "Bíða eftir start" },
];

const COMMON_MISTAKES = [
  "Ekki verified",
  "Liðsfélagi ekki verified",
  "DM slökkt",
  "Anonymous ON",
  "Replay OFF (PC)",
];

const DISCORD_CHANNELS = [
  "#almenn-umræða",
  "#tæknileg-aðstoð",
  "#keppnisumræður",
];

export function GameDayGuide() {
  const accent = "arena-green";

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className={`relative pl-6 border-l-2 border-[hsl(var(--${accent})/0.3)] space-y-4`}>
        {TIMELINE.map((item, i) => (
          <div key={i} className="relative">
            <div className={`absolute -left-[calc(1.5rem+5px)] top-1 w-3 h-3 rounded-full bg-[hsl(var(--${accent}))]`} />
            <div className="flex items-center gap-3">
              <span className={`font-mono text-sm font-bold text-[hsl(var(--${accent}))]`}>{item.time}</span>
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-[hsl(var(--destructive)/0.08)] border border-[hsl(var(--destructive)/0.2)]">
        <AlertTriangle className="h-5 w-5 text-[hsl(var(--destructive))] shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-[hsl(var(--destructive))]">
          Kemst ekki inn eftir start.
        </p>
      </div>

      {/* How to join lobby */}
      <div>
        <h4 className="font-display text-sm font-bold mb-3 flex items-center gap-2">
          <Gamepad2 className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
          Hvernig joina ég custom lobby?
        </h4>
        <div className="space-y-2">
          {LOBBY_STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-3 py-1.5">
              <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[hsl(var(--${accent})/0.15)] text-[hsl(var(--${accent}))]`}>
                {i + 1}
              </span>
              <span className="text-sm">
                {step.suffix ? (
                  <>
                    {step.text}
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[hsl(var(--${accent}))] underline underline-offset-2 hover:opacity-80`}
                    >
                      {step.suffix}
                    </a>
                  </>
                ) : (
                  step.text
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
          <HelpCircle className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
          Vandamál?
        </h4>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium mb-1">Ef ekkert DM kemur:</p>
            <ul className="space-y-1 text-muted-foreground pl-4">
              <li className="flex items-start gap-2">
                <span className={`text-[hsl(var(--${accent}))]`}>1.</span>
                Kveiktu á Direct Messages (Privacy Settings → Allow DMs from server members)
              </li>
              <li className="flex items-start gap-2">
                <span className={`text-[hsl(var(--${accent}))]`}>2.</span>
                Reyndu aftur
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Ef bot er niðri:</p>
            <p className="text-muted-foreground pl-4">Bíddu aðeins og reyndu aftur síðar.</p>
          </div>
        </div>
      </div>

      {/* EFTIR HVERN LEIK */}
      <AfterGameSection />
    </div>
  );
}

export function AfterGameSection() {
  const accent = "arena-green";

  return (
    <div className="space-y-4">
      {/* Red alert header */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive)/0.3)]">
        <AlertTriangle className="h-5 w-5 text-[hsl(var(--destructive))] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-display text-sm font-bold text-[hsl(var(--destructive))] uppercase">
            Til þess að stigin þín telji verður þú að senda replay
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Yunite notar Replay File skrár til að reikna stig allra leikmanna. Ef replay er ekki sent inn telja stigin þín ekki.
          </p>
        </div>
      </div>

      <h4 className="font-display text-sm font-bold flex items-center gap-2">
        <Play className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
        Eftir hvern leik – Til að stigin þín telji
      </h4>

      {/* 3 options */}
      <div className="grid gap-3">
        {/* Option 1 */}
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Upload className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
            <h5 className="text-sm font-bold">Draga replay á Yunite</h5>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Farðu á yunite.xyz/replays og dragðu replay skrána beint inn á síðuna eftir leik.
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href="https://yunite.xyz/replays" target="_blank" rel="noopener noreferrer">
              Opna Yunite Replay Upload
              <ExternalLink className="ml-1.5 h-3 w-3" />
            </a>
          </Button>
        </div>

        {/* Option 2 */}
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
            <h5 className="text-sm font-bold">Senda í #replay rás</h5>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Þú getur líka dregið replay skrána beint inn í #replay rásina á Fortnite Ísland Discord.
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href={REPLAY_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
              Opna #replay rás
              <ExternalLink className="ml-1.5 h-3 w-3" />
            </a>
          </Button>
        </div>

        {/* Option 3 – Recommended */}
        <div className={`rounded-lg border-2 border-[hsl(var(--${accent})/0.5)] bg-[hsl(var(--${accent})/0.05)] p-4 relative`}>
          <span className={`absolute -top-2.5 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[hsl(var(--${accent}))] text-background`}>
            Mælt með
          </span>
          <div className="flex items-center gap-2 mb-2">
            <Download className={`h-4 w-4 text-[hsl(var(--${accent}))]`} />
            <h5 className={`text-sm font-bold text-[hsl(var(--${accent}))]`}>Yunite Client (Sjálfvirkt)</h5>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Ef þú setur upp Yunite Client forritið sendir það replay sjálfkrafa eftir hvern leik – svo lengi sem Save Replays er ON í Fortnite stillingum.
          </p>
          <Button size="sm" className="btn-arena-gradient" asChild>
            <a href="https://yunite.xyz/client" target="_blank" rel="noopener noreferrer">
              Sækja Yunite Client
              <ExternalLink className="ml-1.5 h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>

      {/* PC Warning */}
      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border">
        <Monitor className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold mb-0.5">PC Spilarar</p>
          <p className="text-sm text-muted-foreground">
            Farðu í Fortnite → Settings → Game → <span className="font-semibold text-foreground">Save Replays = ON</span>
          </p>
          <p className="text-xs text-[hsl(var(--destructive))] mt-1 font-medium">
            Ef Save Replays er ekki kveikt tapast stigin þín.
          </p>
        </div>
      </div>
    </div>
  );
}

export function CommonMistakes() {
  const accent = "arena-green";
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <CollapsibleTrigger className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-[hsl(var(--destructive))] shrink-0" />
            <span className="font-display font-semibold text-left">Algeng mistök</span>
          </div>
          {open ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-5 pb-5 border-t border-border pt-4">
            <ul className="space-y-2">
              {COMMON_MISTAKES.map((mistake) => (
                <li key={mistake} className="flex items-center gap-3 text-sm">
                  <AlertTriangle className="h-4 w-4 text-[hsl(var(--destructive))] shrink-0" />
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function DiscordRulesCard() {
  const accent = "arena-green";

  return (
    <Card className="bg-card border-[hsl(var(--destructive)/0.3)]">
      <CardContent className="p-5 md:p-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--destructive)/0.1)] flex items-center justify-center shrink-0">
            <MessageCircle className="h-4 w-4 text-[hsl(var(--destructive))]" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-[hsl(var(--destructive))]">
              ALLAR SPURNINGAR FARA Í DISCORD RÁSIR – EKKI DM
            </h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Mótastjórar svara ekki í DM. Notaðu viðeigandi Discord rásir til að fá hjálp.
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {DISCORD_CHANNELS.map((ch) => (
            <span
              key={ch}
              className={`text-xs font-mono px-3 py-1.5 rounded-full bg-[hsl(var(--${accent})/0.1)] text-[hsl(var(--${accent}))] border border-[hsl(var(--${accent})/0.2)]`}
            >
              {ch}
            </span>
          ))}
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            Opna Discord
            <ExternalLink className="ml-1.5 h-3 w-3" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
