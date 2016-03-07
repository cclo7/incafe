/* @flow */

let Dish = require('./Dish');

class FoodStation {
  label: string;
  items: Array<Dish>;

  constructor(label, items) {
    this.label = label;
    this.items = items;
  }
}

module.exports = FoodStation;
