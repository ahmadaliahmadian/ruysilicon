# Security Specification — RayaSilicon Hardware Store

## 1. Data Invariants
1. A `users/{userId}` document can only be read, created, or updated by the verified user whose `request.auth.uid == userId`, with `uid == request.auth.uid` immutable after creation.
2. A `users/{userId}/cart/{itemId}` item requires the parent user document to exist (`exists(/databases/$(database)/documents/users/$(userId))`) and belongs strictly to `request.auth.uid == userId`, with `quantity` bounded between `1` and `20`.
3. An `orders/{orderId}` document must have `userId == request.auth.uid`, initial `status == 'confirmed'`, non-negative financial totals, and `createdAt == request.time`. Once `status` reaches `'delivered'` or `'cancelled'`, non-admin updates are blocked (terminal state locking).
4. An `orders/{orderId}/items/{itemId}` line item must belong to the parent order created/owned by `request.auth.uid` (verified via `getAfter` on create or `get` on read).
5. A `reviews/{reviewId}` document is publicly readable (non-PII), writable only by verified authenticated users with `userId == request.auth.uid`, rating `1..5`, and bounded comment length `3..600`.
6. Every document ID must match `^[a-zA-Z0-9_-]+$` and length `<= 128`.

## 2. Dirty Dozen Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated user reading `/users/userA`**: Fails `isSignedIn()`.
2. **User B reading `/users/userA` (PII leak)**: Fails `isOwner(userId)`.
3. **Shadow field injection on `/users/userA` (`{ ...valid, role: "admin" }`)**: Fails `keys().hasOnly(...)`.
4. **UID spoofing on `/users/userA` (`{ ...valid, uid: "userB" }`)**: Fails `incoming().uid == request.auth.uid`.
5. **Unverified email creating `/orders/ord1` (`email_verified: false`)**: Fails `isVerifiedUser()`.
6. **Negative totalAmount on `/orders/ord1` (`totalAmount: -50000`)**: Fails `data.totalAmount >= 0`.
7. **Status shortcutting on `/orders/ord1` creation (`status: "delivered"`)**: Fails `incoming().status == 'confirmed'`.
8. **Modifying immutable `userId` or `createdAt` on `/orders/ord1` update**: Fails `affectedKeys().hasOnly(['status', 'updatedAt'])` and immutability check.
9. **Updating an already `delivered` or `cancelled` order**: Fails terminal state lock.
10. **Querying `/orders` without `where('userId', '==', auth.uid)`**: Fails `allow list` check on `resource.data.userId == request.auth.uid`.
11. **Oversized `comment` (> 600 chars) or invalid `rating: 10` on `/reviews/rev1`**: Fails `isValidReview()`.
12. **Path ID poisoning (`orders/../../bad$id` or 300-char ID)**: Fails `isValidId()`.
