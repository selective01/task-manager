// In-memory token blacklist for logout invalidation.
// For production, replace with Redis or a DB-backed store.
const tokenBlacklist = new Set();

module.exports = { tokenBlacklist };
