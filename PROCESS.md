# Belinus Site Update Process

## Overview
This documents how to make live page edits on master.belinus.net using Respira + WordPress.

---

## Current Setup
- **Theme**: belinus-child (git-tracked at `belinus-wordpress/`)
- **Page content**: Stored in WordPress DB, NOT in git
- **Theme files** (CSS/JS/PHP): Pushed to GitHub `main` branch, auto-deployed
- **Respira mode**: Config = direct editing DISABLED (requires staging/approval)

---

## How Page Content Works

| What | Where stored | Git-tracked |
|------|-------------|-------------|
| Theme CSS | `/wp-content/themes/belinus-child/style.css` | YES |
| Theme JS | `/wp-content/themes/belinus-child/js/belinus.js` | YES |
| Theme PHP | `/wp-content/themes/belinus-child/functions.php` | YES |
| Page content (post_content) | WordPress DB (`wp_posts`) | NO |

**Git cannot transfer page content.** Page content lives in the database.

---

## Recommended: Enable Direct Editing (One-Time Setup)

**Why**: Skip staging, skip approval, push live in one API call.

1. Go to: `https://master.belinus.net/wp-admin/admin.php?page=respira-settings`
2. Find **"Allow Direct Editing"** → Enable it
3. Save

Now `respira_update_page` with `editTarget: "live"` works immediately.

---

## Workflow A: Direct Editing (Recommended)

```javascript
respira_update_page({
  id: 10,
  content: "<!-- wp:group ... -->",
  editTarget: "live"
})
```

No duplicate, no approval, no manual step.

---

## Workflow B: Staged Updates (Current Setup)

When direct editing is OFF, Respira requires a staging/approval flow:

1. **Create duplicate** (staging copy)
   ```javascript
   respira_create_page_duplicate({ originalId: 10 })
   ```

2. **Edit the duplicate**
   ```javascript
   respira_update_page({
     id: 135,
     content: "...",
     editTarget: "duplicate"
   })
   ```

3. **Approve via admin UI**
   - Go to: `https://master.belinus.net/wp-admin/admin.php?page=respira-changes`
   - Click **Approve**

---

## Workflow C: Direct DB (Bypasses Respira)

```bash
curl -s -X POST -H 'Host: master.belinus.net' \
  --data-urlencode "php=$(cat update_page.php)" \
  http://127.0.0.1/
```

---

## Git Workflow (Theme Files Only)

Theme files are git-tracked and pushed to GitHub:
```bash
git add -A
git commit -m "Description"
git push origin main
```

**Do NOT commit `wp-config.php` or any file containing secrets.**

---

## Respira Element Limit
**200 elements per page max.** Split into multiple `inject_builder_content` calls if exceeded.

---

## Key IDs

| Item | Value |
|------|-------|
| Homepage | ID 10 |
| CF7 Form (B2B Quote) | ID 62 |
| Chatwoot token | `4VkiBbVD6xdvbAyKOMof` |

---

## Last Updated
2026-04-29
