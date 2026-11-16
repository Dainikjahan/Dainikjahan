CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_district ON claims(district);
CREATE INDEX IF NOT EXISTS idx_sources_claim ON sources(claim_id);
CREATE INDEX IF NOT EXISTS idx_sources_domain ON sources(domain);
CREATE INDEX IF NOT EXISTS idx_audit_claim ON audit_log(claim_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_log(actor);
