# Contact verification — /cong-ty/

Source of truth: `src/config/navigation.ts` :: `CONTACT`.

| Field | Value in CONTACT | Rendered as | Verified |
|---|---|---|---|
| email | `sales@gcalls.co` | link text + `mailto:sales@gcalls.co` | yes |
| phone | `028 7302 5469` | link text | yes |
| phoneHref | `tel:+842873025469` | `href` on the phone link | yes |

**No hardcoded copy in the component.** The layout receives `contact` as a prop and renders `contact.email`, `contact.phone`, `contact.phoneHref`; it contains no literal address or number:

- literal `@gcalls.co` in CompanyHubLayout.tsx: 0
- literal `028 ` in CompanyHubLayout.tsx: 0

Gate assertions: exactly one `mailto:`; its href and its text both equal `CONTACT.email`; a `tel:` link shows `CONTACT.phone`; every `tel:` href on the page equals `CONTACT.phoneHref`; no other e-mail address appears; no phone number other than the published one appears; contact CTAs are not stacked adjacently.

`phoneHref` is E.164 (`+84`, trunk 0 dropped) while `phone` keeps the domestic display format — that split is deliberate and documented in navigation.ts.
