// Keep it strictly minimal. Touching plugins/languages trips Google's native alarms.
try {
  Object.defineProperty(navigator, 'webdriver', { get: () => false });
} catch (e) {}

delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
delete window.cdc_adoQpoasnfa76pfcZLmcfl_Promise;
delete window.cdc_adoQpoasnfa76pfcZLmcfl_Symbol;