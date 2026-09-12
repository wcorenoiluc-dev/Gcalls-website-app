#!/bin/bash
# GATE 1 — prove anonymous access to the repository is gone.
# Run AFTER the owner reports REPOSITORY_PRIVATE_CONFIRMED. Read-only.
# PASS = every probe below is non-200 and the two git probes fail.

unset GITHUB_TOKEN GH_TOKEN GIT_ASKPASS
export GIT_TERMINAL_PROMPT=0 GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null

REPO=wcorenoiluc-dev/Gcalls-website-app
BRANCHES="feature/gcalls-wordpress-migration feature/gcalls-batch2-integrations feature/gcalls-all-pages-content feature/gcalls-website-foundation"
FILES="advanced-filter click-to-call-config contact-profile integrations webphone"
fail=0

probe() { # probe <expect-non-200> <url>
  code=$(curl -sS -o /dev/null --max-time 25 -w '%{http_code}' -r 0-0 "$1")
  if [ "$code" = "200" ] || [ "$code" = "206" ]; then
    printf 'STILL OPEN  %s  %s\n' "$code" "$1"; fail=1
  else
    printf 'blocked     %s  %s\n' "$code" "$1"
  fi
}

echo "== API =="
probe "https://api.github.com/repos/$REPO"
probe "https://api.github.com/repos/$REPO/branches"
probe "https://api.github.com/repos/$REPO/git/blobs/f98ea14c588203a694512d7f57647241bceaa262"

echo "== HTML repo + blob pages =="
probe "https://github.com/$REPO"
for b in $BRANCHES; do
  probe "https://github.com/$REPO/blob/$b/public/images/products/gcalls-plus/gcalls-plus-webphone-desktop-v1.webp"
done
probe "https://github.com/$REPO/commit/a1832c051741a5bbeb5730c5babc519f4c2dc25d"

echo "== raw.githubusercontent — 4 branches x 5 files =="
for b in $BRANCHES; do
  for f in $FILES; do
    probe "https://raw.githubusercontent.com/$REPO/$b/public/images/products/gcalls-plus/gcalls-plus-$f-desktop-v1.webp"
  done
done

echo "== raw by commit SHA (survives a branch delete) =="
for f in $FILES; do
  probe "https://raw.githubusercontent.com/$REPO/a1832c051741a5bbeb5730c5babc519f4c2dc25d/public/images/products/gcalls-plus/gcalls-plus-$f-desktop-v1.webp"
done

echo "== codeload archive =="
probe "https://codeload.github.com/$REPO/tar.gz/refs/heads/feature/gcalls-wordpress-migration"

echo "== anonymous git =="
if git ls-remote "https://github.com/$REPO.git" >/dev/null 2>&1; then
  echo "STILL OPEN  git ls-remote succeeded"; fail=1
else
  echo "blocked     git ls-remote refused"
fi
d=$(mktemp -d)
if git -c protocol.version=2 init -q "$d/p" && \
   git -C "$d/p" fetch -q --depth=1 "https://github.com/$REPO.git" refs/pull/2/head >/dev/null 2>&1; then
  echo "STILL OPEN  anonymous fetch of refs/pull/2/head succeeded"; fail=1
else
  echo "blocked     anonymous fetch of refs/pull/2/head refused"
fi
rm -rf "$d"

echo
[ $fail -eq 0 ] && echo "GATE 1: PASS — no anonymous route returned 200" \
                || echo "GATE 1: FAIL — REPOSITORY_STILL_PUBLIC, do not push anything"
exit $fail
