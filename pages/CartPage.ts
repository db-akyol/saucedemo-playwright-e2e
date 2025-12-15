import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage - Alışveriş sepeti sayfası
 */
export class CartPage extends BasePage {
  // Locators
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /**
   * Sepet sayfasına git
   */
  async goto(): Promise<void> {
    await this.navigate('/cart.html');
  }

  /**
   * Sayfa başlığını al
   */
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Sepetteki ürün sayısını al
   */
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Belirli bir ürünün sepette olup olmadığını kontrol et
   */
  async isProductInCart(productName: string): Promise<boolean> {
    const product = this.page.locator('.cart_item').filter({ hasText: productName });
    return await product.count() > 0;
  }

  /**
   * Ürünü sepetten kaldır
   */
  async removeProductByName(productName: string): Promise<void> {
    const product = this.page.locator('.cart_item').filter({ hasText: productName });
    await product.locator('button:has-text("Remove")').click();
  }

  /**
   * Checkout'a devam et
   */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Alışverişe devam et
   */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /**
   * Tüm ürün isimlerini al
   */
  async getAllProductNames(): Promise<string[]> {
    const names = await this.page.locator('.cart_item .inventory_item_name').allTextContents();
    return names;
  }
}
