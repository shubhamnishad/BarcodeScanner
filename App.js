import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  DeviceEventEmitter,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import BarcodeScanner from 'react-native-scan-barcode';

const App = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState('');

  useEffect(() => {
    DeviceEventEmitter.addListener('barcode_scan', scanHandler);
    return () => {
      DeviceEventEmitter.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      setShowScanner(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const scanBarcode = e => {
    console.log('E', e);
    if (e) {
      setBarcodeValue(e);
      setShowScanner(false);
    }
  };

  const scanHandler = deviceEvent => {
    if (deviceEvent.data) {
      console.log('deviceEvent.data', deviceEvent.data);
      setBarcodeValue(deviceEvent.data);
      setShowScanner(false);
    } else {
      appState.setAlert(
        'Code could not be scanned. Please try again.',
        'danger',
        5000,
      );
    }
  };

  const checkCameraAndOpen = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Doodleblue Camera Permission',
          message:
            'Doodleblue needs access to your camera ' +
            'so you can scan barcodes.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('granted');
        setShowScanner(true);
      } else {
        setShowScanner(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <>
      {showScanner ? (
        <BarcodeScanner
          onBarCodeRead={scanBarcode}
          style={{flex: 1}}
          torchMode={'off'}
          cameraType={'back'}
        />
      ) : (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => checkCameraAndOpen()}>
            <Text style={styles.buttonLabel}>Open Scanner</Text>
          </TouchableOpacity>
          <Text style={styles.barcodeStyle}>Barcode Value:{barcodeValue}</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'grey',
    width: 120,
    height: 50,
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  barcodeStyle: {
    marginTop: 10,
  },
});

export default App;
