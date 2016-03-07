'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ToolbarAndroid,
  ListView,
  ViewPagerAndroid,
  TouchableNativeFeedback
} from 'react-native';

let MenuDataProvider = require('../.././infra/MenuDataProvider');
let Dimension = require('../.././infra/Dimension');
let Tabs = require('../.././infra/components/TabsComponent');

class MenuComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: ['Breakfast', 'Lunch'],
      meal: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 != row2,
        sectionHeaderHasChanged: (header1, header2) => header1 != header2
      }),
    };
  }

  render() {

    let listView;
    if (this.state.meal != null) {
      listView = <ListView
        dataSource={this.state.meal}
        renderSectionHeader={this.renderStationHeader}
        renderRow={this.renderRow} />
    }

    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          title="InCafe"
          titleColor='#FFFFFF'/>
        <Tabs
          dataSource={this.state.tabs}
          onPress={this.onChangeMenuForDay} />
        {listView}
      </View>
    );
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableNativeFeedback>
        <View style={styles.dishRow}>
          <Text style={styles.dishText}>{rowData.label}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }

  renderStationHeader(sectionData, sectionID) {
    return (
      <View style={styles.stationRow}>
        <Text style={styles.stationText}>Section: {sectionID}</Text>
      </View>
    );
  }

  componentDidMount() {
    this.getData().done();
  }

  onChangeMenuForDay() {

  }

  async getData() {
    const menuApi = MenuDataProvider.getMenuApi(this.props.cafeId, this.props.date);

    try {
      let response = await fetch(menuApi);
      let data = await response.json();
      const meal = MenuDataProvider.parseMeal(data, this.props.cafeId);
      this.setState({
        meal: this.state.meal.cloneWithRowsAndSections(meal)
      });
    } catch (error) {
      console.warn(error);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  toolbar: {
    backgroundColor: '#4CAF50',
    height: Dimension.toolbar_height,
  },
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
  },
  dishRow: {
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  dishText: {
    fontSize: 16
  },
  stationRow: {
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  stationText: {
    fontSize: 18
  }
});

module.exports = MenuComponent;
