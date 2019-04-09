import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import AuthScreen from '../screens/auth_screen';
import DashboardScreen from '../screens/dashboard_screen';
import ComplaintScreen from '../screens/complaint_screen';
import SearcheeScreen from '../screens/searchee_screen';
import NewSearcheeScreen from '../screens/new_searchees_screen';
import NewComplaintScreen from '../screens/new_complaint_screen';
import SearcheeSamplesScreen from '../screens/searchee_sample_screen';
import NewSearchScreen from '../screens/new_search_screen';
import SearchResultListScreen from '../screens/search_result_list_screen';
import SearchResultScreen from '../screens/search_result_screen';


const AppNavigator = createStackNavigator({
    Dashboard: {
        screen: DashboardScreen,
        navigationOptions: {
            title: 'Welcome'
        }
    },
    Complaint: ComplaintScreen,
    Searchee: SearcheeScreen,
    NewComplaint: NewComplaintScreen,
    NewSearchee: NewSearcheeScreen,
    SearcheeSamples: SearcheeSamplesScreen,
    NewSearch: NewSearchScreen,
    SearchResultList: SearchResultListScreen,
    SearchResult: SearchResultScreen
});

const RootNavigator = createSwitchNavigator({
    Auth: AuthScreen,
    App: AppNavigator
});

export default createAppContainer(RootNavigator);