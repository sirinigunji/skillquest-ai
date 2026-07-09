import Link from 'next/link';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketingNavbar } from '@/components/marketing/navbar';
import { SectionHeading } from '@/components/shared/section-heading';
import { XpBar } from '@/components/rpg/xp-bar';
import { LevelBadge } from '@/components/rpg/level-badge';
import { AppLogo } from '@/components/shared/app-logo';

const features = [
  {
    icon: 'ScrollText' as const,
    title: 'Quest-Driven Learning',
    description: 'Every skill becomes an adventure. Accept daily and weekly quests that turn abstract goals into concrete, rewarding steps.',
    accent: 'primary',
  },
  {
    icon: 'GitBranch' as const,
    title: 'Living Skill Trees',
    description: 'Progress through branching skill paths — from foundations to mastery. Unlock new tiers as you grow stronger.',
    accent: 'accent',
  },
  {
    icon: 'Bot' as const,
    title: 'AI Mentor Guidance',
    description: 'Your personal AI mentor analyzes your progress, suggests your next quest, and keeps you on the optimal path.',
    accent: 'primary',
  },
  {
    icon: 'Award' as const,
    title: 'Earn Real Certificates',
    description: 'Complete skill mastery paths to earn verifiable certificates. Your achievements are real, shareable, and permanent.',
    accent: 'gold',
  },
  {
    icon: 'Flame' as const,
    title: 'Streaks & Momentum',
    description: 'Build unbreakable learning streaks. Daily engagement keeps your momentum alive and rewards consistency.',
    accent: 'gold',
  },
  {
    icon: 'TrendingUp' as const,
    title: 'Track Your Growth',
    description: 'Beautiful analytics show your XP curve, skill distribution, and time invested. See yourself leveling up in real time.',
    accent: 'accent',
  },
];

const accentMap = {
  primary: 'border-primary/20 bg-primary/10 text-primary',
  accent: 'border-accent/20 bg-accent/10 text-accent',
  gold: 'border-gold/20 bg-gold/10 text-gold',
};

const pricingTiers = [
  {
    name: 'SkillQuest Free',
    icon: 'Shield' as const,
    price: '\u20B90',
    period: 'Forever',
    description: 'Begin your adventure with everything you need to level up.',
    features: [
      'Unlimited learning paths',
      'XP and leveling system',
      'AI-generated daily quests',
      'Skill trees',
      'Achievement badges',
      'Basic AI mentor',
      'Standard certificates',
      'Community access',
      'Progress tracking',
    ],
    cta: 'Begin Your Quest',
    href: '/register',
    highlight: false,
  },
  {
    name: 'SkillQuest Pro',
    icon: 'Crown' as const,
    price: '\u20B999',
    period: '/ 3 Months',
    description: 'Unlock the full arsenal of premium tools for mastery.',
    badge: 'Best Value',
    features: [
      'Everything in Free',
      'Unlimited AI mentor conversations',
      'Advanced AI-generated quests',
      'Personalized learning roadmap',
      'Premium certificate designs',
      'AI mock interviews',
      'Resume builder',
      'Exclusive avatars and themes',
      'Priority support',
      'Early access to new features',
    ],
    cta: 'Upgrade to Pro',
    href: '/register',
    highlight: true,
  },
];

const testimonials = [
  {
    name: 'Maya Chen',
    role: 'Software Engineer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    quote: 'I went from dabbling in code to shipping a full-stack app in 8 weeks. The quest system made learning addictive in the best way.',
    level: 34,
  },
  {
    name: 'Diego Ramirez',
    role: 'Product Designer',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    quote: 'The skill tree gave my self-study a structure I never had. I earned my UX Mastery certificate and landed a senior role.',
    level: 41,
  },
  {
    name: 'Aisha Okonkwo',
    role: 'Polyglot Learner',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    quote: 'Three languages and counting. The streak system kept me practicing every single day for 200+ days. It genuinely changed my life.',
    level: 52,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <MarketingNavbar />

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center px-4 pt-20">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-40" />
        <div className="absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-accent/20 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="animate-fade-in">
            <Badge className="mb-6 gap-2 border-primary/30 bg-primary/10 text-primary">
              <Icons.Sparkles className="h-3.5 w-3.5" />
              Your real life — gamified
            </Badge>
          </div>

          <h1 className="animate-fade-up font-display text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Level Up Your
            <br />
            <span className="gradient-text text-glow-primary">Real Life</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg text-muted-foreground" style={{ animationDelay: '0.1s' }}>
            SkillQuest AI turns learning into an RPG adventure. Complete quests, grow your skill
            tree, earn certificates, and watch yourself level up — one quest at a time.
          </p>

          <div className="mt-8 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: '0.2s' }}>
            <Link href="/register">
              <Button size="lg" className="gap-2 text-base">
                <Icons.Swords className="h-5 w-5" />
                Begin Your Quest
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="gap-2 text-base">
                <Icons.LogIn className="h-5 w-5" />
                Sign In
              </Button>
            </Link>
          </div>

          {/* Floating preview card */}
          <div className="mx-auto mt-16 max-w-md animate-float" style={{ animationDelay: '0.4s' }}>
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm box-glow-primary">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <LevelBadge level={12} size="md" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-semibold text-foreground">Adventurer</span>
                      <Badge className="gap-1 border-gold/30 bg-gold/10 text-gold">
                        <Icons.Flame className="h-3 w-3" /> 28-day streak
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <XpBar current={340} max={500} level={12} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to level up"
            description="A complete RPG-inspired learning system that transforms how you build real-world skills."
            align="center"
            className="mb-14"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = Icons[f.icon];
              return (
                <Card
                  key={f.title}
                  className="group border-border bg-card/60 transition-all duration-300 hover:border-primary/30 hover:box-glow-primary"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <CardHeader>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg border ${accentMap[f.accent as keyof typeof accentMap]}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="mt-2 text-xl">{f.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{f.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="relative px-4 py-24">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[150px]" />
        <div className="relative mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Pricing"
            title="Choose your path"
            description="Begin free forever. Upgrade to Pro when you're ready to claim mastery."
            align="center"
            className="mb-14"
          />

          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            {pricingTiers.map((tier) => {
              const TierIcon = Icons[tier.icon];
              return (
                <Card
                  key={tier.name}
                  className={`relative flex flex-col transition-all duration-300 ${
                    tier.highlight
                      ? 'border-gold/40 bg-card box-glow-gold md:scale-105 animate-glow-pulse'
                      : 'border-border bg-card/60 hover:border-primary/20'
                  }`}
                >
                  {tier.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="gap-1.5 gradient-gold text-gold-foreground px-4 py-1 text-xs font-bold shadow-lg">
                        <Icons.Star className="h-3.5 w-3.5 fill-current" /> {tier.badge}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg border ${
                          tier.highlight
                            ? 'border-gold/40 bg-gold/10 text-gold'
                            : 'border-primary/20 bg-primary/10 text-primary'
                        }`}
                      >
                        <TierIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="font-display text-xl">{tier.name}</CardTitle>
                        <CardDescription className="mt-0.5">{tier.description}</CardDescription>
                      </div>
                    </div>

                    <div className="mt-5 flex items-baseline gap-2">
                      <span
                        className={`font-display text-5xl font-bold ${
                          tier.highlight ? 'text-gold text-glow-gold' : 'text-foreground'
                        }`}
                      >
                        {tier.price}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">{tier.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col pt-0">
                    <ul className="flex-1 space-y-2.5">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2.5 text-sm">
                          {tier.highlight ? (
                            <Icons.Sparkles className="h-4 w-4 shrink-0 text-gold" />
                          ) : (
                            <Icons.Check className="h-4 w-4 shrink-0 text-success" />
                          )}
                          <span className="text-foreground/90">{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={tier.href} className="mt-6">
                      <Button
                        className={`w-full gap-2 text-base ${
                          tier.highlight
                            ? 'gradient-gold text-gold-foreground hover:opacity-90'
                            : ''
                        }`}
                        variant={tier.highlight ? 'default' : 'outline'}
                        size="lg"
                      >
                        {tier.highlight && <Icons.Crown className="h-5 w-5" />}
                        {tier.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Prices in Indian Rupees. No auto-renewal. Cancel anytime.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="relative px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Testimonials"
            title="Adventurers are leveling up"
            description="Real people, real growth. Here's what the quest has done for them."
            align="center"
            className="mb-14"
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border bg-card/60">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icons.Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground">"{t.quote}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-12 w-12 rounded-full border border-primary/20 object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                    <Badge className="gap-1 border-primary/30 bg-primary/10 text-primary">
                      <Icons.Star className="h-3 w-3" /> LV {t.level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <Card className="relative overflow-hidden border-primary/30 bg-card box-glow-primary">
            <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/20 blur-[100px]" />
            <CardContent className="relative p-10 text-center sm:p-16">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Your adventure awaits
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join thousands of adventurers turning real-life learning into an epic journey.
                Your first quest is just a click away.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-2 text-base">
                    <Icons.Swords className="h-5 w-5" />
                    Begin Your Quest
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="text-base">
                    I already have an account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-4 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <AppLogo />
          <p className="text-sm text-muted-foreground">
            Level up your real life. One quest at a time.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground">Features</Link>
            <Link href="#pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="/login" className="hover:text-foreground">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
