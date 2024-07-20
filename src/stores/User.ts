import { makeAutoObservable } from 'mobx';
import { Locale, UserItem } from '@src/types';

class Store {
  // stockList: StockItem[] = [];
  locale: Locale = null;
  currentUser: UserItem = null;
  i18n = null;
  setDefaultLocale = (locale: Locale) => {};

  constructor(initData?: any) {
    const { locale, defaultLocale, setDefaultLocale, i18n } = initData || {};
    // this.stockList = [];
    this.locale = locale || defaultLocale;
    this.currentUser = null;
    this.i18n = i18n;
    this.i18n?.setLocale(this.locale);
    this.setDefaultLocale = setDefaultLocale;
    makeAutoObservable(this);
  }

  // setStockList(newList: StockItem[]) {
  //   this.stockList = newList;
  // }

  setCurrentUser(user: UserItem) {
    this.currentUser = user;
  }

  setLocale(locale: Locale) {
    this.locale = locale;
    this.setDefaultLocale(locale);
    this.i18n?.setLocale(locale);
  }
}
export default Store;
