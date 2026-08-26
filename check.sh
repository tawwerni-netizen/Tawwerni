#!/bin/bash
#
# What is actually on the server right now.
#
#   bash check.sh
#
# Reads only — changes nothing. Run it when the site looks wrong and you need
# to know why before touching anything.

echo ""
echo "════════════════════════════════════════"
echo "  فحص الموقع"
echo "════════════════════════════════════════"
echo ""

# ---------------------------------------------------------------- location
if [ ! -f "package.json" ]; then
  echo "✗ إنت مش في مجلد الموقع."
  echo "  اكتب:  cd ~/domains/tawwerni.com/public_html"
  exit 1
fi
echo "✓ المجلد صح: $(pwd)"

# ---------------------------------------------------------------- version
#
# The single most useful line here. If this commit isn't the newest one, the
# files never arrived — and no amount of rebuilding or restarting will help.
if [ -d ".git" ]; then
  echo "✓ النسخة: $(git log --oneline -1 2>/dev/null)"
else
  echo "· مفيش git — الملفات اترفعت بالإيد"
fi

# ---------------------------------------------------------------- build
if [ ! -d ".next" ]; then
  echo "✗ مفيش بناء (.next) — لازم تشغّل: bash deploy.sh"
else
  BUILT=$(date -r .next "+%Y-%m-%d %H:%M" 2>/dev/null || echo "?")
  echo "✓ البناء موجود · آخر مرة: $BUILT"

  # A build with no static chunks is the "site with no styling" symptom.
  CHUNKS=$(find .next/static/chunks -name "*.js" 2>/dev/null | wc -l)
  CSS=$(find .next/static -name "*.css" 2>/dev/null | wc -l)
  echo "  ملفات الجافاسكربت: $CHUNKS · ملفات التصميم: $CSS"

  if [ "$CSS" -eq 0 ]; then
    echo "  ✗ مفيش ملفات تصميم — ده سبب إن الموقع بيطلع من غير ألوان."
    echo "    شغّل: bash deploy.sh"
  fi
fi

# ---------------------------------------------------------------- deps
if [ ! -d "node_modules" ]; then
  echo "✗ مفيش مكتبات — شغّل: bash deploy.sh"
else
  echo "✓ المكتبات موجودة"
fi

# ---------------------------------------------------------------- database
if [ ! -f "dev.db" ]; then
  echo "✗ مفيش قاعدة بيانات"
else
  SIZE=$(du -h dev.db | cut -f1)
  echo "✓ قاعدة البيانات موجودة · الحجم: $SIZE"
fi

# ---------------------------------------------------------------- env
echo ""
echo "المتغيّرات:"
for VAR in DATABASE_URL JWT_SECRET PAYMENT_INGEST_TOKEN; do
  # Print only whether it's set — never the value.
  if [ -n "${!VAR}" ]; then
    echo "  ✓ $VAR"
  else
    echo "  ✗ $VAR — ناقص، الموقع مش هيشتغل من غيره"
  fi
done

for VAR in SMTP_HOST SMTP_USER RESEND_API_KEY; do
  if [ -n "${!VAR}" ]; then
    echo "  ✓ $VAR"
  fi
done

if [ -z "$SMTP_HOST" ] && [ -z "$RESEND_API_KEY" ]; then
  echo "  · الإيميلات مش متظبطة (الموقع هيشتغل عادي، بس مش هيبعت رسايل)"
fi

echo ""
