import {createStackNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';
import AuthScreen from '../screens/auth_screen';
import DashboardScreen from '../screens/dashboard_screen';
import ComplaintScreen from '../screens/complaint_screen';
import SearcheeScreen from '../screens/searchee_screen';


const AppNavigator = createStackNavigator({
    Dashboard: {
        screen: DashboardScreen,
        navigationOptions: {
            title: 'Dashboard'
        }
    },
    Complaint: ComplaintScreen,
    Searchee: SearcheeScreen

});

const RootNavigator = createSwitchNavigator({
    Auth: AuthScreen,
    App: AppNavigator
});

export default createAppContainer(RootNavigator);