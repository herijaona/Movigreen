import {Platform} from 'react-native';

export const COLOR_GREEN = '#36c244';
export const COLOR_WHITE = '#FFFFFF';
export const COLOR_BLACK = '#000000';
export const COLOR_RED = '#FF0000';
export const COLOR_GRIS = '#525252';
export const FONT_BOLD = Platform.OS ==='ios'? "Georgia" : "georgia bold";
export const FONT_REGULAR = "Georgia";
export const BASE_URL = "http://neitic.com/moovingreen/?api&action=";
export const DIRECTION_URL = "https://maps.googleapis.com/maps/api/directions/json?";
export const API_KEY = "AIzaSyDFu-A8m91udoLDgFwv8mt2wSuLjemxepY";
export const STRIPE_KEY ="sk_test_IJbLD8Fm9oCCKDyFfHgigQA000SrgCD5hC";
export const PRIX_KM = 1.90 //en euro
export const TAUX_C02 = 82 //g par 100km
export const URL_FORGOT ="http://neitic.com/moovingreen/?api&action=recovery";
// origin=37.3317876,-122.0054812&destination=37.771707,-122.4053769&key=