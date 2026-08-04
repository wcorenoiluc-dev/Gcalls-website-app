/**
 * Vendor-neutral integration visuals — the stable import surface for platform
 * integration pages.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS BARREL EXISTS
 * ---------------------------------------------------------------------------
 * `CrmRecordClickToCallMockup` is vendor-neutral BY CONSTRUCTION: the panel is
 * labelled generically ("CRM RECORD") and carries no logo, wordmark, brand
 * colour, navigation or typography from any CRM, precisely so it cannot be
 * mistaken for a screenshot of one. It depicts only the integration point every
 * platform page actually claims — a Click-to-Call control beside a customer
 * record, with the number masked.
 *
 * It still physically lives under `components/hubspot/` because INT-01 is
 * CONTENT LOCKED and that file is its documented `DEMO_VISUAL_REPLACE_LATER`
 * swap point. Re-exporting rather than moving it keeps the locked page and its
 * checkpoint record untouched, and keeps a single copy of the component — a
 * second platform page must never clone it.
 *
 * This is the same pattern `src/components/product-ui/index.ts` already uses for
 * the approved Home mockups: the barrel is the stable import surface, so when
 * the component is eventually relocated, consumers do not change.
 *
 * DEMO_VISUAL_REPLACE_LATER — replace at the source file, not here.
 * ---------------------------------------------------------------------------
 */

export { CrmRecordClickToCallMockup } from '@/components/hubspot/visuals'
