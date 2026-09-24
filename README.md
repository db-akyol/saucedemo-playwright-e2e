# SauceDemo E-Ticaret Test Otomasyonu

[SauceDemo (Swag Labs)](https://www.saucedemo.com) demo e-ticaret uygulaması için **Playwright** ve **TypeScript** ile geliştirilmiş uçtan uca (E2E) test otomasyon projesidir. Kimlik doğrulama ve sipariş akışının tamamı (giriş → ürün listesi → sepet → ödeme → sipariş tamamlama) **Page Object Model (POM)** mimarisi kullanılarak test edilir. Testler Chromium, Firefox ve WebKit üzerinde paralel olarak çalışır.

![Playwright](https://img.shields.io/badge/Playwright-1.57-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![Tests](https://img.shields.io/badge/Testler-12%20senaryo-success)
![Browsers](https://img.shields.io/badge/Tarayıcılar-Chromium%20%7C%20Firefox%20%7C%20WebKit-blue)
![License](https://img.shields.io/badge/Lisans-MIT-yellow)

---

## Özellikler

- **Page Object Model (POM)** — Her sayfa kendi sınıfında; locator'lar `private readonly` olarak kapsüllenmiş, testler yalnızca anlamlı metotlarla (`login()`, `addProductToCartByName()`, `proceedToCheckout()`) konuşur.
- **Kalıtım tabanlı `BasePage`** — Navigasyon, sayfa yüklenmesini bekleme, başlık/URL okuma gibi ortak davranışlar tek noktada toplanmış; tüm sayfa nesneleri bu sınıftan türer.
- **Barrel export (`pages/index.ts`)** — Tüm sayfa nesneleri tek bir noktadan dışa aktarılır, import'lar sade kalır.
- **Merkezi test verisi yönetimi** — Kullanıcılar, ürünler, ödeme bilgileri ve hata mesajları `utils/testData.ts` içinde sabitlenmiş; testlerde hard-coded değer yok.
- **Çapraz tarayıcı desteği** — Aynı test paketi Desktop Chrome, Desktop Firefox ve Desktop Safari (WebKit) projeleri üzerinde çalışır.
- **Tam paralel çalışma** — `fullyParallel: true` ile testler eşzamanlı yürütülür.
- **Hata ayıklama artefaktları** — Başarısız testlerde otomatik **ekran görüntüsü** ve **video**, ilk yeniden denemede **trace** kaydı alınır.
- **HTML raporlama** — Playwright'ın yerleşik HTML reporter'ı ile görsel test raporu.
- **CI'a hazır yapılandırma** — CI ortamında `retries: 2`, `workers: 1` ve `forbidOnly` otomatik olarak devreye girer.
- **Strict TypeScript** — `strict: true` ile tip güvenli, dönüş tipleri açıkça belirtilmiş sayfa nesneleri.
- **Dayanıklı locator stratejisi** — Mümkün olan her yerde `data-test` öznitelikleri kullanılarak CSS/DOM değişikliklerine karşı kırılganlık azaltılmış.

---

## Teknolojiler

| Teknoloji | Sürüm | Kullanım Amacı |
|---|---|---|
| [Playwright Test](https://playwright.dev) | `^1.40.0` (kurulu: 1.57.0) | Test koşucusu, tarayıcı otomasyonu, assertion ve raporlama |
| [TypeScript](https://www.typescriptlang.org) | `^5.3.0` (kurulu: 5.9.3) | Tip güvenli test ve sayfa nesnesi geliştirme |
| [Node.js](https://nodejs.org) | 20.x | Çalışma ortamı |
| `@types/node` | `^20.10.0` | Node.js tip tanımları |
| Chromium / Firefox / WebKit | Playwright yönetimli | Çapraz tarayıcı yürütme |

**Derleme hedefi:** ES2020 · **Modül sistemi:** CommonJS · **Strict mode:** açık

---

## Proje Yapısı

```
Playwright-test/
├── pages/                    # Page Object Model katmanı
│   ├── BasePage.ts           # Ortak davranışlar (navigate, waitForPageLoad, getTitle, getCurrentUrl)
│   ├── LoginPage.ts          # Giriş sayfası: login, hata mesajı ve logo kontrolleri
│   ├── InventoryPage.ts      # Ürün listesi: sepete ekleme, sıralama, rozet sayacı, logout
│   ├── CartPage.ts           # Sepet: ürün doğrulama, kaldırma, checkout'a geçiş
│   ├── CheckoutPage.ts       # Ödeme: bilgi formu, toplam tutar, sipariş tamamlama
│   └── index.ts              # Barrel export — tüm sayfa nesnelerini tek noktadan sunar
│
├── tests/                    # Test senaryoları
│   ├── login.spec.ts         # Kimlik doğrulama testleri (4 senaryo)
│   └── ecommerce.spec.ts     # E-ticaret akış testleri (8 senaryo)
│
├── utils/
│   └── testData.ts           # TestUsers, CheckoutInfo, Products, ErrorMessages sabitleri
│
├── playwright.config.ts      # baseURL, projeler, paralellik, retry, reporter, artefakt ayarları
├── tsconfig.json             # TypeScript derleyici yapılandırması
├── package.json              # Bağımlılıklar ve npm script'leri
└── LICENSE                   # MIT
```

### Mimari Akış

```
Test Spec  ──►  Page Object  ──►  BasePage  ──►  Playwright Page API
    │                 ▲
    └──► testData.ts ─┘   (kullanıcılar, ürünler, ödeme bilgileri, hata mesajları)
```

---

## Test Senaryoları

Toplam **12 test senaryosu**, 3 tarayıcı projesi üzerinde çalıştırıldığında **36 test yürütmesi** üretir.

### `tests/login.spec.ts` — Giriş Testleri (4 senaryo)

Her test öncesi `beforeEach` ile `LoginPage` örneklenir ve giriş sayfasına gidilir.

| # | Senaryo | Doğrulama |
|---|---|---|
| 1 | Giriş sayfası doğru görüntülenmeli | Logo görünür ve sayfa başlığı `Swag Labs` |
| 2 | Geçerli bilgilerle giriş yapılabilmeli | `standard_user` ile giriş sonrası URL `/inventory` içerir |
| 3 | Kilitli kullanıcı için hata göstermeli | `locked_out_user` ile hata mesajı görünür |
| 4 | Geçersiz bilgiler için hata göstermeli | `invalid_user` ile hata mesajı görünür |

### `tests/ecommerce.spec.ts` — E-Ticaret Akış Testleri (8 senaryo)

Her test öncesi `beforeEach` ile dört sayfa nesnesi örneklenir ve `standard_user` ile oturum açılır.

| # | Senaryo | Doğrulama |
|---|---|---|
| 1 | Ürünler sayfası ürünleri göstermeli | Başlık `Products`, ürün sayısı `6` |
| 2 | Ürün sepete eklenebilmeli | Sepet 0'dan 1'e çıkar (Sauce Labs Backpack) |
| 3 | Birden fazla ürün sepete eklenebilmeli | Backpack + Bike Light → sepet sayacı `2` |
| 4 | Ürünler fiyata göre sıralanabilmeli | `lohi` sıralamasında ilk ürünün fiyatı `$7.99` |
| 5 | Sepetteki ürünler görüntülenebilmeli | Sepet başlığı `Your Cart`, eklenen ürün listede |
| 6 | Ürün sepetten kaldırılabilmeli | `Remove` sonrası sepet öğe sayısı `0` |
| 7 | Ödeme işlemi tamamlanabilmeli | Özet ekranında `Total:` görünür, sonuç mesajı `Thank you for your order!` |
| 8 | Tam e-ticaret akışı tamamlanabilmeli | 9 adımlı uçtan uca akış: ürün listeleme → 2 ürün ekleme → sepet doğrulama → checkout → form → sipariş tamamlama → ana sayfaya dönüş |

### Test Verisi

`utils/testData.ts` içinde tanımlı hazır setler:

- **`TestUsers`** — `STANDARD_USER`, `LOCKED_OUT_USER`, `PROBLEM_USER`, `PERFORMANCE_GLITCH_USER`, `INVALID_USER`
- **`CheckoutInfo`** — `VALID` (John Doe / 12345) ve `EMPTY` (negatif senaryolar için)
- **`Products`** — SauceDemo kataloğundaki 6 ürünün adı
- **`ErrorMessages`** — Giriş ve ödeme formlarına ait beklenen hata mesajları

---

## Kurulum

### Gereksinimler

- Node.js 18 veya üzeri (geliştirme ortamı: 20.x)
- npm

### Adımlar

```bash
# 1. Depoyu klonlayın
git clone <repo-url>
cd Playwright-test

# 2. Bağımlılıkları yükleyin
npm install

# 3. Playwright tarayıcılarını indirin
npx playwright install
```

> Test edilen hedef `playwright.config.ts` içindeki `baseURL` ile `https://www.saucedemo.com` olarak tanımlıdır — ek bir ortam değişkeni veya `.env` dosyası gerekmez.

---

## Testleri Çalıştırma

```bash
# Tüm testleri headless modda çalıştır (3 tarayıcı)
npm test

# Tarayıcı penceresi açık olarak çalıştır
npm run test:headed

# Playwright UI Mode — interaktif çalıştırma ve hata ayıklama
npm run test:ui

# Son HTML raporunu aç
npm run report
```

### Ek Playwright Komutları

```bash
# Tek bir dosyayı çalıştır
npx playwright test tests/login.spec.ts

# Yalnızca belirli bir tarayıcıda çalıştır
npx playwright test --project=chromium

# Başlığa göre filtrele
npx playwright test -g "sepete eklenebilmeli"

# Adım adım hata ayıklama (Playwright Inspector)
npx playwright test --debug
```

### Raporlama ve Artefaktlar

| Çıktı | Konum | Ne zaman oluşur |
|---|---|---|
| HTML raporu | `playwright-report/` | Her çalıştırmada |
| Ekran görüntüsü | `test-results/` | Yalnızca test başarısız olduğunda |
| Video kaydı | `test-results/` | Yalnızca test başarısız olduğunda |
| Trace dosyası | `test-results/` | İlk yeniden denemede |

Trace dosyalarını incelemek için:

```bash
npx playwright show-trace test-results/<klasör>/trace.zip
```

### CI Davranışı

`process.env.CI` tanımlı olduğunda yapılandırma otomatik olarak uyarlanır:

- `retries: 2` — kararsız (flaky) testler için 2 yeniden deneme
- `workers: 1` — deterministik, sıralı yürütme
- `forbidOnly: true` — unutulmuş `test.only` çağrıları derlemeyi başarısız kılar

---

## Lisans

Bu proje **MIT Lisansı** ile lisanslanmıştır. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakınız.

Copyright (c) 2025 Deniz Akyol
