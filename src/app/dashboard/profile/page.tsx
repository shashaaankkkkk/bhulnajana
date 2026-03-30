"use client";

import { useSession } from "next-auth/react";
import { User, Mail, Shield, LogOut } from "lucide-react";
import { MotionCard, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-2xl mx-auto h-full space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <MotionCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 border border-border rounded-xl bg-background/50">
            <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-semibold">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="font-medium text-lg text-foreground">{session?.user?.name}</h3>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 border border-border rounded-xl bg-background/50 flex flex-col gap-1">
              <Mail className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-sm font-medium">Email</span>
              <span className="text-sm text-muted-foreground">{session?.user?.email}</span>
            </div>
            <div className="p-4 border border-border rounded-xl bg-background/50 flex flex-col gap-1">
              <Shield className="h-5 w-5 text-muted-foreground mb-1" />
              <span className="text-sm font-medium">Authentication</span>
              <span className="text-sm text-muted-foreground">Credentials-based</span>
            </div>
          </div>
        </CardContent>
      </MotionCard>

      <MotionCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <div className="flex gap-4">
            <Button variant="danger" disabled>Delete Account</Button>
            <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>Sign Out</Button>
          </div>
        </CardContent>
      </MotionCard>
    </div>
  );
}
