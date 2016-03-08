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
  TouchableNativeFeedback,
  DatePickerAndroid,
  PullToRefreshViewAndroid
} from 'react-native';

let MenuDataProvider = require('../.././infra/MenuDataProvider');
let Dimension = require('../.././infra/Dimension');
let Tabs = require('../.././infra/components/TabsComponent');
let CafeMap = require('../.././infra/CafeMap');
let editDateImg = require('../.././infra/img/ic_schedule_white_24dp.png');

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
      menuData: null,
      cafe: this.props.initCafe,
      date: this.props.initDate,
      isRefreshing: false
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          title={this.state.cafe + ' ' + this.state.date}
          titleColor='#FFFFFF'
          actions={[{title: 'Change', icon: editDateImg, show: 'always'}]}
          onActionSelected={this.onToolbarActionSelected.bind(this)} />
        <Tabs
          dataSource={this.state.tabs}
          currentTab={this.state.currentTab}
          onPress={this.onChangeMenuForDay.bind(this)} />
        <PullToRefreshViewAndroid
          style={styles.container}
          refreshing={this.state.isRefreshing}
          onRefresh={this.onRefreshData.bind(this)}
          colors={['#69F0AE', '#00E676', '#00C853']}
          progressBackgroundColor={'#388E3C'} >
          <ListView
            dataSource={this.state.mealDataSource}
            renderSectionHeader={this.renderStationHeader}
            renderRow={this.renderRow}
            renderSeparator={this.renderSeparator} />
        </PullToRefreshViewAndroid>
      </View>
    );
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
    let descriptionText;
    if (rowData.description.length) {
      descriptionText = <Text style={styles.dishDescription}>{rowData.description}</Text>;
    }
    return (
      <TouchableNativeFeedback>
        <View style={styles.dishRow}>
          <Text style={styles.dishLabel}>{rowData.label}</Text>
          {descriptionText}
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
    this.getData(this.state.cafe, this.state.date).done();
  }

  onRefreshData() {
    this.getData(this.state.cafe, this.state.date);
  }

  onChangeMenuForDay(nextTab) {
    if (this.state.menuData) {
      const nextTabIndex = this.state.tabs.indexOf(nextTab);
      const cafeId = CafeMap[this.state.cafe];
      const stations = this.getStationsFromData(this.state.menuData, cafeId, nextTabIndex);
      const itemsMap = this.state.menuData.items;
      const mealDataSource = MenuDataProvider.parseMeal(stations, itemsMap);
      this.setState({
        mealDataSource: this.state.mealDataSource.cloneWithRowsAndSections(mealDataSource),
        currentTab: nextTab
      });
    }
  }

  onToolbarActionSelected(position) {
    this.openDatePicker();
  }

  async openDatePicker() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.getData(this.state.cafe, MenuDataProvider.getValidDateForApi(year, month, day));
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  async getData(cafe, date) {
    this.setState({isRefreshing: true});
    const cafeId = CafeMap[cafe];
    const menuApi = MenuDataProvider.getMenuApi(cafeId, date);

    try {
      let response = await fetch(menuApi);
      let data = await response.json();
      const tabs = MenuDataProvider.getMealTabs(data.days[0].cafes[cafeId].dayparts[0]);
      // display menu for first meal (Breakfast) first
      const tabIndex = this.state.currentTab ? tabs.indexOf(this.state.currentTab) : 0;
      const currentTab = tabs[tabIndex];
      const stations = this.getStationsFromData(data, cafeId, tabIndex);
      const itemsMap = data.items;
      const mealDataSource = MenuDataProvider.parseMeal(stations, itemsMap);
      this.setState({
        mealDataSource: this.state.mealDataSource.cloneWithRowsAndSections(mealDataSource),
        menuData: data,
        tabs: tabs,
        currentTab: currentTab,
        date: date,
        isRefreshing: false
      });
    } catch (error) {
      console.warn(error);
    }
  }

  getStationsFromData(data, cafeId, tabIndex) {
    return data.days[0].cafes[cafeId].dayparts[0][tabIndex].stations;
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
    paddingVertical: 15,
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
    backgroundColor: '#E0E0E0',
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
