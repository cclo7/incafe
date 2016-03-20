'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  DatePickerIOS
} from 'react-native';

let Dimension = require('../.././infra/Dimension');

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
        <DatePickerIOS
          mode='date'
          date={this.state.date}
          onDateChange={this.onDateChange.bind(this)}/>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={this.onSubmit.bind(this)}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
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
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Dimension.STATUS_BAR_HEIGHT_IOS,
    alignItems: 'center'
  },
  submitButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FF9800'
  },
  submitButtonText: {
    color: '#FFFFFF'
  }
});

module.exports = DatePickerComponent;
