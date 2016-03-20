'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
} from 'react-native';

var MenuComponent = require('./ios_js/components/MenuComponent');
var DatePickerComponent = require('./ios_js/components/DatePickerComponent');
var MenuDataProvider = require('./infra/MenuDataProvider');

class incafe2 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
  }

  render() {
    return (
      <Navigator
        ref='navigator'
        initialRoute={{name: 'Menu', index: 0}}
        renderScene={this.renderScene.bind(this)}/>
    );
  }

  renderScene(route, navigator) {
    switch (route.name) {
      case 'Menu':
        return (
          <MenuComponent
            initCafe="inCafe"
            initDate={MenuDataProvider.getValidDateForApiFromDateObject(this.state.date)}
            onPressEditDate={() => {
              navigator.push({
                name: 'DatePicker',
                index: route.index + 1
              });
            }}/>
        );
      case 'DatePicker':
        return (
          <DatePickerComponent
            onDateChange={(date) => {
              this.setState({
                date: date
              });
              navigator.push({
                name: 'Menu',
                index: route.index + 1
              });
            }}
            onCancel={() => {
              navigator.pop();
            }}
            initDate={this.state.date}/>
        );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('incafe2', () => incafe2);
