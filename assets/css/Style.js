"use strict";

import * as colors from "./Colors";

var React = require("react-native");

var { StyleSheet } = React;

module.exports = StyleSheet.create({
  splash_appname: {
    color: colors.theme_fg,
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 35,
    marginTop: 20,
  },
  splash_subtext: {
    color: colors.sp_subtext_fg,
    fontSize: 20,
  },
  login_signin: {
    alignSelf: "center",
    color: colors.theme_fg,
  },
  login_icon: {
    marginTop: "5%",
    width: 100,
    height: 100,
  },
  content: {
    backgroundColor: colors.bg_one,
  },
  dash_block_one: {
    backgroundColor: colors.bg_two,
    elevation: 5,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 1.8,
    shadowColor: colors.shadow,
  },
  dash_avatar: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
  },
  dash_profile_name: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
    color: colors.theme_fg,
  },
  dash_earnings: {
    fontWeight: "bold",
    fontSize: 35,
    color: colors.theme_fg,
  },
  dash_icon: {
    margin: 5,
    color: colors.theme_fg,
    fontSize: 60,
  },
  dash_rides: {
    fontWeight: "bold",
    fontSize: 25,
    color: colors.theme_fg,
  },
  dash_total_rides: {
    fontSize: 15,
    margin: 5,
  },
  full_width_and_height: {
    width: "100%",
    height: "100%",
  },
  transparent_background: {
    backgroundColor: "transparent",
  },
  input: {
    height: 40,
    width: 250,
    borderColor: colors.input_border,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  margin_top_30: {
    marginTop: 30,
  },
  margin_top_10: {
    marginTop: 10,
  },
  margin_top_20: {
    marginTop: 20,
  },
  margin_bottom_10: {
    marginBottom: 10,
  },
  margin_bottom_20: {
    marginBottom: 20,
  },
  margin_top_15_percent: {
    marginTop: "15%",
  },
  input_margin_top: {
    marginTop: 20,
  },
  width_70_percent: {
    width: "70%",
  },
  font_size_15: {
    fontSize: 15,
  },
  login_forgot: {
    color: colors.theme_fg,
    fontSize: 14,
    textAlign: "right",
    marginTop: 15,
    textDecorationLine: "underline",
    justifyContent: "flex-end",
  },
  login_register_clickhere: {
    color: colors.theme_fg,
    fontSize: 16,
  },
  divider: {
    backgroundColor: colors.divider,
    fontWeight: "bold",
  },
  theme_header: {
    backgroundColor: colors.theme_bg,
  },
  header_icon: {
    color: colors.theme_button_fg,
  },
  header_left: {
    flex: 1,
    color: colors.theme_button_fg,
  },
  header_body: {
    flex: 3,
    justifyContent: "center",
  },
  header_title: {
    alignSelf: "center",
    color: colors.theme_button_fg,
  },
});
