'use strict';
import React, {
  StyleSheet,
  Text,
  TouchableHighlight
} from 'react-native';

let Dimension = require('./Dimension');

const styles = StyleSheet.create({
  nav: {
    backgroundColor: '#4CAF50',
    height: Dimension.TOOLBAR_HEIGHT,
  },
  navText: {
    marginTop: 10,
    paddingHorizontal: 15,
    color: '#FFFFFF'
  },
  title: {
    fontWeight: 'bold'
  }
});

let Nav = {
  navigationBarRouteMapper: {
    LeftButton(route, navigator, index, navState) {
      if(route.leftText) {
        return (
          <TouchableHighlight
            onPress={() => {
              if (route.onPressLeft) {
                route.onPressLeft(route, navigator);
              }
            }}>
            <Text style={[styles.leftNavButtonText, styles.navText]}>{route.leftText}</Text>
          </TouchableHighlight>)
      }
      else { return null }
    },
    RightButton(route, navigator, index, navState) {
      if (route.rightText) {
        return (
          <TouchableHighlight
            onPress={ () => {
              if (route.onPressRight) {
                route.onPressRight(route, navigator);
              }
            }}>
            <Text style={[styles.rightNavButtonText, styles.navText]}>{route.rightText}</Text>
          </TouchableHighlight>
        );
      }
    },
    Title(route, navigator, index, navState) {
      return <Text style={[styles.title, styles.navText]}>{route.title}</Text>
    }
  },

  navStyles: styles.nav
};

module.exports = Nav;
