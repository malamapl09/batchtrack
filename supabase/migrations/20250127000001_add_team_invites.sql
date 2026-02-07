-- Team Invites Table
-- Supports invite-based team member onboarding

CREATE TABLE invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    invited_by UUID NOT NULL REFERENCES users(id),
    token UUID NOT NULL DEFAULT gen_random_uuid(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- One pending invite per email per org
    UNIQUE(organization_id, email)
);

-- Index for token lookups
CREATE INDEX idx_invites_token ON invites(token);
CREATE INDEX idx_invites_organization_id ON invites(organization_id);

-- RLS
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;

-- Users can view invites in their organization
CREATE POLICY "Users can view invites in their organization"
    ON invites FOR SELECT
    USING (organization_id = auth.organization_id());

-- Only owners/admins can create invites
CREATE POLICY "Owners and admins can create invites"
    ON invites FOR INSERT
    WITH CHECK (
        organization_id = auth.organization_id()
        AND EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.organization_id = invites.organization_id
            AND users.role IN ('owner', 'admin')
        )
    );

-- Only owners/admins can delete invites
CREATE POLICY "Owners and admins can delete invites"
    ON invites FOR DELETE
    USING (
        organization_id = auth.organization_id()
        AND EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.organization_id = invites.organization_id
            AND users.role IN ('owner', 'admin')
        )
    );

-- Allow updating accepted_at (for invite acceptance)
CREATE POLICY "Invites can be accepted"
    ON invites FOR UPDATE
    USING (organization_id = auth.organization_id())
    WITH CHECK (organization_id = auth.organization_id());
