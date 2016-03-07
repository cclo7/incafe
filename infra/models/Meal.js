/* @flow */

let FoodStation = require('./FoodStation');

class Meal {
  label: string;
  startTime: string;
  endTime: string;
  stations: Array<FoodStation>;
}

module.exports = Meal;
