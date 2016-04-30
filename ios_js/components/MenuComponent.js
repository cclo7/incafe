'use strict';
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  ListView,
  StatusBar,
  SegmentedControlIOS,
  TouchableOpacity,
  TouchableHighlight,
  Navigator,
  TabBarIOS,
  DatePickerIOS,
  ActionSheetIOS
} from 'react-native';

let MenuDataProvider = require('../.././infra/MenuDataProvider');
let Dimension = require('../.././infra/Dimension');
let CafeManager = require('../.././infra/CafeManager');
let ToolbarComponent = require('../.././infra/components/ToolbarComponent');
let editDateImg = require('../.././infra/img/ic_schedule_white_24dp.png');
const AppError = require('../.././infra/Error');

const DATA_KEY_SEGMENTED_CONTROL = 'CONTROL';

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
      cafe: this.props.cafe,
      date: this.props.date,
      isRefreshing: false,
      error: null
    };
  }

  componentDidMount() {
    this.getData(this.state.cafe, this.state.date).done();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cafe !== this.state.cafe) {
      this.getData(nextProps.cafe, this.state.date).done();
    }
  }

  render() {
    let bodyView = this.renderBody();
    let tabs;
    if (this.state.currentTab) {
      tabs = <SegmentedControlIOS
              style={styles.segmentedControl}
              tintColor="#FF9800"
              selectedIndex={0}
              onValueChange={this.onChangeMenuForDay.bind(this)}
              values={this.state.tabs} />;
    }

    return (
      <View style={styles.container}>
        <StatusBar
          style={styles.statusBar}
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
    if (sectionID === DATA_KEY_SEGMENTED_CONTROL) {
      return (
        <SegmentedControlIOS
          style={styles.segmentedControl}
          tintColor="#FF9800"
          selectedIndex={0}
          onValueChange={this.onChangeMenuForDay.bind(this)}
          values={this.state.tabs} />
      );
    }

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
        style={styles.bodyContainer}
        dataSource={this.state.mealDataSource}
        renderSectionHeader={this.renderStationHeader}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator} />
    );
  }

  renderBody() {
    let errorView;
    if (this.state.error) {
      return this.renderErrorView();
    } else {
      return this.renderListView();
    }
  }

  renderErrorView() {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{AppError.getErrorMessage(this.state.error)}</Text>
      </View>
    );
  }

  onChangeMenuForDay(nextTab) {
    if (this.state.menuData) {
      const nextTabIndex = this.state.tabs.indexOf(nextTab);
      const cafeId = CafeManager.getCafeIdFromName(this.state.cafe);
      const stations = this.getStationsFromData(this.state.menuData, cafeId, nextTabIndex);
      const itemsMap = this.state.menuData.items;
      const mealDataSource = MenuDataProvider.parseMeal(stations, itemsMap);

      this.setState({
        mealDataSource: this.state.mealDataSource.cloneWithRowsAndSections(mealDataSource),
        currentTab: nextTab
      });
    }
  }

  async getData(cafe, date) {
    this.setState({isRefreshing: true});
    const cafeId = CafeManager.getCafeIdFromName(cafe);
    const menuApi = MenuDataProvider.getMenuApi(cafeId, date);

    try {
      let response = await fetch(menuApi);
      let data = await response.json();
      console.log(data);
      const cafeData = data.days[0].cafes[cafeId];
      if (!cafeData || !cafeData.dayparts || !cafeData.dayparts.length || !cafeData.dayparts[0].length) {
        this.setState({
          error: 'NoMenuData',
          isRefreshing: false,
          cafe: cafe,
          date: date,
          tabs: null,
          currentTab: null
        });
        return;
      }

      const tabs = MenuDataProvider.getMealTabs(cafeData.dayparts[0]);
      // display menu for first meal (Breakfast) first
      const tabIndex = this.state.currentTab ? tabs.indexOf(this.state.currentTab) : 0;
      const currentTab = tabs[tabIndex];
      const stations = this.getStationsFromData(data, cafeId, tabIndex);
      const itemsMap = data.items;
      const mealDataSource = MenuDataProvider.parseMeal(stations, itemsMap);

      this.setState({
        mealDataSource: this.state.mealDataSource.cloneWithRowsAndSections(mealDataSource),
        cafe: cafe,
        date: date,
        menuData: data,
        tabs: tabs,
        currentTab: currentTab,
        isRefreshing: false,
        error: null
      });

    } catch (error) {
      console.log(error);
      this.setState({
        error: error
      });
    }
  }

  getStationsFromData(data, cafeId, tabIndex) {
    return data.days[0].cafes[cafeId].dayparts[0][tabIndex].stations;
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: Dimension.TOOLBAR_HEIGHT,
  },
  segmentedControl: {
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF'
  },
  dishRow: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2
  },
  dishLabel: {
    fontSize: 14,
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
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: '#FFE0B2',
  },
  stationText: {
    fontSize: 14,
    color: '#616161',
    fontWeight: 'bold'
  },
  errorContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1
  },
  errorMessage: {
    fontSize: 16,
    marginTop: 30
  },
});

module.exports = MenuComponent;
