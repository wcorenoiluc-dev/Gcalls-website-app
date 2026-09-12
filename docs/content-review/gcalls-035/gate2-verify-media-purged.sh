#!/bin/bash
# GATE 2 — prove the 20 PII URLs no longer serve the old image bytes.
# Run AFTER the five attachments are deleted AND after the owner signals
# ONESHIELD_PURGED. Read-only; never writes image bytes to disk.
#
# PASS when, over three consecutive requests, no URL returns the old bytes.
# Accepted: 404, 410, or any response that is not the old image.
# Old bytes are recognised by content-length matching the recorded original.

Q=/Users/macos/Desktop/Gcalls/PII-QUARANTINE-035
URLS="$Q/pii-urls-20.txt"
[ -r "$URLS" ] || { echo "missing $URLS"; exit 2; }

# recorded byte lengths of the OLD objects, filename -> length
declare -a NAMES LENS
while read -r line; do :; done < /dev/null
sizes=$(cd "$Q/all-20-sizes" && for f in *.webp; do echo "$f $(stat -f%z "$f")"; done)

fail=0
round=0
for round in 1 2 3; do
  echo "===== round $round ====="
  while read -r u; do
    name=${u##*/}
    old=$(echo "$sizes" | awk -v n="$name" '$1==n{print $2}')
    out=$(curl -sS -o /dev/null --max-time 25 -w '%{http_code} %{size_download} %{content_type}' -r 0-0 "$u")
    code=$(echo "$out" | cut -d' ' -f1)
    ctype=$(echo "$out" | cut -d' ' -f3)
    # full length without downloading the body
    clen=$(curl -sSI --max-time 25 "$u" | tr -d '\r' | awk 'tolower($1)=="content-length:"{print $2}' | tail -1)
    if { [ "$code" = "200" ] || [ "$code" = "206" ]; } && [ "$clen" = "$old" ]; then
      printf 'OLD BYTES   %s len=%s  %s\n' "$code" "$clen" "$name"; fail=1
    elif [ "$code" = "200" ] || [ "$code" = "206" ]; then
      printf 'SERVED-NEW  %s len=%s ct=%s  %s  (inspect: not the old object, but still 200)\n' "$code" "$clen" "$ctype" "$name"; fail=1
    else
      printf 'gone        %s  %s\n' "$code" "$name"
    fi
  done < "$URLS"
done

echo
if [ $fail -eq 0 ]; then
  echo "GATE 2 URL CHECK: PASS — 20/20 no longer serve the old bytes, three rounds"
else
  echo "PUBLIC_MEDIA_CACHE_STILL_EXPOSED — do not proceed to visual deploy"
fi
exit $fail
