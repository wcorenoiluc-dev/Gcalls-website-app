# Targeted PII history purge — PREPARED, NOT RUN

Gate: nothing in this file may be executed until the owner supplies the token
`AUTHORIZE_TARGETED_PII_HISTORY_PURGE`, **and** the repository has been switched
to Private first. As of 2026-08-31 the repo is still `visibility: public`, so
the standing state is `REPOSITORY_STILL_PUBLIC` and every push is stopped.

## What is being removed

Exactly five paths, one commit, no renames and no copies. Verified by walking
every tree in `git rev-list --all`: each blob appears at exactly one path and
nowhere else in history.

| Blob | Path |
| --- | --- |
| `f98ea14c` | `public/images/products/gcalls-plus/gcalls-plus-advanced-filter-desktop-v1.webp` |
| `40cec62f` | `public/images/products/gcalls-plus/gcalls-plus-click-to-call-config-desktop-v1.webp` |
| `249f22fd` | `public/images/products/gcalls-plus/gcalls-plus-contact-profile-desktop-v1.webp` |
| `e8900d80` | `public/images/products/gcalls-plus/gcalls-plus-integrations-desktop-v1.webp` |
| `88a881c4` | `public/images/products/gcalls-plus/gcalls-plus-webphone-desktop-v1.webp` |

Introduced by `a1832c0` "feat: integrate approved Gcalls product imagery"
(2026-08-18). Reachable from four pushed remote branches:

- `origin/feature/gcalls-wordpress-migration`
- `origin/feature/gcalls-batch2-integrations`
- `origin/feature/gcalls-all-pages-content`
- `origin/feature/gcalls-website-foundation`

Not on `main`.

## Backup taken first

`pre-purge-all-refs.bundle` (97.0 MB) in this directory — `git bundle create
… --all`, so every ref is recoverable if the rewrite goes wrong. It lives
outside the repository and outside any public web root.

## Prerequisite: git-filter-repo is not installed

Neither the `git-filter-repo` binary nor the `git_filter_repo` Python module is
present on this machine, and Homebrew is not available either. Install one of:

    pipx install git-filter-repo
    # or drop the single-file script on PATH from
    # https://github.com/newren/git-filter-repo

`git filter-branch` is deliberately not offered as a substitute — it is slow,
error-prone, and leaves replace-refs and reflogs behind.

## The commands

Run against a FRESH MIRROR CLONE, never the working repo — filter-repo removes
the origin remote and rewrites in place.

    # 1. fresh mirror
    git clone --mirror https://github.com/wcorenoiluc-dev/Gcalls-website-app.git gcalls-purge.git
    cd gcalls-purge.git

    # 2. remove exactly the five paths from all refs
    git filter-repo --force \
      --invert-paths \
      --path public/images/products/gcalls-plus/gcalls-plus-advanced-filter-desktop-v1.webp \
      --path public/images/products/gcalls-plus/gcalls-plus-click-to-call-config-desktop-v1.webp \
      --path public/images/products/gcalls-plus/gcalls-plus-contact-profile-desktop-v1.webp \
      --path public/images/products/gcalls-plus/gcalls-plus-integrations-desktop-v1.webp \
      --path public/images/products/gcalls-plus/gcalls-plus-webphone-desktop-v1.webp

    # 3. confirm the blobs are gone from every ref
    git rev-list --all | while read c; do git ls-tree -r "$c"; done \
      | grep -E 'f98ea14c|40cec62f|249f22fd|e8900d80|88a881c4' && echo LEAK || echo CLEAN

    # 4. only then, and only with the token, push the rewrite
    git push --force --mirror https://github.com/wcorenoiluc-dev/Gcalls-website-app.git

## After the push

1. Ask GitHub Support to garbage-collect unreachable objects. Until they do,
   the old blobs stay fetchable by SHA on `github.com`, which is the whole
   reason a delete commit is not sufficient.
2. Verify an anonymous fetch cannot reach them:

       git clone --filter=blob:none --no-checkout \
         https://github.com/wcorenoiluc-dev/Gcalls-website-app.git verify.git
       cd verify.git && git cat-file -e f98ea14c^{blob} && echo STILL_PRESENT || echo GONE

3. Tell every collaborator to re-clone. A rewritten history silently diverges
   from any copy already fetched.

## What this does NOT fix

The website exposure. The same five images are served from the WordPress
Media Library at their own URLs and are entirely independent of Git. Purging
history changes nothing there — see the A2/A4 section of the checkpoint.
