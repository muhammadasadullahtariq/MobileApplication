package com.eatt.customer;

import android.app.Application;

import com.crashlytics.android.answers.Answers;
import com.facebook.react.ReactApplication;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.reactnativecommunity.toolbarandroid.ReactToolbarPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.reactnativecommunity.picker.RNCPickerPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.henninghall.date_picker.DatePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnfs.RNFSPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import io.fabric.sdk.android.Fabric;
import io.invertase.firebase.RNFirebasePackage;
import com.gettipsi.stripe.StripeReactPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage; 

import com.airbnb.android.react.maps.MapsPackage;

import com.github.reactnativecommunity.location.RNLocationPackage;
 import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;

import java.util.Arrays;
import java.util.List;

import org.pgsqlite.SQLitePluginPackage;


public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SplashScreenReactPackage(),
            new ReactToolbarPackage(),
            new RNScreensPackage(),
            new RNCPickerPackage(),
            new ReactNativeRestartPackage(),
            new DatePickerPackage(),
            new RNFetchBlobPackage(),
            new RNFSPackage(),
            new ImageResizerPackage(),
            new ImagePickerPackage(),
            new RNAndroidLocationEnablerPackage(),
            new RNFirebasePackage(),
            new StripeReactPackage(),

            new MapsPackage(),

            new RNLocationPackage(),

            new SQLitePluginPackage(),  
            new RNCWebViewPackage(),
            new SnackbarPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new RNFirebaseCrashlyticsPackage(),
            new ReactNativeLocalizationPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Answers());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
