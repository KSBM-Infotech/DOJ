import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
// import { BarCodeScanner } from "expo-barcode-scanner";
import {Colors, Fonts, Sizes} from '../constants/styles';
import DashedLineBorder from '../components/DashedLineBorder';
import {Svg, Rect, Path, Circle, Line, G} from 'react-native-svg';
import 'react-native-reanimated';
import {
  Camera,
  useCameraDevices,
} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import Loader from '../components/Loader';

const {width, height} = Dimensions.get('screen');

const Scanner = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(null);
  const [device, setDevice] = useState(null);
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });
  const devices = useCameraDevices();

  barcodes.map(barcode=>{
    if(scanned == null){
      setScanned(barcode.displayValue)
    }

  })

  useEffect(() => {
    const startCamera = async () => {
      try {
        const newCameraPermission = await Camera.requestCameraPermission();
        console.log(newCameraPermission);
        if (newCameraPermission == 'authorized') {
          setDevice(devices.back);
          setHasPermission(true);
        }
      } catch (err) {
        console.log('Error starting camera: ', err);
      }
    };
    startCamera();
  }, [hasPermission, device, scanned]);

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera.</Text>;
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} />
      {hasPermission && device && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
      )}
      <View
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <View
        style={{
          flex: 0.33,
          backgroundColor: '#00000080',
        }}
      />
      <View style={{flex: 0.33, flexDirection: 'row'}}>
        <View style={{flex: 0.2, backgroundColor: '#00000080'}} />
        <View style={styles.squareContainer}>
          <View style={styles.overlay}>
            <View style={styles.scanArea}></View>
          </View>
        </View>
        <View style={{flex: 0.2, backgroundColor: '#00000080'}} />
      </View>

      <View
        style={{
          flex: 0.33,
          backgroundColor: '#00000080',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {scanned && <Text style={{...Fonts.whiteColor18Bold}}>Order Id: {scanned}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  squareContainer: {
    position: 'relative',
    flex: 0.8,
    // width: '80%',
    // aspectRatio: 1,
    overflow: 'hidden',
  },
  overlay: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: Colors.whiteColor,
    // borderRadius: 15,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  button: {
    marginTop: 20,
  },
});

export default Scanner;
