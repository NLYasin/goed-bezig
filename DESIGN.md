# Kantoor Woordenschat — Tasarım Kuralları

Bu dosya, Woordenschat (sociaal raadsman ofisi için Hollandaca kelime kartları PWA'sı) arayüzünde yapılan her değişikliğin uyması gereken kuralları tanımlar. Goed Bezig ile aynı aileden; kaynaklar Anthropic `frontend-design`, `taste-skill` ve `design-dna` incelemesi. Yalnızca bir **ürün arayüzüne** uyan kurallar alındı.

## 1. Kimlik ve renk

- Kimlik: "orman" ailesi. Koyu temada yeşile çalan koyu zemin (`--bg #0B1A13`), açık temada hafif yeşil-gri (`#F3F8F5`). Tek marka/aksiyon rengi: `--accent` (mavi). İkinci bir aksan (mor, indigo) ve gradyan düğme yok.
- Semantik renkler yalnızca durum bildirir: `--green` öğrenildi/tamam, `--orange` bugün/yaklaşan, `--red` gecikmiş/tehlike. Hepsinin `-bg` ve `-border` tonu token'dır; hex gömülmez.
- **Bilinçli istisna:** kart türü rozetleri (kelime = yeşil, cümle = mavi, hukuki = turuncu, deyim = mor) kategorik palettir; mor yalnızca burada yaşar.
- Durum asla yalnızca renkle anlatılmaz: nokta/rozet yanında metin veya ikon olur.
- Parlama (`box-shadow` glow) yok. Dekoratif nokta yok; nokta yalnızca gerçek durum taşır (`.sr-dot`, `.ts-dot`, `.sync-dot`).
- Kontrast: gövde 4,5:1, büyük metin 3:1. `--text3` küçük metinde bu sınırın altına inmez.

## 2. Tipografi ve Hollandaca

- Tek font ailesi (`Segoe UI`, system-ui). Monospace yalnızca gerçek kod alanlarında (`--code`: JSON textarea). Etiket, tarih ve sayılarda mono kullanılmaz; sayılar `font-variant-numeric: tabular-nums` ile hizalanır.
- Büyük harf etiketler (`.sec-title`, bölüm başlıkları) 11 px / 600 / `letter-spacing 0.04em`; geniş harf aralığı ve 9–10 px yok.
- `<html lang="tr">`; her Hollandaca öğe `lang="nl"` taşır: `.card-dutch`, `.tekrar-card-dutch`, `.ex-nl`, `.listen-word`, `#gp-word`, `#gazete-reader`.
- `[lang="nl"]{hyphens:auto;overflow-wrap:anywhere}`: `arbeidsongeschiktheidsverzekering` gibi bileşik kelimeler kartı taşıramaz.
- Bayrak emojileri kullanılmaz (Windows'ta harfe döner).

## 3. Yoğunluk ve düzen

- Yoğunluk kadranı 5–6. Kart listesi sıkı, ilerleme kartları nefes alır.
- Alt navigasyon 6 öğe, tek satır, etiketli. Aktif öğe `--accent`.
- Tarih grupları akordeon; ilk render'da en yeni grup açık, diğerleri kapalı.
- Kart düzeni: rozet + Hollandaca + Türkçe üstte, eylemler tek satır altta.

## 4. Dokunma ve erişilebilirlik

- Her tıklanabilir öğe en az 36 px yüksek; yalnız ikonlu düğmeler (`.icon-only`) 40 px geniş.
- `:focus-visible` her öğede görünür; `outline:none` yasak.
- `prefers-reduced-motion` ve `prefers-color-scheme` desteklenir (kayıtlı tercih yoksa sistem teması).
- Yıkıcı işlemler (`confirmDelete`, `resetProgress`) onay ister; çöp kutusu kayıt tutar.

## 5. Hareket: motive olmayan animasyon yok

| Gerekçe | Örnek | Bütçe |
|---|---|---|
| Geri bildirim | `:active` opaklık, "Öğrendim" durum değişimi | ≤ 200 ms |
| Durum değişimi | kart gövdesi açılması, hedef çubuğu dolması | ≤ 400 ms |
| Kutlama | günlük hedef / seri kilometre taşı (`showCelebration`) | 2,5 s, tek sefer |

- Sürekli animasyon yok. Scroll'a bağlı hareket yok.
- Yalnızca `transform` ve `opacity` animate edilir.

## 6. Durum döngüleri

- Boş: `.empty` / `.tekrar-empty` / `.listen-empty`: ikon + tek cümle + ne yapılacağı.
- Yükleniyor: metin ("Analiz ediliyor…"), tam ekran spinner yok.
- Hata/çevrimdışı: `.settings-status.err`, bağlantı noktası; dil sade, çözüm öneren.

## 7. İkon ve görsel

- Arayüz ikonları Tabler set'inden (MIT), `currentColor`. Tek biçim: `index.html` içindeki inline SVG sprite (`<svg class="ic"><use href="#i-book"/></svg>`, JS'te `ic('book')`). Liste 250 kart civarı olduğu için kart içinde inline SVG kabul edilebilir; liste 1000+ karta çıkarsa Goed Bezig'deki CSS-mask yöntemine geç.
- Yeni ikon eklerken sprite'a `<symbol id="i-ad">` ekle.
- Emoji yalnızca duygu/kutlama anlarında: seri rozeti ikonları (🔥 💎 🥇 …), `showCelebration`, boş tekrar listesindeki 🎉.
- Uygulama ikonu: yeşil zemin (`#1F9D6F`), üst üste iki beyaz kart, öndekinde Hollanda bayrağı bantları ve iki yeşil metin çizgisi. Goed Bezig ile aynı aile (bayrak bantlı kart), farklı renk ve şekil. `icon-192/512.png` (any), `icon-maskable-192/512.png` (%80 güvenli alan), `apple-touch-icon.png`, `favicon-16/32.png`. Üretici: `make-icons.ps1`.

## 8. Metin (Türkçe arayüz)

- Kısa, eylem odaklı etiketler: "Öğrendim", "Tekrar ettim", "Dinle". Aynı niyet için tek etiket.
- Geçici durum mesajlarında (✅ ❌ ⏳) emoji kalabilir; kalıcı arayüz öğelerinde kalamaz.
- Marka/ürün adı `Kantoor Woordenschat`; alt başlıkta "Hollandaca" (Hollandıca değil).

## 9. Değişiklik öncesi kontrol listesi

1. Yeni renk → token'a bağla.
2. Yeni düğme ≥ 36 px mi? `:focus-visible` çalışıyor mu?
3. Yeni animasyonun gerekçesi var mı?
4. Hollandaca metin öğesi `lang="nl"` taşıyor mu?
5. İki temada, 375 px genişlikte bakıldı mı?
6. `sw.js` içindeki `CACHE_NAME` artırıldı mı?
