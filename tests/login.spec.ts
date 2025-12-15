import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TestUsers, ErrorMessages } from '../utils/testData';

test.describe('Login Tests - Giriş Testleri', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login page correctly - Giriş sayfası doğru görüntülenmeli', async () => {
    // Logo görünür olmalı
    expect(await loginPage.isLogoVisible()).toBeTruthy();
    
    // Sayfa başlığı kontrol
    const title = await loginPage.getTitle();
    expect(title).toBe('Swag Labs');
  });

  test('should login successfully with valid credentials - Geçerli bilgilerle giriş yapılabilmeli', async ({ page }) => {
    // Giriş yap
    await loginPage.login(
      TestUsers.STANDARD_USER.username,
      TestUsers.STANDARD_USER.password
    );

    // Başarılı giriş sonrası inventory sayfasına yönlendirme
    await expect(page).toHaveURL(/inventory/);
  });

  test('should show error for locked out user - Kilitli kullanıcı için hata göstermeli', async () => {
    // Kilitli kullanıcı ile giriş dene
    await loginPage.login(
      TestUsers.LOCKED_OUT_USER.username,
      TestUsers.LOCKED_OUT_USER.password
    );

    // Hata mesajı kontrolü
    expect(await loginPage.isErrorVisible()).toBeTruthy();
  });

  test('should show error for invalid credentials - Geçersiz bilgiler için hata göstermeli', async () => {
    // Geçersiz bilgilerle giriş dene
    await loginPage.login(
      TestUsers.INVALID_USER.username,
      TestUsers.INVALID_USER.password
    );

    // Hata mesajı görünür olmalı
    expect(await loginPage.isErrorVisible()).toBeTruthy();
  });
});
