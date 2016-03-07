
const URL_CAFE_BONAPPETIT_MENU = 'http://legacy.cafebonappetit.com/api/2/menus?';
const URL_PARAM_CAFE = 'cafe';
const URL_PARAM_DATE = 'date';
const AMPERSAND = '&';

let Meal = require('./models/Meal');
let FoodStation = require('./models/FoodStation');

class MenuDataProvider {

  static getMenuApi(cafeId, date) {
    return URL_CAFE_BONAPPETIT_MENU + URL_PARAM_CAFE + '=' + cafeId
      + AMPERSAND + URL_PARAM_DATE + '=' + date;
  }

  static parseMeal(stations, itemsMap) {
    let result = {}

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

};

module.exports = MenuDataProvider;
