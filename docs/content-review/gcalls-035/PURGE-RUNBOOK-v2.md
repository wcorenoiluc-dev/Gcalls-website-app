# GCALLS-035 — Targeted PII history purge · PREPARED, NOT RUN

Thay thế `gcalls-034/PURGE-RUNBOOK.md`. Bản 034 vi phạm ba quy tắc của Gate 3
(dùng `git push --force --mirror`, không dùng `--force-with-lease`, và sẽ đụng cả
ref không chứa blob). Bản này sửa cả ba.

**Không lệnh nào dưới đây được chạy cho tới khi có ĐỦ hai điều kiện:**

1. Gate 1 PASS — repo Private, `gate1-verify-anonymous-access.sh` trả PASS.
2. Token `AUTHORIZE_TARGETED_PII_HISTORY_PURGE`.

Tình trạng 2026-09-01: repo vẫn `visibility: public` → **REPOSITORY_STILL_PUBLIC**,
mọi push đang dừng.

## Điều kiện tiền-token — trạng thái

| Yêu cầu | Trạng thái |
| --- | --- |
| Repo Private | **CHƯA** — vẫn public |
| Backup bundle 97 MB | **XONG** — dựng lại, 15 ref, `git bundle verify` okay |
| Old tip SHA từng affected branch | **XONG** — bảng dưới |
| Đúng 1 commit, 5 path, 5 blob | **XONG** — xác minh lại hôm nay |
| Tags / PR refs / release assets / LFS | **XONG** — xem "Phát hiện" |
| Lệnh chuẩn bị, chưa chạy | **XONG** — file này |

## Phạm vi

Một commit: `a1832c051741a5bbeb5730c5babc519f4c2dc25d`. Năm path, năm blob, không
rename, không copy — bảng đầy đủ trong `INCIDENT-RECORD.md` §6.

### Ref được rewrite (4)

| Branch | Old tip SHA (dùng cho lease) |
| --- | --- |
| `feature/gcalls-all-pages-content` | `1f5fa57aab7b05c3749e12d8a232a9fc9c38df8c` |
| `feature/gcalls-batch2-integrations` | `a68f386e88723cffbd6c4f1aec346ff664360952` |
| `feature/gcalls-website-foundation` | `1f9baac7c7a36d84d75a0ee760a26c250a7e792e` |
| `feature/gcalls-wordpress-migration` | `25f0420ef52eb985cc2bca3317b83cc5c7360812` |

### Ref KHÔNG được rewrite, KHÔNG được push (quy tắc 6)

`main` (`21f9084…`), tag `gcalls-website-demo-v1` (`cd3b77a…`), `refs/pull/1/head`
— `a1832c0` không phải ancestor của bất kỳ ref nào trong số này và tip của chúng
không chứa blob nào.

### Phát hiện chặn: PR refs không thể rewrite

`refs/pull/2/head` và `refs/pull/2/merge` **mang đủ 5 blob**, và đã chứng minh
được là **fetch ẩn danh thành công** hôm nay. GitHub không cho ghi vào
`refs/pull/*`; chủ repo không xoá hay force-push được chúng.

→ Purge lịch sử **không** đóng được đường này. Chỉ hai thứ đóng được: repo
Private (chặn ẩn danh ngay), và GitHub Support GC/gỡ PR refs (dọn triệt để).
Đây là lý do Gate 1 phải xong trước, không phải chỉ là thủ tục.

### Không có

0 release, 0 release asset, 0 tag trên remote, 0 fork, không Git LFS.

## Việc local phải bảo toàn trước khi chạy

`feature/gcalls-wordpress-migration` local đang **6 commit** trước remote
(`fb18a72`…`d8d8615`), không commit nào chạm 5 path PII. Sau rewrite phải replay
lên lịch sử mới, nếu không sẽ mất. Xuất patch trước:

    git format-patch -6 --output-directory \
      /Users/macos/Desktop/Gcalls/PII-QUARANTINE-035/git/local-unpushed/ \
      origin/feature/gcalls-wordpress-migration..HEAD

## Các bước

### 1. venv tạm ngoài repo

    python3 -m venv /Users/macos/Desktop/Gcalls/.purge-venv
    /Users/macos/Desktop/Gcalls/.purge-venv/bin/pip install --upgrade pip
    /Users/macos/Desktop/Gcalls/.purge-venv/bin/pip install git-filter-repo
    FR=/Users/macos/Desktop/Gcalls/.purge-venv/bin/git-filter-repo
    "$FR" --version

Không `pip install` vào Python hệ thống, không sửa global. Xoá venv sau khi xong.

### 2. Mirror clone mới

    cd /Users/macos/Desktop/Gcalls
    git clone --mirror https://github.com/wcorenoiluc-dev/Gcalls-website-app.git gcalls-purge.git
    cd gcalls-purge.git
    git for-each-ref --format='%(refname) %(objectname)' > ../refs-before.txt

`clone --mirror` không lấy `refs/pull/*` — đúng như mong muốn, ta không rewrite chúng.

### 3. Purge đúng năm path

    "$FR" --force --invert-paths \
      --path public/images/products/gcalls-plus/gcalls-plus-advanced-filter-desktop-v1.webp \
      --path public/images/products/gcalls-plus/gcalls-plus-click-to-call-config-desktop-v1.webp \
      --path public/images/products/gcalls-plus/gcalls-plus-contact-profile-desktop-v1.webp \
      --path public/images/products/gcalls-plus/gcalls-plus-integrations-desktop-v1.webp \
      --path public/images/products/gcalls-plus/gcalls-plus-webphone-desktop-v1.webp

Không dùng `--path-glob`: bảy webp khác trong cùng commit **phải ở lại**.

### 4. Kiểm trước khi push

    # 4a. năm blob không còn reachable
    git rev-list --all | while read c; do git ls-tree -r "$c"; done | \
      grep -E 'f98ea14c|40cec62f|249f22fd|e8900d80|88a881c4' && echo LEAK || echo CLEAN

    # 4b. main và tag KHÔNG được đổi SHA
    git rev-parse refs/heads/main          # phải = 21f90842c233e465f4eed41bb6ed0847168bf71b
    git rev-parse refs/tags/gcalls-website-demo-v1   # phải = cd3b77ad4e0042a2fd044cb38b4b06706e72a97b

    # 4c. bảy webp còn lại vẫn còn
    git ls-tree -r refs/heads/feature/gcalls-wordpress-migration \
      -- public/images/products/gcalls-plus/ | wc -l    # phải = 7

Nếu 4a ra LEAK, hoặc 4b lệch, **dừng**. Không push.

### 5. Push từng branch bằng lease riêng — không mirror, không `--all`

    R=https://github.com/wcorenoiluc-dev/Gcalls-website-app.git

    git push "$R" \
      refs/heads/feature/gcalls-all-pages-content:refs/heads/feature/gcalls-all-pages-content \
      --force-with-lease=refs/heads/feature/gcalls-all-pages-content:1f5fa57aab7b05c3749e12d8a232a9fc9c38df8c

    git push "$R" \
      refs/heads/feature/gcalls-batch2-integrations:refs/heads/feature/gcalls-batch2-integrations \
      --force-with-lease=refs/heads/feature/gcalls-batch2-integrations:a68f386e88723cffbd6c4f1aec346ff664360952

    git push "$R" \
      refs/heads/feature/gcalls-website-foundation:refs/heads/feature/gcalls-website-foundation \
      --force-with-lease=refs/heads/feature/gcalls-website-foundation:1f9baac7c7a36d84d75a0ee760a26c250a7e792e

    git push "$R" \
      refs/heads/feature/gcalls-wordpress-migration:refs/heads/feature/gcalls-wordpress-migration \
      --force-with-lease=refs/heads/feature/gcalls-wordpress-migration:25f0420ef52eb985cc2bca3317b83cc5c7360812

Bốn lệnh, bốn ref, bốn lease. **Không** `--mirror`, **không** `--all`,
**không** push `main`, tag hay PR ref.

Nếu bất kỳ lease nào không khớp: **dừng ngay**. Nghĩa là remote đã đổi kể từ khi
ghi old tip; phải fetch lại, xác minh lại inventory, ghi lease mới. Tuyệt đối
không thay bằng `--force` thuần để vượt qua.

### 6. Xác minh trên clone sạch ở thư mục tạm

    cd "$(mktemp -d)"
    git clone --mirror https://github.com/wcorenoiluc-dev/Gcalls-website-app.git verify.git
    cd verify.git
    git fetch origin '+refs/pull/*:refs/pull/*' 2>/dev/null || true
    for b in f98ea14c588203a694512d7f57647241bceaa262 \
             40cec62ff6c24a6ea3fbf245f74bd9897e687204 \
             249f22fd39551c4d664d42322dc2e3e51cba072d \
             e8900d80286857dfc8e17ef5bbf10570dc69d6fe \
             88a881c4f397bed4369f7c3e79399b8a83b32cf8; do
      git cat-file -e "$b^{blob}" 2>/dev/null && echo "STILL PRESENT $b" || echo "gone $b"
    done
    git rev-list --all | while read c; do git ls-tree -r "$c"; done | \
      grep -c 'gcalls-plus-\(advanced-filter\|click-to-call-config\|contact-profile\|integrations\|webphone\)-desktop-v1'

Dự kiến: 5 dòng `gone`, đếm cuối `0`. Lưu ý loose object chưa bị GC vẫn có thể
fetch được theo SHA trên github.com cho tới khi GitHub Support dọn — đó là mục
tiếp theo, không phải lỗi của bước này.

### 7. Chạy lại Gate 1

    ./docs/content-review/gcalls-035/gate1-verify-anonymous-access.sh

Phải vẫn PASS: repo còn Private sau khi push.

### 8. Ghi lại và dọn

- Ghi old/new SHA của 4 branch vào `INCIDENT-RECORD.md`.
- Replay 6 commit local từ `git/local-unpushed/`.
- `rm -rf /Users/macos/Desktop/Gcalls/.purge-venv /Users/macos/Desktop/Gcalls/gcalls-purge.git`
- Giữ `pre-purge-all-refs.bundle` làm recovery bundle.
- Mở ticket GitHub Support: GC unreachable objects **và** PR refs của PR #2.
- Báo mọi collaborator phải clone lại.

## Khôi phục nếu hỏng

    git clone /Users/macos/Desktop/Gcalls/PII-QUARANTINE-035/git/pre-purge-all-refs.bundle restore
    # rồi push lại từng ref bằng SHA trong bảng "Old tip" ở trên
