'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

let Dimension = require('.././Dimension');
let editDateImg = require('../.././infra/img/ic_schedule_white_24dp.png');

class ToolbarComponent extends Component {

  constructor(props) {
    super(props);
  }


  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>{this.props.title}</Text>
        <TouchableOpacity
          style={styles.editDateButton}
          onPress={this.props.onPressEditDate}>
          <Image
            source={editDateImg} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimension.TOOLBAR_HEIGHT_IOS,
    position: 'relative'
  },
  titleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  editDateButton: {
    position: 'absolute',
    right: 20,
    top: 9
  }
});

module.exports = ToolbarComponent;
