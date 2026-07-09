'use client';

import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/providers/auth-provider';
import { PageHeader } from '@/components/shared/page-header';
import { getSupabaseBrowser } from '@/lib/supabase';

const classes = ['Apprentice', 'Warrior', 'Mage', 'Ranger', 'Scholar', 'Alchemist'];

export default function SettingsPage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [className, setClassName] = useState('Apprentice');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '');
      setBio(profile.bio ?? '');
      setClassName(profile.class_name ?? 'Apprentice');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const supabase = getSupabaseBrowser();
    await supabase
      .from('profiles')
      .update({ full_name: fullName, bio, class_name: className })
      .eq('id', user?.id);
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = (profile?.full_name || profile?.email || 'A')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and adventurer preferences."
        icon="Settings"
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile settings */}
        <Card className="border-border bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
            <CardDescription>Update your adventurer identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary/20">
                <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? ''} />
                <AvatarFallback className="bg-primary/10 font-display text-xl font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" size="sm" className="gap-2">
                  <Icons.Upload className="h-4 w-4" /> Upload Avatar
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">PNG or JPG, max 2MB</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Adventurer Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your hero name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile?.email ?? ''} disabled className="opacity-60" />
                <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Character Class</Label>
              <div className="flex flex-wrap gap-2">
                {classes.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setClassName(c)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      className === c
                        ? 'border-primary/40 bg-primary/10 text-primary box-glow-primary'
                        : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the realm about your quest..."
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg">Notifications</CardTitle>
            <CardDescription>Choose how the realm contacts you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Daily quest reminders', desc: 'Get notified when new daily quests are available', defaultOn: true },
              { label: 'Weekly challenge alerts', desc: 'Be warned when the weekly challenge resets', defaultOn: true },
              { label: 'Streak warnings', desc: 'Alerts when your streak is at risk', defaultOn: true },
              { label: 'Certificate earned', desc: 'Celebrate when you earn a new certificate', defaultOn: true },
              { label: 'AI mentor tips', desc: 'Receive personalized learning suggestions', defaultOn: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.defaultOn} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-border bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg">Privacy</CardTitle>
            <CardDescription>Control your visibility in the realm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Public profile</p>
                <p className="text-xs text-muted-foreground">Allow others to view your adventurer profile</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Show on leaderboard</p>
                <p className="text-xs text-muted-foreground">Display your level and XP on the global rankings</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Share certificates publicly</p>
                <p className="text-xs text-muted-foreground">Make your certificates viewable via credential ID</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/20 bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Sign out</p>
                <p className="text-xs text-muted-foreground">End your current session</p>
              </div>
              <Button type="button" variant="outline" className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => signOut()}>
                <Icons.LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save bar */}
        <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-xl border border-border bg-card/90 p-4 backdrop-blur-sm">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-success">
              <Icons.CheckCircle className="h-4 w-4" /> Settings saved!
            </span>
          )}
          <Button type="submit" disabled={saving} className="gap-2">
            {saving ? <Icons.Loader2 className="h-4 w-4 animate-spin" /> : <Icons.Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
