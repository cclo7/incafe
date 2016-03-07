'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
} from 'react-native';

var MenuComponent = require('./android_js/components/MenuComponent');

class incafe extends Component {
  render() {
    return (
      <Navigator
        ref='navigator'
        initialRoute={{name: 'Menu', index: 0}}
        renderScene={this.renderScene}/>
    );
  }

  renderScene(route, navigator) {
    switch (route.name) {
      case 'Menu':
        return (
          <MenuComponent
            cafeId="633"
            date="2016-03-07"/>
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

AppRegistry.registerComponent('incafe', () => incafe);
