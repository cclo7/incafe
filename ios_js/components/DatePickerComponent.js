'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableHighlight,
  DatePickerIOS
} from 'react-native';

let Dimension = require('../.././infra/Dimension');
let ModalToolbarComponent = require('../.././infra/components/ModalToolbarComponent');

class DatePickerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this.props.initDate
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="default"/>
        <View style={styles.datePickerContainer}>
          <DatePickerIOS
            mode='date'
            date={this.state.date}
            onDateChange={this.onDateChange.bind(this)}/>
        </View>
        <TouchableHighlight
          style={styles.submitButton}
          onPress={this.onSubmit.bind(this)}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableHighlight>
      </View>
    );
  }

  onSubmit() {
    this.props.onDateChange(this.state.date);
  }

  onDateChange(date) {
    this.setState({
      date: date
    });
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: Dimension.TOOLBAR_HEIGHT,
  },
  datePickerContainer: {
    flex: 1,
    alignItems: 'center'
  },
  submitButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#4CAF50'
  },
  submitButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14
  }
});

module.exports = DatePickerComponent;
