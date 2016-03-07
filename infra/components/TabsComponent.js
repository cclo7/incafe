'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback
} from 'react-native';

let Dimension = require('.././Dimension');

class TabsComponent extends Component {
  render() {
    let tabs = this.props.dataSource;
    let onPress = this.props.onPress;
    return (
      <View style={styles.toolbarContainer}>
        {tabs.map(function(tab, i) {
          return (
            <TouchableNativeFeedback
              key={i}
              onPress={onPress}
              background={TouchableNativeFeedback.SelectableBackground()}>
              <View style={styles.toolbarButton}>
                <Text style={styles.toolbarButtonText}>{tab}</Text>
              </View>
            </TouchableNativeFeedback>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toolbarButton: {
    height: Dimension.toolbar_height,
    justifyContent: 'center',
    flex: 1,
  },
  toolbarButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    alignSelf: 'center',
  },
  toolbarContainer: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

module.exports = TabsComponent;
