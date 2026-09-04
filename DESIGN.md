# Goed Bezig — Tasarım Kuralları

Bu dosya, Goed Bezig (Hollandaca cümle ezber PWA'sı) arayüzünde yapılan her değişikliğin uyması gereken kuralları tanımlar. Kaynaklar: Anthropic `frontend-design` skill'i, `taste-skill`, `design-dna` ve `scrollcraft` incelemesi; yalnızca bir **ürün arayüzüne** (landing page değil) uyan kurallar alındı, Hollandaca'ya özgü kurallar eklendi.

## 1. Kimlik ve renk

- Tek marka rengi: `--accent` (mavi). `--accent2` yalnızca aynı ailenin açık tonu; başka hiçbir mavi/mor/indigo hex kullanılmaz.
- Semantik renkler sadece durum bildirir: `--green` doğru/tamamlandı, `--red` gecikmiş/silme, `--yellow` bugün/uyarı. Süs amaçlı kullanılmaz.
- Durum asla yalnızca renkle anlatılmaz: yanına ikon veya metin eşlik eder (renk körlüğü).
- Gradyan metin yok. Gradyan yalnızca ilerleme dolgularında (`.prog-fill`, `.journey-fill`) kalır.
- Saf `#000`/`#fff` yok; iki tema da token'lardan beslenir. Sabit hex bir bileşene gömülmez.
- Açık tema tek nötr aile kullanır (mavi-gri): `--bg #F4F6FA`, `--surface #FFF`, `--border #DFE3EC`. Yeşil/krem/lavanta karışımı yok.
- Kontrast: gövde metni 4,5:1, büyük metin 3:1 (WCAG AA). `--muted` bu sınırın altına inemez.

## 2. Tipografi ve Hollandaca

- Tek font ailesi: `"Segoe UI", system-ui, sans-serif`. IPA satırı için `Charis SIL` istisnası.
- Hiyerarşi ağırlık ve renkle kurulur, boyutla bağırılmaz. Kart başlığı 13–14 px/700, cümle 14 px/500–600, yardımcı metin 11–12 px/`--muted`.
- `<html lang="tr">`; her Hollandaca cümle öğesi `lang="nl"` taşır (`.snl`, `.rnl`, `.lc-nl`, `.pc-nl`, `.lp-nl`, `.tr-popup-nl`). Bu, ekran okuyucu ve tirelemeyi doğru dile bağlar.
- `[lang="nl"]{hyphens:auto;overflow-wrap:anywhere}` sabittir: `arbeidsongeschiktheidsverzekering` gibi bileşik kelimeler satırı taşıramaz.
- Cümle satır uzunluğu 65ch'i geçmez (`main max-width` bunu sağlar).
- Bayrak emojileri arayüz elemanı olarak kullanılmaz (Windows'ta bayraklar "NL"/"TR" harfine döner). Çeviri düğmesi metin rozeti `TR`; çeviri satırı ön eksiz, italik ve `--muted`.
- Büyük harf + geniş harf aralığı (`uppercase; letter-spacing`) sadece kart başlıklarında; satır içinde kullanılmaz.

## 3. Yoğunluk ve düzen

- Yoğunluk kadranı 5–6 ("günlük uygulama"): egzersiz satırları sıkı, ilerleme kartları nefes alır.
- Kart yalnızca gruplama için; tek bir sayıyı veya etiketi kart içine sarma.
- Mobilde satır düzeni: `[no][cümle + çeviri]` üstte, `[öncelik noktaları] … [eylemler]` altta tek satır. Boş alan bırakılmaz.
- Masaüstünde nav tek satır; sekmeler sığmıyorsa yatay kaydırma, iki satır değil.
- İçerik `main max-width: 940px`; mobil `padding: 0 10px`.

## 4. Dokunma ve erişilebilirlik

- Her tıklanabilir öğe en az 40×40 px (mobilde hedef 44). Görsel küçük olabilir (14 px nokta), dokunma alanı küçük olamaz (`padding + background-clip:content-box`).
- Başlangıç opaklığı 0,6'nın altında ikon yok. "Gizli ve hover'da görünen" eylem mobilde yoktur.
- `:focus-visible` her etkileşimli öğede görünür (2 px `--accent` halka). `outline:none` yasak.
- `prefers-reduced-motion` bloğu korunur; yeni animasyon eklerken bu bloğun kapsadığından emin ol.
- `prefers-color-scheme` kullanıcı seçim yapmamışsa temayı belirler.
- Form kuralı: etiket üstte, hata altta, placeholder etiket yerine geçmez.

## 5. Hareket: motive olmayan animasyon yok

Her animasyon şu dört gerekçeden birine sahiptir; yoksa eklenmez:

| Gerekçe | Örnek | Bütçe |
|---|---|---|
| Geri bildirim | cümle ezberlenince yeşil parlayıp kayması, buton `:active` çökmesi | ≤ 420 ms |
| Durum değişimi | sekme paneli, IPA satırı açılması, oynatıcıda cümle değişimi | ≤ 300 ms |
| Kutlama (tek cesur an) | günlük hedef/rozet: konfeti + mesaj | tek seferlik, 2 s |
| Canlı durum | ses dalgası (yalnızca çalarken), senkron noktası (yalnızca senkronlarken) | döngü, sadece aktifken |

- Sürekli (infinite) hareket yalnızca gerçek bir canlı duruma bağlıdır. Alev animasyonu tek istisna: "cesareti tek yerde harca" kuralı gereği streak kartına ayrılmıştır; ikinci bir sürekli süs eklenmez.
- Yalnızca `transform` ve `opacity` animate edilir; `height`/`top`/`width` yok (IPA satırı `max-height` istisnası bilinçli, kısa ve küçük).
- Liste kartlarının giriş animasyonu ilk 8 öğe ile sınırlı; her yeniden render'da tüm liste titremez.
- `window.addEventListener('scroll')` ile hareket bağlanmaz.

## 6. Durum döngüleri

Her ekran dört durumu tasarlar: yükleniyor, boş, hata, dolu.

- Boş: `.empty` bloğu; bir ikon + tek cümle + ne yapılacağı ("Bugün tekrar yok").
- Hata/çevrimdışı: `banner` veya `profile-status`; dil sade, çözüm öneren.
- Yükleniyor: iskelet veya sessiz gösterge; tam ekran spinner yok.
- Geri alma: yıkıcı işlemler (`doPerm`, `eraseAll`) her zaman `#ubar` ile geri alınabilir.

## 7. İkon ve görsel

- Arayüz ikonları Tabler set'inden (MIT), `currentColor` ile temaya uyar. İki kullanım biçimi var, ikisi de `index.html` içinde, harici dosya yok:
  - **Inline SVG sprite** (`<svg class="ic"><use href="#i-book"/></svg>`, JS'te `ic('book')`): sekmeler, başlıklar, rozetler gibi sayfada az sayıda görünen yerler.
  - **CSS mask** (`class="ib ib-volume"`): 2400+ cümle satırında tekrar eden düğmeler (ses, IPA, ✓, çöp, geri al, kapat). Satır başına DOM düğümü eklemez; 10 bin inline SVG sayfayı yavaşlatır, bu yüzden liste içinde inline SVG kullanılmaz.
- Yeni ikon eklerken: sprite'a `<symbol id="i-ad">` ekle; liste satırında kullanılacaksa `.ib-ad{--ib:url("data:image/svg+xml;utf8,…")}` kuralı ekle.
- Emoji yalnızca duygu/kutlama anlarında kalır: 🔥 seri alevi, 🎉 kutlama, 🚶🏃🏁 hedef yolculuğu, rozet adları. Platforma göre bozulan emojiler (bayraklar) hiç kullanılmaz.
- Uygulama ikonu: düz `#0E7FD4` zemin, beyaz kart, mavi tik, altta Hollanda bayrağı bantları. Gradyan yok. `icon-*.png` (any), `icon-maskable-*.png` (%80 güvenli alan), `favicon-16/32.png` (tiksiz sade sürüm). Üretici betik: PowerShell + System.Drawing; yeniden üretmek için tek renk/şekil değişikliği yeterli.
- Egzersiz ekranlarında fotoğraf/illüstrasyon yok; dikkat cümlede kalır.
- Süs çizgiler, dekoratif noktalar, numaralı "01/02" başlıklar yok. Numara yalnızca gerçek ders/cümle sırasını gösterir.

## 8. Metin (Türkçe arayüz)

- Kısa, eylem odaklı düğme etiketleri (1–3 kelime): "Dinle", "Geri Al", "Zinciri Kurtar".
- Aynı niyet için tek etiket: sitede "Ezberlendi" varsa "Öğrenildi" de kullanılmaz.
- İngilizce "AI tell" listeleri (em-dash yasağı vb.) bu ürüne uygulanmaz; Türkçe noktalama kuralları geçerlidir.

## 9. Değişiklik öncesi kontrol listesi

1. Yeni renk eklendi mi? → Token'a bağla, hex gömme.
2. Yeni tıklanabilir öğe ≥ 40 px mi? Opaklık ≥ 0,6 mı? `:focus-visible` çalışıyor mu?
3. Yeni animasyonun tek cümlelik gerekçesi var mı? `transform/opacity` dışına çıkıyor mu?
4. Hollandaca metin öğesi `lang="nl"` taşıyor mu?
5. İki temada da bakıldı mı? 375 px genişlikte bakıldı mı?
6. Boş ve hata durumu var mı?
