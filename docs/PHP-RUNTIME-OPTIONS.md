# PHP runtime — what is available, and the fastest way to one

## What was checked, read-only

| Check | Result |
|---|---|
| `php` on PATH | absent |
| PHP outside PATH — `/usr/bin`, `/usr/local/bin`, `/opt/homebrew/bin`, `/opt/local/bin`, MAMP, XAMPP, `/usr/libexec`, `/Applications` | **none** |
| Homebrew / Docker | neither installed |
| SSH client | present (`/usr/bin/ssh`), but **no keys and no host config** for the demo box |
| CI runner config in repo | none (`.github/workflows`, `.gitlab-ci.yml`, `.circleci` all absent) |
| Git remote | **`github.com/wcorenoiluc-dev/Gcalls-website-app`** |

Nothing was installed, no PATH was modified, no credential was sought.

## Why this blocks two things

- `npm run wp:test-leads` — the ~60 lead-pipeline assertions have never executed
- the Batch 1 PHP fixtures — written, never run

`php-lint` parses with a real PHP 8.3 parser and is a genuine syntax gate, but it
proves nothing about behaviour. It is reported separately for that reason.

---

## Option 1 — GitHub Actions *(recommended, fastest)*

The repository is already on GitHub, and `ubuntu-latest` ships PHP 8.3. A
workflow that runs `php -l` across the plugin and executes
`wordpress/tests/leads-test.php` needs no install, no credential and no host
access.

- **Setup:** none beyond merging a workflow file
- **Your single action:** approve/push the branch carrying
  `.github/workflows/php-tests.yml`, then read the run
- **Risk:** none to the live site — the runner never touches it
- **Turnaround:** minutes

## Option 2 — host PHP over SSH / WP-CLI

The demo host runs PHP 8.1 and has WP-CLI available through 1Panel.

- **Your single action:** grant terminal access, or run the two commands
  yourself and paste the output
- **Risk:** low for the tests themselves, but this is the production box
- **Turnaround:** immediate once access exists
- **Note:** I will not obtain or use SSH credentials on my own

## Option 3 — portable user-space PHP

A static PHP build unpacked under the user's home, no sudo, no system install,
verified against the publisher's checksum/signature before use.

- **Your single action:** approve the download source, then I verify and unpack
- **Risk:** lowest privilege of the three, but slowest and adds a binary to the
  machine
- **Turnaround:** longer; only worth it if Options 1 and 2 are both unavailable

---

## Recommendation

**Option 1.** It is the only one that needs no credential, cannot touch
production, and also unblocks the lead-form release — the same runner that runs
the Batch 1 fixtures runs `wp:test-leads`.

**The single action needed from you:** allow a `.github/workflows/php-tests.yml`
to be pushed, and let the run go.
