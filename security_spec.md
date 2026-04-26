# Security Specification - Jonni Armani Media

## Data Invariants
1. **Public Read**: All configuration in `/settings/content` is publicly readable to allow the website to render.
2. **Admin-Only Write**: Writing to `/settings/content` is strictly restricted to the authorized administrator (`jonniarmani@gmail.com`).
3. **Identity Verification**: Any update must be performed by a verified administrator account.
4. **Schema Integrity**: Updates to the content document must maintain the full structure of the `SiteContent` object.

## The "Dirty Dozen" Payloads (Deny Cases)
1. **Unauthenticated Write**: Attempting to save content without being logged in.
2. **Non-Admin Write**: Attempting to save content as a logged-in user who is not `jonniarmani@gmail.com`.
3. **Malicious Document ID**: Attempting to write to a path other than `settings/content` (e.g., `settings/malicious`).
4. **Shadow Field Injection**: Attempting to add an `isAdmin: true` field to the settings document (if it were part of the schema).
5. **PII Exposure**: Attempting to read unauthorized user data if a `users` collection existed.
6. **Large Payload**: Attempting to inject a string larger than 50KB into a tagline field (Denial of Wallet).
7. **Type Mismatch**: Sending a string for a boolean field (e.g., `promo.enabled: "yes"`).
8. **Invalid Enum**: Sending `type: 'audio'` for a portfolio item.
9. **Missing Required Fields**: Sending a `brand` object without an `email`.
10. **ID Poisoning**: Using a document ID with special characters like `../root`.
11. **Spoofed Timestamp**: Attempting to manually set a `updatedAt` field without server timestamp validation (if implemented).
12. **Recursive List Read**: Attempting to query the entire `settings` collection instead of the specific `content` document.

## Protected Collections
- `/settings/{document=**}`: Master configuration.
- `/leads/{leadId}`: Client inquiries (Admin-only read).
