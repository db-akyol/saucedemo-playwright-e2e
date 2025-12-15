import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage - SauceDemo giriş sayfası
 */
export class LoginPage extends BasePage {
  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly logo: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.logo = page.locator('.login_logo');
  }

  /**
   * Ana sayfaya git
   */
  async goto(): Promise<void> {
    await this.navigate('/');
  }

  /**
   * Kullanıcı adı gir
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Şifre gir
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Giriş butonuna tıkla
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Tam login işlemi
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /**
   * Hata mesajını al
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Hata mesajının görünür olup olmadığını kontrol et
   */
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Logo'nun görünür olup olmadığını kontrol et
   */
  async isLogoVisible(): Promise<boolean> {
    return await this.logo.isVisible();
  }
}
