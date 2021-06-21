import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { WebView } from "react-native-webview";
//import KeyboardSpacer from 'react-native-keyboard-spacer';
import myHtml from "./myhtml.html";

export default class PayToday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      sent: false,
    };
    this.webView = null;
    const patchPostMessageFunction = function () {
      var originalPostMessage = window.postMessage;

      var patchedPostMessage = function (message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
      };

      patchedPostMessage.toString = function () {
        return String(Object.hasOwnProperty).replace(
          "hasOwnProperty",
          "postMessage"
        );
      };

      window.postMessage = patchedPostMessage;
    };

    this.patchPostMessageJsCode =
      "(" + String(patchPostMessageFunction) + ")();";
  }

  componentWillMount() {
    this.setState({ loading: true });
  }

  handleNavigation(event) {
    const { onSuccess } = this.props;
    if (onSuccess) onSuccess(event);
  }
  handleMessage = (event) => {
    let data = event.nativeEvent.data;
    data = JSON.parse(data);
    if (data.status == "success") {
      alert(data.reference);
    } else {
      this.setState({ loading: false });
      alert("Failed, " + data.message);
    }
  };
  passValues() {
    const {
      Amount,
      Business_ID,
      Business_Name,
      Thank_you_URL,
      Reference_Number,
    } = this.props;

    let data = {
      Amount,
      Business_ID,
      Business_Name,
      Thank_you_URL,
      Reference_Number,
    };
    console.log("PAYTODAY STATE", this.state);
    console.log("PAYTODAY Data", data);

    if (!this.state.sent) {
      this.webView.postMessage(JSON.stringify(data));
      //this.setState({loading: false, sent: true});
      this.state.loading = false;
      this.state.sent = true;
      console.log("PAYTODAY STATE1", this.state);
    }
  }
  render() {
    //const { source} = this.props;
    const localFile =
      Platform.OS === "ios"
        ? require("./myhtml.html")
        : { uri: "file:///android_asset/myhtml.html" };
    return (
      <ScrollView keyboardShouldPersistTaps="always" style={{ flex: 1 }}>
        {
          // this.state.loading?<Text>Loading ....</Text> :
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "position"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 15 : -200}
          >
            <WebView
              style={{
                overflow: "scroll",
                height: Dimensions.get("window").height + 15,
                width: Dimensions.get("window").width,
              }}
              source={localFile}
              startInLoadingState={true}
              // injectedJavaScriptBeforeContentLoaded={'<script src="https://paytoday.com.na/js/pay-with-paytoday.js"></script>'}
              scalesPageToFit={true}
              originWhitelist={["*"]}
              mixedContentMode={"always"}
              useWebKit={Platform.OS == "ios"}
              onError={() => {
                alert("Error Occured");
                Actions.pop();
              }}
              onLoadEnd={() => this.passValues()}
              ref={(webView) => (this.webView = webView)}
              thirdPartyCookiesEnabled={true}
              scrollEnabled={true}
              domStorageEnabled={true}
              injectedJavaScript={this.patchPostMessageJsCode}
              allowUniversalAccessFromFileURLs={true}
              onMessage={(event) => this.handleMessage(event)}
              onNavigationStateChange={(event) => this.handleNavigation(event)}
              javaScriptEnabled={true}
            />
          </KeyboardAvoidingView>
        }
      </ScrollView>
    );
  }
}
