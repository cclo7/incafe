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
    let currentTab = this.props.currentTab;

    return (
      <View style={styles.toolbarContainer}>
        {tabs.map(function(tab, i) {
          let toolbarButtonStyles = [styles.toolbarButton];
          let toolbarButtonTextStyles = [styles.toolbarButtonText];
          if (tab == currentTab) {
            toolbarButtonStyles.push(styles.toolbarButtonHighlight);
            toolbarButtonTextStyles.push(styles.toolbarButtonTextHighlight);
          }
          return (
            <TouchableNativeFeedback
              key={i}
              onPress={ () => onPress(tab)}
              background={TouchableNativeFeedback.SelectableBackground()}>
              <View style={toolbarButtonStyles}>
                <Text style={toolbarButtonTextStyles}>{tab}</Text>
              </View>
            </TouchableNativeFeedback>
          );
        })}
      </View>
    );
  }
}

const TOOLBAR_HIGHLIGHT_WIDTH = 3;

const styles = StyleSheet.create({
  toolbarButton: {
    height: Dimension.toolbar_height,
    justifyContent: 'center',
    flex: 1,
  },
  toolbarButtonHighlight: {
    height: Dimension.toolbar_height - TOOLBAR_HIGHLIGHT_WIDTH,
    borderBottomWidth: TOOLBAR_HIGHLIGHT_WIDTH,
    borderBottomColor: '#FFFFFF'
  },
  toolbarButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    alignSelf: 'center',
  },
  toolbarButtonTextHighlight: {
    fontWeight: 'bold'
  },
  toolbarContainer: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

module.exports = TabsComponent;
