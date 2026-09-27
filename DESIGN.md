# Goed Bezig — Tasarım Kuralları

Bu dosya, Goed Bezig (Hollandaca cümle ezber PWA'sı) arayüzünde yapılan her değişikliğin uyması gereken kuralları tanımlar. Kaynaklar: Anthropic `frontend-design` skill'i, `taste-skill`, `design-dna` ve `scrollcraft` incelemesi; yalnızca bir **ürün arayüzüne** (landing page değil) uyan kurallar alındı, Hollandaca'ya özgü kurallar eklendi.

## 1. Kimlik ve renk — "Delfts blauw & oranje" (v24)

- **Kimlik rengi Delft mavisi:** `--accent` (açık tema `#1F3A6B`, koyu tema `#9DB0D6`), `--hero` seri kartı gibi tek "sahne" yüzeyi için. Seçili durumlar (etkin sekme yazısı, seçili ayar düğmesi, ders numarası) mavidir.
- **Eylem rengi oranje:** `--cta` `#B8491A`. Birincil düğme, ilerleme dolguları, seri günleri, odak halkası. **Bir ekranda tek oranje birincil düğme** olur; yanındaki düğmeler beyaz yüzey + kenarlık.
- **Zemin:** açık temada krem (`--bg #F5F1E8`, kartlar `#FFFFFF`, kenarlık `#E3DCCC`), koyu temada gece mavisi (`--bg #0F1930`, kart `#16233F`, kenarlık `#2C416D`).
- **Dinleme oynatıcısı her iki temada da gece mavisidir** (token'lar `.listen-player-box` üzerinde yerel olarak ezilir); telefonda tam ekran.
- Semantik renkler yalnızca durum bildirir: `--green` tamamlandı, `--red` gecikmiş/silme, `--yellow` bugün/uyarı. Oranje semantik renk değildir, eylemdir.
- Yarı saydam tonlar sabit rgba ile değil `color-mix(in srgb, var(--token) N%, transparent)` ile yazılır; tema değişince kendiliğinden uyar.
- Durum asla yalnızca renkle anlatılmaz: yanına ikon veya metin eşlik eder.
- Gradyan yok (v24'te ilerleme dolguları da düz renge geçti).
- Koyu temada oranje metin `#F0A27A` tonuna açılır (koyu zeminde `#B8491A` okunmaz).
- Kontrast: gövde metni 4,5:1, büyük metin 3:1 (WCAG AA). `--muted` bu sınırın altına inemez.

## 2. Tipografi ve Hollandaca

- İki aile, net görev ayrımı: **Manrope** (`--font-ui`) arayüzün tamamı; **Fraunces** (`--font-display`) yalnızca logo, panel başlıkları, büyük sayılar (seri, hedef, istatistik) ve **odaktaki tek Hollandaca cümle** (dinleme oynatıcısı, konuşma kartı cevabı). Liste satırlarındaki cümleler Manrope kalır; yoğun listede serif yorar.
- Fontlar Google Fonts'tan gelir; çevrimdışıyken sistem fontuna (Segoe UI / Georgia) düşer, düzen bozulmaz. IPA satırı için `Charis SIL` istisnası sürer.
- Hiyerarşi ağırlık ve renkle kurulur. Kart başlığı 13 px/700 büyük harf + geniş aralık (yalnızca kart başlıklarında).
- `<html lang="tr">`; her Hollandaca cümle öğesi `lang="nl"` taşır (`.snl`, `.rnl`, `.lc-nl`, `.pc-nl`, `.lp-nl`, `.sp-nl`, `.tr-popup-nl`).
- `[lang="nl"]{hyphens:auto;overflow-wrap:anywhere}` sabittir.
- Cümle satır uzunluğu 65ch'i geçmez (`main max-width` bunu sağlar).
- Bayrak emojileri yeni arayüz elemanında kullanılmaz (Windows'ta harfe döner). Çeviri düğmesi metin rozeti `TR`.

## 1b. Biçim

- Köşe yarıçapı hiyerarşiyi izler: büyük kartlar 20 px, ders blokları 18 px, liste kartları 16 px, düğmeler 12 px, çip ve rozetler tam yuvarlak.
- Seri kartı tek "sahne" yüzeyidir: dolu Delft mavisi, beyaz yazı, son 7 günün Hollandaca baş harfli noktaları (çalışıldı oranje, dondurma açık mavi, bugün kesik çizgili).

## 2b. Ders listesi: varsayılan kapalı

Ezber Listesi'nde 101 ders, 2400+ cümle var. Sayfa ilk açıldığında hepsi kapalı gelir (`collapsedLessons` başlangıçta tüm ders id'leriyle doldurulur); "Aç" düğmesi hepsini açar. Arama veya öncelik filtresi aktifken eşleşen ders otomatik açılır — kapalı kalsaydı sonuç görünmezdi. `resetAllData()` da bu varsayılana döner (boş Set değil, dolu Set).

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
- **Giriş animasyonu yalnızca sekmeye girerken, tek bir render boyunca oynar.** `switchTab` `_animateCards` bayrağını açar, render fonksiyonları bu bayrağı kendi kabına (`#lgrid`, `#pgrid`, `#rpcont`) `anim` sınıfı olarak yazar, sonra bayrak kapanır. Sınıf gövdede **kalıcı bırakılmaz**: bırakılırsa sekmede kalırken yapılan her güncelleme animasyonu yeniden oynatır ve "sayfa yenilendi" hissi geri gelir.
- **Aynı işlem iki kez render etmez.** Bulut dinleyicisi kendi yazdığımızın yankısını (`updatedBy === deviceId` ve son push'tan 10 sn içinde) atlar; yoksa yerel render'dan ~1 sn sonra ikinci bir tam render geliyordu. `lastPushAt` sekme başınadır, bu yüzden ikinci bir sekme gerçek güncellemeyi almaya devam eder.
- **Yeniden render kaydırma konumunu bozmaz.** Veriyi değiştiren her işlem `keepScroll(fn)` içinden render eder. Görünmeyen sekme yeniden kurulmaz: `refreshStudyIfVisible()` ezber listesi kapalıyken yalnızca `updateHeaderStats()` çağırır (2400+ satırı boşuna kurmak hem yavaş hem sarsıntılı).
- Yıkıcı/ilerletici işlemin kendi geri bildirimi kartın üstünde olur (`.sr.learned-out`, `.rc.rep-done`): önce kart yeşil parlayıp kayar, liste ancak ondan sonra yenilenir.
- `window.addEventListener('scroll')` ile hareket bağlanmaz.

## 5b. Dinleme modu: arka planda ses

Telefon kilitliyken/uygulama arka plandayken ses devam etmeli. Bunu bozan üç şey var, üçü de kural:

1. **Her cümle için yeni `Audio` yaratılmaz.** Tarayıcılar arka planda YENİ bir media elemanının `play()` çağrısını sessizce reddeder; kuyruk ilerler ama ses gelmez. Tek bir `listenAudioEl` kullanılır, yalnızca `src` değişir.
2. **Kilit kullanıcı dokunuşuyla açılır.** `startListenMode()` içinde `unlockListenAudio()` sessiz bir WAV çalarak elemanı yetkilendirir. Bu çağrı dokunma olayının senkron akışından çıkarılmaz.
3. **Media Session zorunludur.** Her cümlede `updateMediaSession(info)`; kilit ekranı kontrolleri (`play/pause/next/prev/stop`) bağlanır. Bu hem OS bildirimi verir hem de oynatmanın arka planda yaşamasını sağlar.

Ayrıca: arka planda `speechSynthesis` sessizdir. Ses gerçekten çalmadıysa (`speakQueued` false döner) ve sayfa arka plandaysa kuyruk **ilerletilmez**; `waitUntilVisible()` ile öne dönülene kadar beklenir ve aynı cümle tekrar denenir.

## 5d. Konuşma modu (v23)

Tanıma değil üretim çalıştırır: Türkçe ipucu gösterilir, kullanıcı Hollandacasını sesli söyler, sonra kontrol eder. Kurallar:

- **Ayrı tekrar kaydı.** `prodData` tanıma kaydından (`repData`) tamamen ayrıdır. Bir cümleyi tanımak onu üretebilmek demek değildir; iki sayaç birleştirilmez.
- **Doğruluk değil akıcılık notu.** Üç düğme: Takıldım / Yavaş / Akıcı. Altlarında sonraki tekrarın zamanı yazar ("yarın", "3 gün"). Takıldım kartı aynı turda 3 kart sonra bir kez daha gelir.
- **Düğmeler renksiz ve eşit.** Takıldım kırmızı değildir: konuşma kaygısını artıran bir ceza görüntüsü verilmez. Tek dolu (accent) düğme ekranda bir tane: soru halinde "Cevabı göster".
- **Süre sessizce ölçülür.** İpucu ekrana geldiği andan "Cevabı göster"e kadar geçen süre. Soru ekranında sayaç yoktur (baskı yaratır); cevaptan sonra bilgi olarak görünür. 60 sn üstü ve ipucu kullanılan denemeler kayda geçmez.
- **Tek görev, başparmak bölgesi.** Oturum tam ekrandır; kararlar ekranın alt kısmındadır, düğmeler en az 56 px (not düğmeleri 64 px).
- **İpucu kaynağı dürüstçe yazılır.** Otomatik çeviriyse "Otomatik çeviri" notu görünür; kullanıcı "İpucunu düzenle" ile kendi ipucunu ve bir durum cümlesi (`prodCues`) yazabilir. Çeviri alınamazsa ilk harf ipucu otomatik açılır; ekran boş kalmaz.
- **Bulut birleştirmesi damgalıdır.** `prodData`/`prodCues` anahtar bazında zaman damgasıyla (`t`/`u`), `prodLog` gün bazında en büyük değerle birleşir. v22'de kalmış bir cihaz bu alanları silse bile yerel kopya geri yazılır.
- Hareket: kart değişiminde 180 ms kayma, cevap açılırken 250 ms belirme (durum değişimi). Başka animasyon yok.

## 5c. Günlük hatırlatma

- Ayar cihaza aittir (`gb3-reminder`), profile değil.
- Service Worker `localStorage` okuyamaz; ayarlar ve "hangi günler çalışıldı" bilgisi `gb-reminder` cache'ine `reminder-prefs` olarak yazılır (`syncReminderToSW`). `logActivity` her ezberde bunu tazeler.
- Uygulama kapalıyken bildirim **Periodic Background Sync**'e bağlıdır: yalnızca ana ekrana kurulmuş Android/Chrome'da, tarayıcının seçtiği saatte. iOS Safari desteklemez.
- Bu yüzden panel ne vaat ettiğini dürüstçe yazar (`renderReminderUI` → `showReminderStatus`). Desteklenmeyen bir şey "çalışıyor" gibi gösterilmez.
- `navigator.serviceWorker.ready` kayıt başarısızsa hiç çözülmez; her kullanımı `swReadyOrNull(ms)` ile zaman aşımına bağlanır, yoksa arayüz sessizce boş kalır.

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
- Uygulama ikonu (v24): düz Delft mavisi `#1F3A6B` zemin, krem kart, oranje tik, altta Hollanda bayrağı bantları. Gradyan yok. Üretici: Python + Pillow. `icon-*.png` (any), `icon-maskable-*.png` (%80 güvenli alan), `favicon-16/32.png` (tiksiz sade sürüm).
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
