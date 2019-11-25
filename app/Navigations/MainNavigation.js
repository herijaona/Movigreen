import React, { PureComponent } from 'react';
import {
    createStackNavigator,
    createAppContainer,
    StackActions, NavigationActions
} from 'react-navigation';

import Splash from '../Screens/Splash';
import Login from '../Screens/Connexion';
import Singup from '../Screens/Inscription';
import Detail from '../Screens/Detail';
import Paiement from '../Screens/Payement';
import Confirmation from '../Screens/Confirmation';
import Home from '../Screens/Acceuil';
import Contacts from '../Screens/Contacts';
import Apropos from '../Screens/Apropos';
import Faq from '../Screens/Faq';
import Modifier from '../Screens/Modifier';
import DrawerNavigation from './DrawerNavigation';
import { fromLeft, fromRight, zoomIn,fadeIn } from 'react-navigation-transitions';

const handleCustomTransition = ({ scenes }) => {
    const prevScene = scenes[scenes.length - 2];
    const nextScene = scenes[scenes.length - 1];
  
    if (prevScene
      && prevScene.route.routeName === 'Splash'
      && nextScene.route.routeName === 'Auth') {
      return zoomIn();
    } else if (prevScene
      && prevScene.route.routeName === 'Login'
      && nextScene.route.routeName === 'Singup') {
      return fromRight();
    }
    return fadeIn();
  }
  
const AuthStack = createStackNavigator(
  {
    Login : Login,
    Singup : Singup,

  }
);
const MainNavigation = createStackNavigator(
    {
        Splash : Splash,
        Auth : {
          screen:AuthStack,
          navigationOptions:{
            header:null
          }
        },
        App : {
          screen:DrawerNavigation,
          navigationOptions:{
            header:null
          }
        },
        Detail : Detail,
        Paiement : Paiement,
        Confirmation : Confirmation,
        Accueil : Home,
        Contacts: Contacts,
        Apropos: Apropos,
        Faq: Faq,
        Modifier: Modifier
    },
    {
        //initialRouteName: 'Modifier',
        transitionConfig: (nav) => handleCustomTransition(nav),
    }
);



export default createAppContainer(MainNavigation);