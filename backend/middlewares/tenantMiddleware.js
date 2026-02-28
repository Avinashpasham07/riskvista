const ensureTenantIsolation = (req, res, next) => {
    // If the client tries to maliciously pass their own tenantId in the body or query, we strip it out.
    // We ONLY trust the tenantId that was extracted securely from the JWT in the `protect` middleware.
    if (req.body && req.body.tenantId) {
        delete req.body.tenantId;
    }

    if (req.query && req.query.tenantId) {
        delete req.query.tenantId;
    }

    // Ensure the protect middleware actually ran and set the tenantId
    if (!req.tenantId) {
        res.status(401);
        throw new Error('Not authorized, tenant ID missing from token');
    }

    next();
};

module.exports = { ensureTenantIsolation };
