'use client';

/**
 * Team Member List Component
 * Displays current team members and pending invites
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { removeTeamMember, cancelInvite } from '@/lib/actions/team';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UserMinus, Clock, X } from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  created_at: string;
  expires_at: string;
}

interface TeamMemberListProps {
  members: TeamMember[];
  invites: PendingInvite[];
  currentUserId: string;
  isOwner: boolean;
}

export function TeamMemberList({
  members,
  invites,
  currentUserId,
  isOwner,
}: TeamMemberListProps) {
  const router = useRouter();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  async function handleRemove() {
    if (!removingId) return;
    setIsRemoving(true);
    try {
      const result = await removeTeamMember(removingId);
      if ('error' in result) {
        toast.error(result.error === 'unauthorized' ? 'Only the owner can remove members.' : 'Failed to remove member.');
      } else {
        toast.success('Team member removed');
        router.refresh();
      }
    } catch {
      toast.error('Failed to remove member');
    } finally {
      setIsRemoving(false);
      setRemovingId(null);
    }
  }

  async function handleCancelInvite(inviteId: string) {
    try {
      await cancelInvite(inviteId);
      toast.success('Invite cancelled');
      router.refresh();
    } catch {
      toast.error('Failed to cancel invite');
    }
  }

  const roleColors: Record<string, string> = {
    owner: 'bg-primary text-primary-foreground',
    admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    member: 'bg-secondary text-secondary-foreground',
  };

  return (
    <div className="space-y-6">
      {/* Current Members */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Members ({members.length})
        </h3>
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                {(member.full_name || member.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {member.full_name || member.email}
                  {member.id === currentUserId && (
                    <span className="text-muted-foreground ml-1">(you)</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={roleColors[member.role] || ''}>
                {member.role}
              </Badge>
              {isOwner && member.id !== currentUserId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => setRemovingId(member.id)}
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pending Invites */}
      {invites.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Pending Invites ({invites.length})
          </h3>
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center justify-between p-3 border rounded-lg border-dashed"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted/50 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{invite.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Expires {new Date(invite.expires_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{invite.role}</Badge>
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCancelInvite(invite.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Remove Member Dialog */}
      <AlertDialog open={!!removingId} onOpenChange={() => setRemovingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member? They will lose access
              to the organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
