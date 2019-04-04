import {createStackNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';
import AuthScreen from '../screens/auth_screen';
import DashboardScreen from '../screens/dashboard_screen';
import ComplaintScreen from '../screens/complaint_screen';
import SearcheeScreen from '../screens/searchee_screen';
import FlowScreen from '../screens/flow_screen';
import NewSearcheeScreen from '../screens/new_searchees_screen';
import NewSearcheeSamplesScreen from '../screens/new_searchee_sample_screen';
 

const AppNavigator = createStackNavigator({
    Dashboard: {
        screen: DashboardScreen,
        navigationOptions: {
            title: 'Dashboard'
        }
    },
    Complaint: ComplaintScreen,
    Flow: FlowScreen,
    Searchee: SearcheeScreen,
    NewSearchee: NewSearcheeScreen,
    NewSearcheeSamples: NewSearcheeSamplesScreen

});

const RootNavigator = createSwitchNavigator({
    Auth: AuthScreen,
    App: AppNavigator
});

export default createAppContainer(RootNavigator);