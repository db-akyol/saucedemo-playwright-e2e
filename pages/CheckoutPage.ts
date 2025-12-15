import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutPage - Ödeme bilgileri sayfası
 */
export class CheckoutPage extends BasePage {
  // Locators
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly finishButton: Locator;
  private readonly errorMessage: Locator;
  private readonly summaryTotal: Locator;
  private readonly completeHeader: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.summaryTotal = page.locator('.summary_total_label');
    this.completeHeader = page.locator('.complete-header');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Checkout bilgilerini gir
   */
  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Devam et butonuna tıkla
   */
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  /**
   * İptal butonuna tıkla
   */
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Siparişi tamamla
   */
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  /**
   * Hata mesajını al
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Toplam tutarı al
   */
  async getTotalAmount(): Promise<string> {
    return await this.summaryTotal.textContent() || '';
  }

  /**
   * Sipariş tamamlama mesajını al
   */
  async getCompleteMessage(): Promise<string> {
    return await this.completeHeader.textContent() || '';
  }

  /**
   * Ana sayfaya dön
   */
  async backToHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  /**
   * Tamamlama mesajının görünür olup olmadığını kontrol et
   */
  async isOrderComplete(): Promise<boolean> {
    return await this.completeHeader.isVisible();
  }
}
