'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  ActionSheetIOS
} from 'react-native';

var MenuComponent = require('./ios_js/components/MenuComponent');
var DatePickerComponent = require('./ios_js/components/DatePickerComponent');
var MenuDataProvider = require('./infra/MenuDataProvider');
var CafeManager = require('./infra/CafeManager');
var Nav = require('./infra/Nav');

class incafe extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cafe: 'inCafe',
      date: new Date()
    };
  }

  render() {
    return (
      <Navigator
        ref='navigator'
        initialRoute={this.getMenuRoute(this.state.cafe)}
        renderScene={this.renderScene.bind(this)}
        navigationBar={
          <Navigator.NavigationBar
            style={ Nav.navStyles }
            routeMapper={ Nav.navigationBarRouteMapper } />
        }/>
    );
  }

  renderScene(route, navigator) {
    let self = this;
    switch (route.name) {
      case 'Menu':
        return (
          <MenuComponent
            cafe={route.cafe}
            date={this.state.date} />
        );
      case 'DatePicker':
        return (
          <DatePickerComponent
            onDateChange={(date) => {
              this.setState({
                date: date
              });
              navigator.resetTo(this.getMenuRoute(route.cafe));
            }}
            initDate={this.state.date}/>
        );
    }
  }

  getMenuRoute(cafe) {
    return {
      name: 'Menu',
      index: 0,
      cafe: cafe,
      title: cafe + ' ' + MenuDataProvider.getDateForToolbarDisplay(this.state.date),
      leftText: 'Cafe',
      rightText: 'Date',
      onPressLeft: this.menuLeftPressHandler.bind(this),
      onPressRight: this.menuRightPressHandler.bind(this)
    };
  }

  menuLeftPressHandler(route, navigator) {
    const cafeNameList = CafeManager.getCafeNameList().concat('Cancel');
    const cafeList = CafeManager.getCafeList().concat('Cancel');
    const cancelButtonIndex = cafeList.length-1;
    ActionSheetIOS.showActionSheetWithOptions({
      options: cafeNameList,
      cancelButtonIndex: cancelButtonIndex
    },
    (buttonIndex) => {
      if (buttonIndex !== cancelButtonIndex) {
        const cafe = cafeList[buttonIndex];
        navigator.resetTo(this.getMenuRoute(cafe));
      }
    });
  }

  menuRightPressHandler(route, navigator) {
    navigator.push({
      name: 'DatePicker',
      index: 1,
      cafe: this.state.cafe,
      leftText: 'Back',
      title: 'Pick another date',
      onPressLeft: () => navigator.pop()
    });
  }
}

console.ignoredYellowBox = [
  'Warning: Failed propType',
  // Other warnings you don't want like 'jsSchedulingOverhead',
];

AppRegistry.registerComponent('incafe', () => incafe);
