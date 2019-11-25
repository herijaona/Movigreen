import React from "react";
import { Header } from "react-native-elements";

import HamburgerMenu from "./HamburgerMenu";
import HeaderImage from './HaederImg';

const NyaHeader = props => {
  return (
    <Header
      backgroundColor='#36c244'
      leftComponent={<HamburgerMenu navigation={props.navigation} />}
      // centerComponent={{
      //   text: props.title,
      //   style: { color: "#fff", fontWeight: "bold" }
      // }}
      centerComponent={<HeaderImage />}
      statusBarProps={{ barStyle: "light-content" }}
    />
  );
 
};

export default NyaHeader;