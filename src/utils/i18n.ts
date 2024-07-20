// i18n.loadJSON(jsonData /*, domain */);
import GetText from 'gettext.js';
import locales from '../locales/index';

const i18n = GetText({ locale: 'zh-CN' });

Object.values(locales).forEach((locale) => {
  i18n.loadJSON(locale, 'messages');
});

const __ = i18n.__.bind(i18n);
export { locales, i18n, __ };
export default i18n;
