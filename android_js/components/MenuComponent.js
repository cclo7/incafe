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
  RefreshControl,
  RecyclerViewBackedScrollView,
  Picker
} from 'react-native';

let MenuDataProvider = require('../.././infra/MenuDataProvider');
let Dimension = require('../.././infra/Dimension');
let Tabs = require('../.././infra/components/TabsComponent');
let CafeManager = require('../.././infra/CafeManager');
let editDateImg = require('../.././infra/img/ic_schedule_white_24dp.png');
let editCafeImg = require('../.././infra/img/ic_place_white_24dp.png');
const AppError = require('../.././infra/Error');
let DialogAndroid = require('react-native-dialogs');
let StringUtil = require('../.././infra/StringUtil');

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
    if (!this.state.error) {
      tabs = <Tabs
        dataSource={this.state.tabs}
        currentTab={this.state.currentTab}
        onPress={this.onChangeMenuForDay.bind(this)} />;
    }

    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          title={this.state.cafe + ' ' + MenuDataProvider.getDateForToolbarDisplay(this.state.date)}
          titleColor='#FFFFFF'
          actions={this.getToolbarActions()}
          onActionSelected={this.onToolbarActionSelected.bind(this)} />
        {tabs}
        {bodyView}
      </View>
    );
  }

  getToolbarActions() {
    return [
      {title: 'Change Date', icon: editDateImg, show: 'always'},
      {title: 'Change Cafe', icon: editCafeImg, show: 'always'}
    ];
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
    let descriptionText;
    if (rowData.description.length) {
      descriptionText = <Text style={styles.dishDescription}>{rowData.description}</Text>;
    }
    return (
      <TouchableNativeFeedback>
        <View style={styles.dishRow}>
          <Text style={styles.dishLabel}>{StringUtil.capitalizeFirstLetters(rowData.label)}</Text>
          {descriptionText}
        </View>
      </TouchableNativeFeedback>
    );
  }

  renderStationHeader(sectionData, sectionID) {
    return (
      <View style={styles.stationRow}>
        <Text style={styles.stationText}>{StringUtil.capitalizeFirstLetters(sectionID)  }</Text>
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
        initialListSize={1}
        renderSectionHeader={this.renderStationHeader}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        refreshControl={
          <RefreshControl
            style={styles.container}
            refreshing={this.state.isRefreshing}
            onRefresh={this.onRefreshData.bind(this)}
            colors={['#69F0AE', '#00E676', '#00C853']}
            progressBackgroundColor={'#388E3C'} />
        }
      />
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
    this.getData(this.state.cafe, this.state.date).done();
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

  onToolbarActionSelected(position) {
    switch(position) {
      case 0:
        this.openDatePicker();
        break;
      case 1:
        this.openCafePicker();
        break;
    }
  }

  openCafePicker() {
    const cafePickerOptions = {
      title: 'Change cafe',
      items: CafeManager.getCafeList(),
      itemsCallbackSingleChoice: function(index, cafe) {
        this.setState({
          cafe: cafe
        });
        this.getData(cafe, this.state.date);
      }.bind(this)
    };

    let cafePicker = new DialogAndroid();
    cafePicker.set(cafePickerOptions);
    cafePicker.show();
  }

  async openDatePicker() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        const selectedDate = new Date();
        selectedDate.setFullYear(year, month, day);
        this.getData(this.state.cafe, selectedDate);
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  async getData(cafe, date) {
    this.setState({isRefreshing: true});
    const cafeId = CafeManager.getCafeIdFromName(cafe);
    const menuApi = MenuDataProvider.getMenuApi(cafeId, date);

    try {
      let response = await fetch(menuApi);
      let data = await response.json();
      const dayData = data.days[0].cafes[cafeId].dayparts[0];
      console.log(cafe);
      console.log(cafeId);
      console.log(data);

      if (!dayData.length) {
        this.setState({
          error: 'NoMenuData',
          isRefreshing: false
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
    console.log(data);
    console.log(cafeId);
    console.log(tabIndex);
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
    height: Dimension.TOOLBAR_HEIGHT,
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
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorMessage: {
    fontSize: 16,
    marginTop: 30
  },
  cafePicker: {
    position: 'absolute',
    bottom: 0,
    borderTopColor: '#000000',
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
    flex: 1
  }
});

module.exports = MenuComponent;
