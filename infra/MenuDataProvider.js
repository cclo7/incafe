
const URL_CAFE_BONAPPETIT_MENU = 'http://legacy.cafebonappetit.com/api/2/menus?';
const URL_PARAM_CAFE = 'cafe';
const URL_PARAM_DATE = 'date';
const AMPERSAND = '&';

let Meal = require('./models/Meal');
let FoodStation = require('./models/FoodStation');

class MenuDataProvider {

  static getMenuApi(cafeId, date) {
    let dateString = this.getValidDateForApiFromDateObject(date);
    return URL_CAFE_BONAPPETIT_MENU + URL_PARAM_CAFE + '=' + cafeId
      + AMPERSAND + URL_PARAM_DATE + '=' + dateString;
  }

  static parseMeal(stations, itemsMap) {
    let result = {};

    stations.map(function(station) {
      const stationItems = station.items.map(function(itemId) {
        return itemsMap[itemId];
      });
      result[station.label] = stationItems;
    });

    return result;
  }

  static getMealTabs(daypart) {
    return daypart.map(function(entry) {
      return entry.label;
    });
  }

  static getValidDateForApi(year, month, day) {
    const SEPARATOR = '-';
    const fullMonth = this.getTwoDigitValue(month + 1);
    const fullDay = this.getTwoDigitValue(day);
    return year + SEPARATOR + fullMonth + SEPARATOR + fullDay;
  }

  static getValidDateForApiFromDateObject(date) {
    const SEPARATOR = '-';
    const fullMonth = this.getTwoDigitValue(date.getMonth() + 1);
    const fullDay = this.getTwoDigitValue(date.getDate());
    return date.getUTCFullYear() + SEPARATOR + fullMonth + SEPARATOR + fullDay;
  }

  static getTwoDigitValue(value) {
    return value > 9 ? value : '0' + value;
  }

  static getTodayDate() {
    const d = new Date();
    return this.getValidDateForApi(d.getUTCFullYear(), d.getMonth(), d.getDate());
  }

  static getDateForToolbarDisplay(date) {
    return date.getMonth() + 1 + '/' + date.getDate();
  }

};

module.exports = MenuDataProvider;
