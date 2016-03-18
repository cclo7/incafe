'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ListView,
  DatePickerAndroid,
  PullToRefreshViewAndroid,
  RecyclerViewBackedScrollView,
  StatusBar,
  SegmentedControlIOS,
  TouchableOpacity,
  Navigator
} from 'react-native';

let MenuDataProvider = require('../.././infra/MenuDataProvider');
let Dimension = require('../.././infra/Dimension');
let Tabs = require('../.././infra/components/TabsComponent');
let CafeMap = require('../.././infra/CafeMap');
let editDateImg = require('../.././infra/img/ic_schedule_white_24dp.png');
const AppError = require('../.././infra/Error');

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
      isRefreshing: false,
      error: null
    };
  }

  render() {
    let bodyView = this.renderBody();
    let tabs;
    if (this.state.currentTab) {
      tabs = <SegmentedControlIOS
              style={styles.tabs}
              tintColor="#FF9800"
              selectedIndex={0}
              onValueChange={this.onChangeMenuForDay.bind(this)}
              values={this.state.tabs} />;
    }

    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="default"
          networkActivityIndicatorVisible={this.state.isRefreshing} />
        {tabs}
        {bodyView}
      </View>
    );
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
    let descriptionText;
    if (rowData.description.length) {
      const formattedDescription = rowData.description.replace(/<br \/>/g, '\n');
      descriptionText = <Text style={styles.dishDescription}>{formattedDescription}</Text>;
    }
    return (
      <TouchableOpacity>
        <View style={styles.dishRow}>
          <Text style={styles.dishLabel}>{rowData.label}</Text>
          {descriptionText}
        </View>
      </TouchableOpacity>
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

  renderListView() {
    return (
      <ListView
        dataSource={this.state.mealDataSource}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        renderSectionHeader={this.renderStationHeader}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator} />
    );
  }

  renderBody() {
    let errorView;
    if (this.state.error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{AppError.getErrorMessage(this.state.error)}</Text>
        </View>
      );
    } else {
      return this.renderListView();
    }
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
      const dayData = data.days[0].cafes[cafeId].dayparts[0];
      if (!dayData.length) {
        this.setState({
          error: 'NoMenuData'
        });
        return;
      }

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
        isRefreshing: false,
        error: null
      });

    } catch (error) {
      this.setState({
        error: error
      });
    }
  }

  getStationsFromData(data, cafeId, tabIndex) {
    return data.days[0].cafes[cafeId].dayparts[0][tabIndex].stations;
  }

}

const STATUS_BAR_HEIGHT = 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: STATUS_BAR_HEIGHT
  },
  tabs: {
    marginHorizontal: 20,
    marginBottom: 15,
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
    backgroundColor: '#FFE0B2',
    marginHorizontal: 20
  },
  stationRow: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFE0B2',
  },
  stationText: {
    fontSize: 16,
    color: '#616161'
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorMessage: {
    fontSize: 16,
    marginTop: 30
  }
});

module.exports = MenuComponent;