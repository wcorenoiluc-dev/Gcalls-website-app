#!/bin/bash
# GATE 2 step 7 — HTML / src / srcset / preload / orphan reference sweep.
# Run after deletion. Confirms the product page renders a controlled gap and
# that no markup still points at the five filenames.
PAGE=https://ashernguyenxuanthuy.com/gcalls-plus-webphone/
TMP=$(mktemp)
curl -sS --max-time 40 "$PAGE" > "$TMP"
echo "page bytes: $(wc -c < "$TMP")"
echo
echo "== any reference to the five filenames (src, srcset, preload, og, css) =="
hits=$(grep -oE '[^"'"'"' ]*gcalls-plus-(advanced-filter|click-to-call-config|contact-profile|integrations|webphone)-desktop-v1[^"'"'"' ]*' "$TMP" | sort -u)
if [ -n "$hits" ]; then echo "$hits"; echo "REFERENCES REMAIN"; else echo "none"; fi
echo
echo "== <img> count / broken-image risk =="
echo "img tags:      $(grep -o '<img' "$TMP" | wc -l | tr -d ' ')"
echo "srcset attrs:  $(grep -o 'srcset=' "$TMP" | wc -l | tr -d ' ')"
echo "preload links: $(grep -oE 'rel=.preload' "$TMP" | wc -l | tr -d ' ')"
echo "empty src:     $(grep -o 'src=\"\"' "$TMP" | wc -l | tr -d ' ')"
echo "uploads/2026/08 refs: $(grep -o 'uploads/2026/08' "$TMP" | wc -l | tr -d ' ')"
echo
echo "== sections still present (controlled gap, not a collapsed page) =="
echo "gcalls-product__section: $(grep -o 'gcalls-product__section' "$TMP" | wc -l | tr -d ' ')"
echo "gcalls-product__heading: $(grep -o 'gcalls-product__heading' "$TMP" | wc -l | tr -d ' ')"
rm -f "$TMP"
