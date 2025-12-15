import { Page } from '@playwright/test';

/**
 * BasePage - Tüm sayfa nesnelerinin miras aldığı temel sınıf
 * Ortak metodları ve özellikleri içerir
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Belirtilen URL'ye git
   */
  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Sayfanın yüklenmesini bekle
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Sayfanın başlığını al
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Sayfanın URL'sini al
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Belirli bir süre bekle (sadece debug amaçlı)
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
