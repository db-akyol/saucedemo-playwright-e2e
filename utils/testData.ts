/**
 * Test verileri - SauceDemo sitesi için kullanıcı bilgileri ve test değerleri
 */

export const TestUsers = {
  // Geçerli kullanıcılar
  STANDARD_USER: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  LOCKED_OUT_USER: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  PROBLEM_USER: {
    username: 'problem_user',
    password: 'secret_sauce'
  },
  PERFORMANCE_GLITCH_USER: {
    username: 'performance_glitch_user',
    password: 'secret_sauce'
  },
  // Geçersiz kullanıcı
  INVALID_USER: {
    username: 'invalid_user',
    password: 'wrong_password'
  }
};

export const CheckoutInfo = {
  VALID: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  },
  EMPTY: {
    firstName: '',
    lastName: '',
    postalCode: ''
  }
};

export const Products = {
  BACKPACK: 'Sauce Labs Backpack',
  BIKE_LIGHT: 'Sauce Labs Bike Light',
  BOLT_TSHIRT: 'Sauce Labs Bolt T-Shirt',
  FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
  ONESIE: 'Sauce Labs Onesie',
  TSHIRT_RED: 'Test.allTheThings() T-Shirt (Red)'
};

export const ErrorMessages = {
  LOCKED_OUT: 'Epic sadance: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  MISSING_USERNAME: 'Epic sadface: Username is required',
  MISSING_PASSWORD: 'Epic sadface: Password is required',
  MISSING_FIRST_NAME: 'Error: First Name is required',
  MISSING_LAST_NAME: 'Error: Last Name is required',
  MISSING_POSTAL_CODE: 'Error: Postal Code is required'
};
