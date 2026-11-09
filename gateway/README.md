<div dir="rtl">

# بوابة التحميل العامة (Cloudflare Worker)

**الرابط الدائم:** https://4c963f49-7f97-497d-ae4a-0ba8a209171a.vip.gensparksite.com

| المسار | الوظيفة |
|---|---|
| `/` | صفحة هبوط عربية (كحلي/ذهبي) تعرض الإصدار والحجم تلقائياً من `odr/update.json` |
| `/download` | يمرّر `ODR-Setup.exe` من آخر Release في هذا المستودع عبر نفس النطاق — الزبون لا يرى GitHub |
| `/sha256` | ملف بصمة المثبّت |
| `/version` | `odr/update.json` كما هو |

لا توجد أسرار في هذه الملفات. أي إصدار جديد يُنشر هنا يظهر على الرابط فوراً بلا إعادة نشر.

## إعادة النشر (استضافة Genspark المُدارة — `gsk hosted`)
```bash
# جذر المشروع يجب أن يحوي هذه الملفات فقط (صغير، بلا symlink، بلا مجلدات ضخمة)
cp -r gateway/* /home/user/webapp/ && cd /home/user/webapp
npx --yes wrangler dev --port 8787 &   # اختبار محلي: / و /download
git add -A && git commit -m "gateway" && gsk hosted deploy      # → pending_action_id
gsk hosted action_approve --id <id> && gsk hosted action_wait --id <id>   # → completed
gsk hosted worker_get                                             # → deployment_url
```
أخطاء شائعة: `Source tree contains a symlink` (احذف الـ symlink)؛ فشل بلا سبب = الجذر كبير جداً.

### أو على حساب Cloudflare خاص بك
```bash
cd gateway && npx wrangler deploy      # يحتاج wrangler login
```

</div>
