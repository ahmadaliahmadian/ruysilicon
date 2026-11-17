/**
 * Security Rules Verification Suite (Dirty Dozen Adversarial Scenarios)
 * Documents expected PERMISSION_DENIED outcomes against firestore.rules.
 */
export const DIRTY_DOZEN_CASES = [
  { id: 1, name: 'Unauthenticated read on /users/userA', expected: 'PERMISSION_DENIED' },
  { id: 2, name: 'Cross-user PII read on /users/userA as userB', expected: 'PERMISSION_DENIED' },
  { id: 3, name: 'Shadow field role=admin on /users/userA', expected: 'PERMISSION_DENIED' },
  { id: 4, name: 'UID spoofing on /users/userA', expected: 'PERMISSION_DENIED' },
  { id: 5, name: 'Unverified email creating /orders/ord1', expected: 'PERMISSION_DENIED' },
  { id: 6, name: 'Negative totalAmount on /orders/ord1', expected: 'PERMISSION_DENIED' },
  { id: 7, name: 'Status shortcutting status=delivered on order create', expected: 'PERMISSION_DENIED' },
  { id: 8, name: 'Mutating immutable userId/createdAt on order update', expected: 'PERMISSION_DENIED' },
  { id: 9, name: 'Updating terminal delivered/cancelled order', expected: 'PERMISSION_DENIED' },
  { id: 10, name: 'Unscoped /orders list query without userId filter', expected: 'PERMISSION_DENIED' },
  { id: 11, name: 'Oversized comment or rating>5 on /reviews/rev1', expected: 'PERMISSION_DENIED' },
  { id: 12, name: 'Path ID poisoning with invalid characters or length > 128', expected: 'PERMISSION_DENIED' },
] as const;
