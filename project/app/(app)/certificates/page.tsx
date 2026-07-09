'use client';

import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { PageHeader } from '@/components/shared/page-header';
import { fetchCertificates } from '@/lib/data';
import type { Certificate } from '@/lib/types';

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCertificates().then((c) => {
        setCerts(c);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Icons.Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates"
        description="Proof of your mastery. Each certificate marks a completed skill path."
        icon="Award"
        actions={
          <Badge className="gap-1 border-gold/30 bg-gold/10 text-gold">
            <Icons.Award className="h-3 w-3" /> {certs.length} earned
          </Badge>
        }
      />

      {certs.length === 0 ? (
        <Card className="border-dashed border-border bg-card/40">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-4">
              <Icons.Award className="h-16 w-16 text-gold/30" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">No certificates yet</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Complete skill paths in the Skill Tree to earn your first certificate.
              Each mastery path rewards a verifiable credential.
            </p>
            <Button className="mt-6 gap-2" asChild>
              <a href="/skills">
                <Icons.GitBranch className="h-4 w-4" /> Explore Skill Tree
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certs.map((cert) => (
            <Card
              key={cert.id}
              className="group relative overflow-hidden border-gold/20 bg-card transition-all hover:border-gold/40 hover:box-glow-gold"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
              <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <Icons.Award className="h-7 w-7" />
                  </div>
                  <Badge className="gap-1 border-gold/30 bg-gold/10 text-gold">
                    <Icons.BadgeCheck className="h-3 w-3" /> Verified
                  </Badge>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{cert.title}</h3>
                <p className="text-sm text-muted-foreground">{cert.skill_name}</p>

                <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Credential ID</span>
                    <span className="font-mono text-foreground">{cert.credential_id || cert.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Issued</span>
                    <span className="text-foreground">
                      {new Date(cert.issued_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1.5 border-gold/20 text-gold hover:bg-gold/10">
                    <Icons.Download className="h-3.5 w-3.5" /> Download
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1.5">
                    <Icons.Share2 className="h-3.5 w-3.5" /> Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
