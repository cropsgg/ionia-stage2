/**
 * Simplified middleware to replace multi-tenancy functions
 * This version maintains API compatibility but removes actual tenant isolation
 * as we are removing Stage 1 code while preserving Stage 2 functionality
 */

// Simplified tenant context - no longer enforces tenant isolation
export const applyTenantContext = (req, res, next) => {
  // Simply proceed - no tenant isolation
  next();
};

// Helper function that maintains API compatibility but no longer injects tenant context
export const injectTenantContext = (query, req) => {
  // Simply return the original query without modification
  return query;
};

// Simplified protection - no longer restricts access based on tenant
export const protectTenant = (req, res, next) => {
  // Simply proceed - no tenant restriction
  next();
}; 