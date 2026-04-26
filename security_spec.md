# Security Specification - Jonni Armani Media

## 1. Data Invariants
- Site content can only be updated by the authorized administrator (`jonniarmani@gmail.com`).
- All updates must be authenticated.
- The `settings/content` document must follow a strict schema to prevent database poisoning.
- Non-admin users have read-only access to the public content.

## 2. The "Dirty Dozen" Payloads (Unauthorized/Invalid Writes)
1. **Unauthenticated Write**: Attempting to set content without being logged in.
2. **Non-Admin Write**: Authenticated user (not jonniarmani@gmail.com) attempting to edit content.
3. **Identity Spoofing**: Attempting to set the `owner` field to another UID (if applicable).
4. **Schema Poisoning**: Writing a 1MB string to the `brand.name` field.
5. **Collection Injection**: Attempting to write to a collection not defined in the architecture.
6. **Relational Breakage**: Deleting a parent document that sub-collections depend on.
7. **Timestamp Fraud**: Providing a client-side timestamp for `updatedAt` instead of `request.time`.
8. **Invalid Field Injection**: Adding a `isAdmin: true` field to a user profile.
9. **Resource Exhaustion**: Creating 10,000 documents in a single batch.
10. **Type Mismatch**: Sending a boolean where a string is expected for `tagline`.
11. **Path Variable Poisoning**: Using a specially crafted ID like `../secrets` in a document path.
12. **PII Leak**: Attempting to read private user info without ownership.

## 3. Test Runner (Draft)
A `firestore.rules.test.ts` would verify these constraints using the Firebase Rules Emulator.
