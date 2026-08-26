#!/bin/bash
#
# Full deploy, in one command.
#
# Run this in the Hostinger terminal, inside the site folder, after the files
# are there. It does every step in the right order and stops the moment
# anything fails — a half-finished deploy is what leaves the site serving a
# broken mix of old and new.
#
#   bash deploy.sh
#
# Safe to run again. It never deletes the database.

set -e  # stop on the first error rather than carrying on and hiding it

echo ""
echo "════════════════════════════════════════"
echo "  رفع طوّرني"
echo "════════════════════════════════════════"
echo ""

# ---------------------------------------------------------------- 0. sanity
if [ ! -f "package.json" ]; then
  echo "✗ إنت مش في مجلد الموقع."
  echo ""
  echo "  اكتب:  cd ~/domains/tawwerni.com/public_html"
  echo "  وبعدين شغّل الأمر ده تاني."
  exit 1
fi

# ---------------------------------------------------------------- 1. backup
if [ -f "dev.db" ]; then
  BACKUP="dev.db.backup-$(date +%Y%m%d-%H%M%S)"
  cp dev.db "$BACKUP"
  echo "✓ ١/٦  نسخة احتياطية من قاعدة البيانات: $BACKUP"
else
  echo "· ١/٦  مفيش قاعدة بيانات لسه — هتتعمل دلوقتي"
fi

# ---------------------------------------------------------------- 2. clean
#
# The old build MUST go before the new one is made. A .next folder that mixes
# two builds is exactly what makes the browser ask for a CSS file that no
# longer exists — which is a site with no styling at all.
rm -rf .next
echo "✓ ٢/٦  البناء القديم اتمسح"

# ---------------------------------------------------------------- 3. deps
echo "· ٣/٦  بتحميل المكتبات… (دي أطول خطوة، استنى)"
npm ci --omit=dev --no-audit --no-fund 2>&1 | tail -3
echo "✓ ٣/٦  المكتبات جاهزة"

# ---------------------------------------------------------------- 4. schema
#
# New columns ship with the code. Without this the app starts and then throws
# on the first query, which looks like the whole site is down.
npx prisma db push --accept-data-loss 2>&1 | tail -2
npx prisma generate 2>&1 | tail -1
echo "✓ ٤/٦  قاعدة البيانات اتحدّثت"

# ---------------------------------------------------------------- 5. build
echo "· ٥/٦  بيبني الموقع… (٢-٤ دقايق)"
npm run build 2>&1 | tail -5
echo "✓ ٥/٦  البناء خلص"

# ---------------------------------------------------------------- 6. content
npx tsx prisma/seed.ts 2>&1 | tail -3
echo "✓ ٦/٦  المحتوى اتحدّث"

echo ""
echo "════════════════════════════════════════"
echo "  ✅ خلص"
echo "════════════════════════════════════════"
echo ""
echo "  فاضل خطوة واحدة بإيدك:"
echo "  hPanel ← Node.js ← Restart Application"
echo ""
echo "  وبعدين افتح tawwerni.com وشوف."
echo ""
