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
let editCafeImg = require('../.././infra/img/ic_place_white_24dp.png');

class ToolbarComponent extends Component {

  constructor(props) {
    super(props);
  }


  render() {

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={this.props.onPressEditCafe}>
          <Image
            source={editCafeImg} />
        </TouchableOpacity>
        <Text style={styles.titleText}>{this.props.title}</Text>
        <TouchableOpacity
          style={styles.iconButton}
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
    flexDirection: 'row',
    backgroundColor: '#FF9800',
    alignItems: 'center',
    position: 'relative',
    paddingTop: Dimension.STATUS_BAR_HEIGHT_IOS,
    paddingBottom: 12
  },
  titleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    fontSize: Dimension.TITLE_TEXT_SIZE
  },
  iconButton: {
    paddingHorizontal: 10,
  }
});

module.exports = ToolbarComponent;
