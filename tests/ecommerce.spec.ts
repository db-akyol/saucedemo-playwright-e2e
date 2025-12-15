import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { TestUsers, Products, CheckoutInfo } from '../utils/testData';

test.describe('E-Commerce Flow Tests - E-Ticaret Akış Testleri', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Her test öncesi giriş yap
    await loginPage.goto();
    await loginPage.login(
      TestUsers.STANDARD_USER.username,
      TestUsers.STANDARD_USER.password
    );
  });

  test('should display products on inventory page - Ürünler sayfası ürünleri göstermeli', async () => {
    // Sayfa başlığı kontrolü
    const title = await inventoryPage.getPageTitle();
    expect(title).toBe('Products');

    // Ürün sayısı kontrolü (SauceDemo'da 6 ürün var)
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(6);
  });

  test('should add product to cart - Ürün sepete eklenebilmeli', async () => {
    // Sepet başlangıçta boş olmalı
    let cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(0);

    // Backpack ürününü sepete ekle
    await inventoryPage.addProductToCartByName(Products.BACKPACK);

    // Sepet sayısı 1 olmalı
    cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });

  test('should add multiple products to cart - Birden fazla ürün sepete eklenebilmeli', async () => {
    // İlk ürünü ekle
    await inventoryPage.addProductToCartByName(Products.BACKPACK);
    
    // İkinci ürünü ekle
    await inventoryPage.addProductToCartByName(Products.BIKE_LIGHT);

    // Sepet sayısı 2 olmalı
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(2);
  });

  test('should sort products by price - Ürünler fiyata göre sıralanabilmeli', async () => {
    // Düşükten yükseğe sırala
    await inventoryPage.sortProducts('lohi');
    
    // İlk ürün en ucuz olmalı
    const firstProductPrice = await inventoryPage.getFirstProductPrice();
    expect(firstProductPrice).toBe('$7.99'); // En ucuz ürün: Onesie
  });

  test('should view cart with added products - Sepetteki ürünler görüntülenebilmeli', async () => {
    // Ürün ekle
    await inventoryPage.addProductToCartByName(Products.BACKPACK);
    
    // Sepete git
    await inventoryPage.goToCart();

    // Sepet sayfası başlığı
    const title = await cartPage.getPageTitle();
    expect(title).toBe('Your Cart');

    // Ürün sepette olmalı
    const isProductInCart = await cartPage.isProductInCart(Products.BACKPACK);
    expect(isProductInCart).toBeTruthy();
  });

  test('should remove product from cart - Ürün sepetten kaldırılabilmeli', async () => {
    // Ürün ekle
    await inventoryPage.addProductToCartByName(Products.BACKPACK);
    
    // Sepete git
    await inventoryPage.goToCart();

    // Ürünü sepetten kaldır
    await cartPage.removeProductByName(Products.BACKPACK);

    // Sepet boş olmalı
    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBe(0);
  });

  test('should complete checkout process - Ödeme işlemi tamamlanabilmeli', async () => {
    // Ürün ekle
    await inventoryPage.addProductToCartByName(Products.BACKPACK);
    
    // Sepete git
    await inventoryPage.goToCart();

    // Checkout'a devam et
    await cartPage.proceedToCheckout();

    // Checkout bilgilerini doldur
    await checkoutPage.fillCheckoutInfo(
      CheckoutInfo.VALID.firstName,
      CheckoutInfo.VALID.lastName,
      CheckoutInfo.VALID.postalCode
    );

    // Devam et
    await checkoutPage.clickContinue();

    // Toplam tutar görüntülenmeli
    const total = await checkoutPage.getTotalAmount();
    expect(total).toContain('Total:');

    // Siparişi tamamla
    await checkoutPage.finishOrder();

    // Başarı mesajı kontrolü
    const completeMessage = await checkoutPage.getCompleteMessage();
    expect(completeMessage).toBe('Thank you for your order!');
  });

  test('should complete full e-commerce flow - Tam e-ticaret akışı tamamlanabilmeli', async () => {
    // 1. Ürünleri görüntüle
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    // 2. Birden fazla ürün ekle
    await inventoryPage.addProductToCartByName(Products.BACKPACK);
    await inventoryPage.addProductToCartByName(Products.FLEECE_JACKET);

    // 3. Sepete git ve kontrol et
    await inventoryPage.goToCart();
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(2);

    // 4. Checkout işlemini başlat
    await cartPage.proceedToCheckout();

    // 5. Bilgileri doldur
    await checkoutPage.fillCheckoutInfo(
      CheckoutInfo.VALID.firstName,
      CheckoutInfo.VALID.lastName,
      CheckoutInfo.VALID.postalCode
    );
    await checkoutPage.clickContinue();

    // 6. Siparişi tamamla
    await checkoutPage.finishOrder();

    // 7. Başarı kontrolü
    expect(await checkoutPage.isOrderComplete()).toBeTruthy();

    // 8. Ana sayfaya dön
    await checkoutPage.backToHome();

    // 9. Inventory sayfasında olduğumuzu doğrula
    const title = await inventoryPage.getPageTitle();
    expect(title).toBe('Products');
  });
});
