# GCALLS-051 Phase A — Worktree freeze and inventory

Ngày: 2026-09-07. Coordinator: một writer duy nhất.
Không push, không deploy, không chạm WordPress, không chạm `gcalls.co`.

## Kết luận

Mọi worktree UI V2 đã **clean và có commit**. Ba checkpoint trước đây chỉ tồn tại
dưới dạng file chưa commit nay đã được lưu. Không mất worktree, không mất commit.

Root tree `Gcalls-website-app` vẫn dirty (103 mục) và **không được thao tác**,
đúng ràng buộc. Phase C sẽ tạo worktree mới, không dùng root.

## Bảng inventory

| Worktree | Branch | HEAD | Base | Clean/Dirty | Changed files | Local gate | Preserve action |
|---|---|---|---|---|---|---|---|
| `Gcalls-website-app` (root) | `feature/gcalls-wordpress-migration` | `d8d8615` | — (nhánh WordPress) | **DIRTY** 103 | 17 M + 86 ?? | n/a — WordPress track | Snapshot patch + status list. **Không thao tác** |
| `gcalls-plus-ui-v2` | `feature/gcalls-plus-ui-v2` | `9c562e7` | `d8d8615` | Clean | 28 (trong commit) | `verify-gcalls-plus.mjs` 78 passed / 0 failed | Đã commit từ trước. **Đây là base chung** |
| `Gcalls-products-hub-ui-v2` | `feature/gcalls-products-hub-ui-v2` | `b8128fb` | `9c562e7` | Clean | 29 | `verify-products-hub.mjs` 101 passed / 0 failed | Đã commit từ trước — SHA nay xác định |
| `gcalls-solutions-hub-ui-v2` | `feature/gcalls-solutions-hub-ui-v2` | `5364ed6` | `b8128fb` | Clean | 33 | `verify-solutions-hub.mjs` PASS | Đã commit từ trước |
| `Gcalls-company-hub-ui-v2` | `feature/gcalls-company-hub-ui-v2` | `e60b714` | `5364ed6` | Clean | 29 | `verify-company-hub.mjs` 109 passed / 0 failed | Đã commit từ trước |
| `Gcalls-resources-hub-ui-v2` | `feature/gcalls-resources-hub-ui-v2` | `f27ae0b` | `9c562e7` | Clean | 20 | 6-route audit, 0 stale string | Đã commit từ trước — SHA nay xác định |
| `Gcalls-industries-hub-ui-v2` | `feature/gcalls-industries-hub-ui-v2` | `d39b253` | `9c562e7` | Clean | 22 | Claim guard + QA/route/regression PASS | Đã commit từ trước |
| `Gcalls-integrations-hub-ui-v2` | `feature/gcalls-integrations-hub-ui-v2` | `e1ce51d` | `9c562e7` | Clean | 31 | 6 breakpoint + 6 route PASS | Đã commit từ trước |
| `Gcalls-contact-ui-v2` | `feature/gcalls-contact-ui-v2` | `6d4ab12` | `9c562e7` | Clean | 28 | `CONTACT_*` PASS, `CONTACT_PII_ZERO` | Đã commit từ trước |
| `gcalls-cx-ui-v2` | `feature/gcalls-cx-ui-v2` | `f4dddfb` | `736ef8f` → `9c562e7` | Clean | 68 | CX real-media wired | Đã commit từ trước |
| `gcalls-qaqc-ui-v2` | `feature/gcalls-qaqc-ui-v2` | **`c96f0d6`** (mới) | `9c562e7` | Clean (was 10) | 27 | `verify-qaqc-ui.mjs` 89 passed / 0 failed | **COMMIT MỚI** — trước đó chưa commit |
| `gcalls-voicebot-ui-v2` | `feature/gcalls-voicebot-ui-v2` | **`1cba707`** (mới) | `9c562e7` | Clean (was 8) | 33 | `VOICEBOT_UI_LOCAL_PASS`, 6 breakpoint 0 overflow | **COMMIT MỚI** — trước đó chưa commit |
| `gcalls-react-visual-v2` | `feature/gcalls-react-visual-v2` | **`305aa69`** (mới) | `1f9baac` | Clean (was 5) | 12 | Audit-only, không có gate UI | **COMMIT MỚI** — homepage audit, evidence |
| `Gcalls-homepage-ui-v2` | `feature/gcalls-homepage-ui-v2` | `1f9baac` | `1f9baac` | Clean | 0 | **KHÔNG CÓ** | Trống — xem §Homepage |
| `/private/tmp/gcalls-content` | `feature/gcalls-batch2-integrations` | `a68f386` | — | prunable (dir đã mất) | — | blog track | Không prune. Ref còn trong snapshot |

## Ba commit mới tạo ở Phase A

| SHA | Nội dung | Files | PII/secret scan |
|---|---|---|---|
| `c96f0d6` | QA/QC Center `/qc-bot-ai/` — page-local 1180/50px | 27 (+3341 −214) | 0 hit |
| `1cba707` | Voicebot `/voicebot-ai/` — diagram thay mockup bịa | 33 (+786 −197) | 0 hit |
| `305aa69` | Homepage inventory 13 section (evidence) | 12 (+2062) | 0 hit |

Scan chạy trước mỗi commit: số điện thoại VN, `+84`, email, `sk-*`, `AKIA*`,
`BEGIN` block, `password/api_key/secret/token/Bearer`. Toàn bộ **0 hit thật**.
Hit duy nhất nằm ở `scripts/mask-product-images.mjs` (đã tracked từ trước) và
chính là giá trị placeholder mà script *ghi ra* khi che dữ liệu:
`demo@example.com`, `0900000000`. Không phải PII rò rỉ.

## Dependency graph — đã xác minh bằng lệnh, không suy đoán

```
d8d8615  (feature/gcalls-wordpress-migration)
   |
9c562e7  Gcalls Plus  ◄── BASE CHUNG, xác nhận: merge-base của MỌI nhánh UI V2
   |
   ├─ b8128fb  Products Hub
   │     └─ 5364ed6  Solutions Hub
   │           └─ e60b714  Company Hub
   ├─ f27ae0b  Resources Hub
   ├─ d39b253  Industries Hub
   ├─ e1ce51d  Integrations Hub
   ├─ 6d4ab12  Contact
   ├─ c96f0d6  QA/QC          (mới)
   ├─ 1cba707  Voicebot       (mới)
   └─ 736ef8f  CX diagrams (rollback)
         └─ f4dddfb  CX real-media
```

Ba xác minh mà brief yêu cầu:

1. **`e60b714` có chứa `5364ed6`** — ĐÚNG. `git merge-base --is-ancestor` trả về
   true. Hơn thế, `e60b714` là một chuỗi tuyến tính 3 commit chứa **cả**
   `b8128fb` (Products Hub) **và** `5364ed6` (Solutions Hub).
   → Cherry-pick `e60b714` một mình sẽ **bỏ sót** hai commit cha. Phải lấy cả
     dải `9c562e7..e60b714`, và **không** cherry-pick riêng `b8128fb`/`5364ed6`
     lần nữa.
2. **`f4dddfb` có `736ef8f` là parent** — ĐÚNG, parent trực tiếp. Và parent của
   `736ef8f` là `9c562e7`. Lấy dải `9c562e7..f4dddfb` cho CX real-media;
   `736ef8f` tự động nằm dưới, giữ nguyên vai trò rollback point.
3. **`9c562e7` là checkpoint Gcalls Plus và base chung** — ĐÚNG cả hai vế.
   `git merge-base <branch> 9c562e7` = `9c562e7` với **mọi** nhánh UI V2.

## Bề mặt xung đột cherry-pick — rất nhỏ

Chỉ 4 file bị nhiều checkpoint chạm, và 3 trong số đó nằm cùng một chuỗi
tuyến tính nên **không** xung đột:

| File | Checkpoint | Có xung đột? |
|---|---|---|
| `src/data/hubs.ts` | `b8128fb`, `5364ed6` | Không — cùng chuỗi tuyến tính |
| `src/components/gcalls-cx/visuals.tsx` | `736ef8f`, `f4dddfb` | Không — cùng chuỗi |
| `src/components/gcalls-cx/sections.tsx` | `736ef8f`, `f4dddfb` | Không — cùng chuỗi |
| `src/styles/index.css` | `b8128fb`, `5364ed6`, `e60b714`, `c96f0d6` | **CÓ** — chain vs QA/QC |

`src/styles/index.css` là điểm xung đột **duy nhất** giữa các nhánh độc lập.
Mỗi checkpoint chỉ thêm đúng **một dòng** vào cùng vị trí:

```
+@import './products-hub.css';    (b8128fb)
+@import './solutions-hub.css';   (5364ed6)
+@import './company-hub.css';     (e60b714)
+@import './qa-qc.css';           (c96f0d6)
```

→ Giải quyết: **giữ tất cả các dòng import**, không dùng `ours`/`theirs` cho cả
file. Đây là add/add conflict tầm thường.

64 file `src/`+`scripts/` khác nhau trên toàn bộ checkpoint, phần còn lại rời
nhau hoàn toàn. Kỷ luật "page-local CSS" đã được mọi worker giữ đúng.

## Homepage — phát hiện quan trọng nhất của Phase A

**Không tồn tại bất kỳ implementation Homepage V2 nào.**

- `Gcalls-homepage-ui-v2` clean, HEAD `1f9baac` — commit ngày 2026-08-21, là
  **tổ tiên** của base `9c562e7`. Worktree trống, không có công việc nào.
- `gcalls-react-visual-v2` cũng ở `1f9baac`, chỉ chứa **audit** chứ không phải
  implementation. `docs/homepage-v2/after/` **rỗng**.

Brief ghi "Homepage V2: chưa có checkpoint cuối". Thực tế mạnh hơn: chưa có
checkpoint nào cả, và cũng chưa có source. Phase D phải **xây mới** homepage V2
trong nhánh tích hợp, không phải "hoàn tất" một việc dở dang.

Audit (`305aa69`) đã đo sẵn hiện trạng — đây là input trực tiếp cho Worker 2:

- React `1f9baac` và WordPress demo khớp nội dung **13/13**; cả hai đều có
  **0 `<img>`** — mọi visual homepage hiện nay là SVG dựng.
- `TeamSection.tsx` **tồn tại** trong `src/components/home/` nhưng **không**
  nằm trong 13 section được render. Yêu cầu "chuyển TeamSection vào section
  Làm việc mọi nơi" (§12) do đó là **đưa nội dung mồ côi vào trang**, không
  phải di chuyển một section đang hiển thị.
- §5 và §6 hiển thị tên người Việt + số điện thoại mẫu **không có nhãn "minh
  hoạ"** → đọc như dữ liệu vận hành thật. P0 cho Phase D.
- §7 Analytics là dashboard dựng — rủi ro fabrication cao nhất trang. Ảnh thật
  `analytics-dashboard` và `agent-performance` đều **REFUSED** (chờ owner duyệt).
- Ảnh hero `webphone-desktop` **BLOCKED**; `click-to-call-config` **BLOCKED** vì
  lộ URL nội bộ trong khung hình.
- Seam hiện 64/80px, **không** phải 50px. §3 và §13 có `padding-top: 0`.
- CTA "Đăng ký demo" **lặp 3 lần** ở §1, §11, §13 → vi phạm gate "không CTA trùng".

## Process — không có writer tranh chấp

- **0 dev server** (vite/npm run dev) đang chạy. Không phải dừng gì.
- 4 tiến trình `claude` khác đang sống, **cwd đều là root** `Gcalls-website-app`
  (PID 7935, 8044, 8097 trong Antigravity IDE; PID 10733).
- Trong 60 phút qua **chỉ 1 file** trong toàn bộ `App/` được ghi:
  `.claude/settings.local.json`. Không có file source nào bị chạm.
- → Không có writer tranh chấp trên file source. **Không kill** các session này
  (chúng thuộc về owner). Rủi ro còn lại: chúng ở root dirty tree, nên Phase C
  làm việc trong worktree riêng là đúng.
- `chrome-devtools-mcp` là MCP server, không phải writer.

## Snapshot read-only

`/Users/macos/Desktop/Gcalls/App/.gcalls-051-snapshot/20260907-160829-full/`
(nằm ngoài mọi worktree, đã `chmod a-w`)

| File | Nội dung |
|---|---|
| `all-refs.bundle` | 175 MB — `git bundle --all`, verify: "records a complete history" |
| `gcalls-qaqc-ui-v2-uncommitted.tar.gz` | 12 MB, 29 file — trạng thái *trước* commit |
| `gcalls-voicebot-ui-v2-uncommitted.tar.gz` | 30 MB, 35 file |
| `gcalls-react-visual-v2-uncommitted.tar.gz` | 24 MB, 15 file |
| `root-tracked.patch` | diff 17 file tracked của root |
| `root-status.txt`, `refs.txt`, `worktree-list.txt` | trạng thái đầy đủ |
| `SHA256SUMS` | checksum toàn bộ |

Snapshot đầu tiên (`20260907-160755/`) có tar **thiếu file** do BSD awk không
nhận `RS="\0"`. Đã tạo lại bản `-full` và xác minh số file bên trong. Bản lỗi
được giữ nguyên, không xoá.

**Khoảng trống đã biết:** 86 mục untracked của root tree (`docs/content-review/
gcalls-0XX/`, `.deploy-*`, `.release-*`) mới chỉ được ghi *danh sách*, chưa
archive nội dung. Chấp nhận được vì Phase C→H không thao tác trong root tree.

## Ràng buộc đã giữ

Không dùng `git reset --hard`, `git clean`, `git checkout --`, force push.
Không thao tác trong root dirty tree. Không xoá file. Không prune worktree.
Không push. Không deploy. Không chạm WordPress.

---

`UI_V2_WORKTREES_PRESERVED`
