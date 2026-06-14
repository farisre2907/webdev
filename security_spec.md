# Security Specification: Unpad Merch Hub Firestore Database

This document details the Zero-Trust Firestore Security model and the required verification benchmarks for the `users` collection.

## 1. Data Invariants
1. Each user must have a unique identifier `userId`.
2. The `email` field must be a valid email structure and cannot be modified after registration to prevent account takeover attempts.
3. The `role` field must be either `customer` or `staff`.
4. Users cannot modify or promote their own `role` field from `customer` to `staff` after registration.

## 2. The "Dirty Dozen" Payloads
The following payloads are explicitly designed to breach security and must yield `PERMISSION_DENIED` under all conditions:

1. **Self-Promotion Hack**: A user updates their document seeking to self-assign the `staff` role.
2. **Identity Theft (Impersonation)**: A user tries to create or update another user's document using a different `userId`.
3. **Invalid Email Format Injection**: Storing an arbitrarily long garbage string instead of a valid email address.
4. **Missing Required Fields**: Creating or updating a user document without the `fullName` property.
5. **Role Spoofing on Create**: An unauthenticated user creating a `staff` document directly.
6. **SQL Character Poisoning**: Using a `userId` containing malicious search characters or non-standard characters.
7. **Size Overhead Attack**: Injecting a massive name string (e.g. >1MB) into the `fullName` field.
8. **Null Value Bypass**: Injecting null or undefined variables to bypass strict type-checks.
9. **Unknown Ghost Columns**: Setting arbitrary system-level flags like `isAdmin` or `superUser` on user documents.
10. **E-mail Hijacking**: Updating the `email` of a pre-existing user without authorization.
11. **Blanket Query Invalidation**: Writing list queries without specifying individual user permissions or filtering by owner ID.
12. **Anonymous Record Poisoning**: Creating phantom user documents without logging in or using verified identities.

## 3. Test Runner Definition (`firestore.rules.test.ts`)
The test suite ensures that all "Dirty Dozen" payloads fail:

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

describe('Unpad Merch Hub - Firestore Security Rules Spec', () => {
  let testEnv: any;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'gen-lang-client-0307239137',
      firestore: {
        rules: require('fs').readFileSync('firestore.rules', 'utf8')
      }
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  it('blocks self-promotion to staff role (Dirty Dozen #1)', async () => {
    const unverifiedContext = testEnv.authenticatedContext('user_123');
    const db = unverifiedContext.firestore();
    const docRef = db.collection('users').doc('user_123');
    await assertFails(docRef.update({ role: 'staff' }));
  });

  it('blocks identity theft write (Dirty Dozen #2)', async () => {
    const context = testEnv.authenticatedContext('user_abc');
    const db = context.firestore();
    const docRef = db.collection('users').doc('user_xyz');
    await assertFails(docRef.set({ fullName: 'Impostor', email: 'impostor@gmail.com', role: 'customer' }));
  });
});
```
