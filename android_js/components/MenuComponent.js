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
      mealDataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 != row2,
        sectionHeaderHasChanged: (header1, header2) => header1 != header2
      }),
      tabs: [],
      currentTab: null,
      menuData: null
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          title="InCafe"
          titleColor='#FFFFFF'/>
        <Tabs
          dataSource={this.state.tabs}
          currentTab={this.state.currentTab}
          onPress={this.onChangeMenuForDay.bind(this)} />
        <ListView
          dataSource={this.state.mealDataSource}
          renderSectionHeader={this.renderStationHeader}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator} />
        </View>
    );
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableNativeFeedback>
        <View style={styles.dishRow}>
          <Text style={styles.dishLabel}>{rowData.label}</Text>
          <Text style={styles.dishDescription}>{rowData.description}</Text>
        </View>
      </TouchableNativeFeedback>
    );
  }

  renderStationHeader(sectionData, sectionID) {
    return (
      <View style={styles.stationRow}>
        <Text style={styles.stationText}>{sectionID}</Text>
      </View>
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View style={styles.dishRowSeparator} key={sectionID + '-' + rowID}></View>
    );
  }

  componentDidMount() {
    this.getData(this.state.currentTab).done();
  }

  onChangeMenuForDay(nextTab) {
    if (this.state.menuData) {
      const nextTabIndex = this.state.tabs.indexOf(nextTab);
      const stations = this.getStationsFromData(this.state.menuData, nextTabIndex);
      const itemsMap = this.state.menuData.items;
      const mealDataSource = MenuDataProvider.parseMeal(stations, itemsMap);
      this.setState({
        mealDataSource: this.state.mealDataSource.cloneWithRowsAndSections(mealDataSource),
        currentTab: nextTab
      });
    }
  }

  async getData(tab) {
    const menuApi = MenuDataProvider.getMenuApi(this.props.cafeId, this.props.date);

    try {
      let response = await fetch(menuApi);
      let data = await response.json();
      const tabs = MenuDataProvider.getMealTabs(data.days[0].cafes[this.props.cafeId].dayparts[0]);
      // display menu for first meal (Breakfast) first
      const tabIndex = 0;
      const currentTab = tabs[tabIndex];
      const stations = this.getStationsFromData(data, tabIndex);
      const itemsMap = data.items;
      const mealDataSource = MenuDataProvider.parseMeal(stations, itemsMap);
      this.setState({
        mealDataSource: this.state.mealDataSource.cloneWithRowsAndSections(mealDataSource),
        menuData: data,
        tabs: tabs,
        currentTab: currentTab
      });
    } catch (error) {
      console.warn(error);
    }
  }

  getStationsFromData(data, tabIndex) {
    return data.days[0].cafes[this.props.cafeId].dayparts[0][tabIndex].stations;
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
    paddingHorizontal: 20,
    elevation: 2
  },
  dishLabel: {
    fontSize: 16,
    color: '#000000'
  },
  dishDescription: {
    fontSize: 12,
    color: '#616161',
    marginTop: 5,
    marginLeft: 10
  },
  dishRowSeparator: {
    height: 1,
    backgroundColor: '#B9F6CA',
    marginHorizontal: 20
  },
  stationRow: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#EEEEEE',
  },
  stationText: {
    fontSize: 16,
    color: '#616161'
  }
});

module.exports = MenuComponent;
