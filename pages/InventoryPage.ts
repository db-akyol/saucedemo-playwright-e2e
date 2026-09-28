import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * InventoryPage - Ürünler listesi sayfası (Products Page)
 */
export class InventoryPage extends BasePage {
  // Locators
  private readonly pageTitle: Locator;
  private readonly inventoryItems: Locator;
  private readonly shoppingCartBadge: Locator;
  private readonly shoppingCartLink: Locator;
  private readonly sortDropdown: Locator;
  private readonly burgerMenuButton: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  /**
   * Envanter sayfasına git
   */
  async goto(): Promise<void> {
    await this.navigate('/inventory.html');
  }

  /**
   * Sayfa başlığını al
   */
  async getPageTitle(): Promise<string> {
    // SPA geçişinde eski sayfanın başlığını okumamak için ürün listesinin render edilmesini bekle
    await this.inventoryItems.first().waitFor();
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Tüm ürünlerin sayısını al
   */
  async getProductCount(): Promise<number> {
    // count() otomatik beklemez; önce listenin render edilmesini bekle
    await this.inventoryItems.first().waitFor();
    return await this.inventoryItems.count();
  }

  /**
   * Belirli bir ürünü sepete ekle (index ile)
   */
  async addProductToCartByIndex(index: number): Promise<void> {
    const addButton = this.inventoryItems.nth(index).locator('button:has-text("Add to cart")');
    await addButton.click();
  }

  /**
   * Ürünü isme göre sepete ekle
   */
  async addProductToCartByName(productName: string): Promise<void> {
    const product = this.page.locator('.inventory_item').filter({ hasText: productName });
    await product.locator('button:has-text("Add to cart")').click();
  }

  /**
   * Sepetteki ürün sayısını al
   */
  async getCartItemCount(): Promise<number> {
    const isVisible = await this.shoppingCartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.shoppingCartBadge.textContent();
    return parseInt(text || '0', 10);
  }

  /**
   * Sepete git
   */
  async goToCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  /**
   * Ürünleri sırala
   */
  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /**
   * İlk ürünün adını al
   */
  async getFirstProductName(): Promise<string> {
    const firstItem = this.inventoryItems.first().locator('.inventory_item_name');
    return await firstItem.textContent() || '';
  }

  /**
   * İlk ürünün fiyatını al
   */
  async getFirstProductPrice(): Promise<string> {
    const firstItem = this.inventoryItems.first().locator('.inventory_item_price');
    return await firstItem.textContent() || '';
  }

  /**
   * Ürün detay sayfasına git
   */
  async clickProductByName(productName: string): Promise<void> {
    await this.page.locator('.inventory_item_name').filter({ hasText: productName }).click();
  }

  /**
   * Çıkış yap
   */
  async logout(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }
}
