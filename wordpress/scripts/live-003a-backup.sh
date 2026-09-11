#!/usr/bin/env bash
#
# GCALLS-WORDPRESS-LIVE-HARDENING-003A §3 — backup gate.
#
# Run this ON THE HOST (1Panel terminal or SSH), from anywhere:
#
#   bash live-003a-backup.sh
#
# It is NOT destructive. It only reads the site and writes backups outside the
# document root. Nothing in 003A that deletes or edits anything may start until
# this script exits 0.
#
# It refuses to guess. The document root is verified by the presence of
# wp-config.php AND wp-cron.php, not by convention — this install has NO
# public_html, and a path built on that assumption produces a cron line that
# fails silently and a backup of an empty directory.
#
# Database credentials are read from wp-config.php into a 0600 defaults-file
# and are never echoed, never passed as argv (where `ps` would show them), and
# never written to the archive listing.

set -euo pipefail

DOMDIR="${DOMDIR:-/home/xvfjmtpchosting/domains/ashernguyenxuanthuy.com}"
BK="${BK:-/home/xvfjmtpchosting/backups/003a}"

say()  { printf '%s\n' "$*"; }
ok()   { printf '  ok   %s\n' "$*"; }
fail() { printf '  FAIL %s\n' "$*"; FAILED=1; }
FAILED=0

say "GCALLS 003A — BACKUP GATE"
say ""

# ---------------------------------------------------------------- 1. root
say "1. Document root"
cd "$DOMDIR"
say "  pwd:      $(pwd)"
say "  realpath: $(realpath .)"
[ -f "$DOMDIR/wp-config.php" ] && ok "wp-config.php present" || fail "wp-config.php missing — WRONG ROOT"
[ -f "$DOMDIR/wp-cron.php" ]   && ok "wp-cron.php present"   || fail "wp-cron.php missing — WRONG ROOT"
[ -d "$DOMDIR/wp-content" ]    && ok "wp-content/ present"   || fail "wp-content/ missing — WRONG ROOT"
if [ -d "$DOMDIR/public_html" ]; then
  fail "a public_html/ exists here — stop and re-confirm which directory WordPress serves from"
fi
[ "$FAILED" -eq 0 ] || { say ""; say "ABORT: document root not confirmed. Nothing was written."; exit 2; }

# The backup directory must not be reachable over HTTP.
case "$BK" in
  "$DOMDIR"|"$DOMDIR"/*) say ""; say "ABORT: \$BK ($BK) is inside the web root."; exit 2 ;;
esac
mkdir -p "$BK"
ok "backup dir outside web root: $BK"

STAMP="$(date +%Y%m%d-%H%M%S)"
say "  stamp:    $STAMP"

# ---------------------------------------------------------- 2. filesystem
say ""
say "2. Filesystem archive"
FILES="$BK/files-$STAMP.tar.gz"
tar -czf "$FILES" -C "$DOMDIR" .
tar -tzf "$FILES" >/dev/null && ok "archive lists without error" || fail "archive will not list"

for want in './wp-config.php' './wp-cron.php'; do
  tar -tzf "$FILES" | grep -qx "$want" && ok "contains $want" || fail "missing $want"
done
# .htaccess and robots.txt are required by the checkpoint but may legitimately
# be absent on a fresh install; report rather than assume.
for want in './.htaccess' './robots.txt'; do
  if tar -tzf "$FILES" | grep -qx "$want"; then ok "contains $want"
  else say "  note  $want not present on the host"; fi
done
CONTENT_N="$(tar -tzf "$FILES" | grep -c '^\./wp-content/' || true)"
[ "$CONTENT_N" -gt 0 ] && ok "contains wp-content/ ($CONTENT_N entries)" || fail "wp-content/ not in archive"
UPLOADS_N="$(tar -tzf "$FILES" | grep -c '^\./wp-content/uploads/' || true)"
say "  note  uploads entries: $UPLOADS_N"
THEMES="$(tar -tzf "$FILES" | sed -n 's|^\./wp-content/themes/\([^/]*\)/$|\1|p' | tr '\n' ' ')"
PLUGINS="$(tar -tzf "$FILES" | sed -n 's|^\./wp-content/plugins/\([^/]*\)/$|\1|p' | tr '\n' ' ')"
say "  note  themes:  $THEMES"
say "  note  plugins: $PLUGINS"

say "  size:     $(ls -l "$FILES" | awk '{print $5}') bytes"
say "  mtime:    $(date -r "$FILES" 2>/dev/null || stat -c %y "$FILES" 2>/dev/null)"
sha256sum "$FILES" | tee "$FILES.sha256"

# ------------------------------------------------------------ 3. database
say ""
say "3. Database dump"
CNF="$(mktemp)"
DBNAME_OUT="$(mktemp)"
chmod 600 "$CNF" "$DBNAME_OUT"
trap 'rm -f "$CNF" "$DBNAME_OUT"' EXIT

# The PHP helper reads both of these from the environment.
export DOMDIR DBNAME_OUT

# Parsed by PHP so quoting, constants and comments are handled the way
# WordPress itself would handle them. Nothing is printed.
PHPBIN="$(command -v php || true)"
if [ -z "$PHPBIN" ]; then
  say "  note  no PHP CLI on PATH — cannot read wp-config.php safely here."
  say "  note  Export the database from phpMyAdmin instead (SQL, gzip, DROP TABLE on),"
  say "  note  save it to $BK, then re-run the verify block at the end of this script."
  DB_DONE=0
else
  "$PHPBIN" -r '
    $c = file_get_contents(getenv("DOMDIR")."/wp-config.php");
    foreach (["DB_NAME","DB_USER","DB_PASSWORD","DB_HOST"] as $k) {
      if (preg_match("/define\(\s*[\x27\"]".$k."[\x27\"]\s*,\s*[\x27\"](.*?)[\x27\"]\s*\)/s", $c, $m)) $v[$k]=$m[1];
    }
    if (count($v ?? []) < 4) { fwrite(STDERR, "parse failed\n"); exit(1); }
    $host = $v["DB_HOST"]; $port = 3306;
    if (strpos($host, ":") !== false) { [$host,$port] = explode(":", $host, 2); }
    printf("[client]\nhost=%s\nport=%s\nuser=%s\npassword=%s\n", $host, $port, $v["DB_USER"], $v["DB_PASSWORD"]);
    file_put_contents(getenv("DBNAME_OUT"), $v["DB_NAME"]);
  ' > "$CNF" 2>/dev/null && DB_PARSED=1 || DB_PARSED=0

  if [ "$DB_PARSED" -ne 1 ]; then
    say "  note  could not parse wp-config.php — use phpMyAdmin (see §3 of the runbook)."
    DB_DONE=0
  else
    DBNAME="$(cat "$DBNAME_OUT" 2>/dev/null || true)"
    SQL="$BK/db-$STAMP.sql.gz"
    if [ -z "$DBNAME" ]; then
      say "  note  DB_NAME not recovered — use phpMyAdmin (see §3 of the runbook)."
      DB_DONE=0
    elif command -v mysqldump >/dev/null 2>&1; then
      mysqldump --defaults-extra-file="$CNF" \
        --single-transaction --quick --add-drop-table --default-character-set=utf8mb4 \
        "$DBNAME" | gzip -9 > "$SQL"
      DB_DONE=1
    else
      say "  note  mysqldump not installed — use phpMyAdmin (see §3 of the runbook)."
      DB_DONE=0
    fi
  fi
fi

if [ "${DB_DONE:-0}" -eq 1 ]; then
  gzip -t "$SQL" && ok "gzip integrity" || fail "gzip corrupt"
  [ -s "$SQL" ] && ok "dump not empty" || fail "dump is empty"
  TABLES="$(zcat "$SQL" | grep -c 'CREATE TABLE' || true)"
  [ "$TABLES" -ge 10 ] && ok "CREATE TABLE count: $TABLES" || fail "only $TABLES tables — dump looks truncated"
  zcat "$SQL" | tail -2 | grep -q 'Dump completed' && ok "dump terminated cleanly" \
    || say "  note  no 'Dump completed' trailer — inspect the tail manually"
  say "  size:     $(ls -l "$SQL" | awk '{print $5}') bytes"
  sha256sum "$SQL" | tee "$SQL.sha256"
else
  fail "database dump not produced by this script — do it in phpMyAdmin before continuing"
fi

# ------------------------------------------------- 4. PHP 8.3 CLI discovery
say ""
say "4. PHP 8.3 CLI (for §7 cron — discovery only, nothing is scheduled)"
FOUND=""
for c in "$(command -v php || true)" "$(command -v php8.3 || true)" \
         /usr/local/php83/bin/php /opt/php83/bin/php /usr/bin/php8.3 \
         /opt/alt/php83/usr/bin/php /usr/local/bin/php83 /www/server/php/83/bin/php; do
  [ -n "$c" ] && [ -x "$c" ] || continue
  V="$("$c" -v 2>/dev/null | head -1 || true)"
  case "$V" in
    "PHP 8.3"*) say "  ok   $c — $V"; [ -z "$FOUND" ] && FOUND="$c" ;;
    PHP*)       say "  --   $c — $V (not 8.3)" ;;
  esac
done

say ""
if [ -n "$FOUND" ]; then
  ok "PHP 8.3 CLI: $FOUND"
  say ""
  say "  Exact cron line for §7.2 (verify by hand first, record the exit code):"
  say ""
  say "    */5 * * * * $FOUND -q $DOMDIR/wp-cron.php >/dev/null 2>&1"
  say ""
  say "  Manual test, output NOT suppressed:"
  say "    $FOUND -q $DOMDIR/wp-cron.php; echo \"exit=\$?\""
else
  say "  note  no PHP 8.3 CLI found — use the §7.3 HTTP fallback:"
  say ""
  say "    */5 * * * * curl -fsS --max-time 60 -A \"Gcalls-WP-Cron/1.0\" \\"
  say "      \"https://ashernguyenxuanthuy.com/wp-cron.php?doing_wp_cron\" >/dev/null 2>&1"
fi

# ------------------------------------------------------------------ report
say ""
if [ "$FAILED" -eq 0 ]; then
  say "BACKUP GATE: PASS"
  say ""
  say "Download these and re-verify the hashes on the laptop before doing anything"
  say "destructive (shasum -a 256 -c <file>.sha256):"
  ls -l "$BK"/*"$STAMP"* | sed 's/^/  /'
  say ""
  say "DISABLE_WP_CRON stays off until §7.5 proves a system cron actually ran."
  exit 0
else
  say "BACKUP GATE: FAIL — do not proceed to §6, §7, §8, §9 or §10."
  exit 1
fi
