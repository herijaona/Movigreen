import React, { Component } from 'react';
import {
    createDrawerNavigator,
    createAppContainer,
    StackActions, NavigationActions
} from 'react-navigation';
import Home from '../Screens/Acceuil';
import Reservez from '../Screens/Reservez';
import Bilan from '../Screens/Bilan';
import Trajets from '../Screens/Trajets';
import Parametre from '../Screens/Parametre';
import Aide from '../Screens/Aide';
import CustomDrawer from '../Components/CustomDrawer';
import {
    COLOR_GREEN,COLOR_WHITE,COLOR_BLACK
} from '../Helpers/Helper';

const DrawerNavigation = createDrawerNavigator(
    {
        Accueil:{
            screen:Home,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: 'Accueil',
            }),
        },
        Reservez:{
            
            screen:Reservez,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: 'Réservez',
            }),
        },
        Trajets:{
            
            screen:Trajets,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: 'Vos trajets',
            }),
        },
        Bilan:{ 
            
            screen:Bilan,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: 'Votre bilan carbone',
            }),
        },
        Aide:{
            
            screen:Aide,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: 'Aide',
            }),
        },
        Parametre:{
            
            screen:Parametre,
            navigationOptions: ({ navigation }) => ({
                drawerLabel: 'Paramètres',
            }),
        },
        

    },
    {
        drawerType:'slide',
        contentComponent:CustomDrawer,
        drawerBackgroundColor:COLOR_GREEN,
    }
);




export default createAppContainer(DrawerNavigation);