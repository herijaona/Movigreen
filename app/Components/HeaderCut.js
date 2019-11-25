import React from "react";
import {
  Text
} from 'react-native';
import { Header } from "react-native-elements";

import HamburgerMenu from "./HamburgerMenu";
import HeaderImage from './HaederImg';

const HeaderCut = props => {
  return (
    <Header
      backgroundColor='#36c244'
      leftComponent={<HamburgerMenu navigation={props.navigation} />}
      // leftComponent={<Text on>haha</Text>}
      // centerComponent={{
      //   text: props.title,
      //   style: { color: "#fff", fontWeight: "bold" }
      // }}
      centerComponent={<HeaderImage />}
      statusBarProps={{ barStyle: "light-content" }}
    />
  );
 
};

export default HeaderCut;