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
let clearIcon = require('../.././infra/img/ic_clear_white_24dp.png');

class ModalToolbarComponent extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.exitButton}
          onPress={this.props.onPressExit}>
          <Image
            source={clearIcon} />
        </TouchableOpacity>
        <Text style={styles.titleText}>{this.props.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    height: Dimension.TOOLBAR_HEIGHT_IOS,
  },
  titleText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
    fontSize: Dimension.MODAL_TITLE_TEXT_SIZE
  },
  exitButton: {
    padding: 10,
    marginRight: 10
  }
});

module.exports = ModalToolbarComponent;
