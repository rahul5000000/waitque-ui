import React, { useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet, Animated, Easing } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import Toast from 'react-native-toast-message';

export default function QRScanner({onScan}) {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const [scanned, setScanned] = React.useState(false);

  // Laser animation value
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission();
  }, [permission]);

  useEffect(() => {
    if (isFocused) startLaserAnimation();
  }, [isFocused]);

  const startLaserAnimation = () => {
    laserAnim.setValue(0);

    Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1600,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleScan = ({ data }) => {
    if (!scanned) {
      if(data && data.includes("waitque")) {
        const url = new URL(data);                         // parse full URL
        const customerCode = url.searchParams.get("customerCode"); 
        const companyId = url.searchParams.get("company"); 

        if (!customerCode) {
          Toast.show({
            type: "error",
            text1: "QR code missing customerCode",
          });
          return;
        }

        setScanned(true);
        onScan(customerCode);
      } else {
        Toast.show({
          type: 'info',
          text1: "QR code not recognized",
        });
      }
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permission_container}>
        <Text className="mb-2">Camera access is needed to scan QR codes:</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && !scanned && (
        <>
          <View style={styles.cameraWrapper}>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={handleScan}
            />

            {/* Overlay Frame */}
            <View style={styles.overlay}>
              {/* Moving Laser */}
              <Animated.View
                style={[
                  styles.laser,
                  {
                    transform: [
                      {
                        translateY: laserAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 250], // moves down entire square
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const FRAME_SIZE = 260;

const styles = StyleSheet.create({
  permission_container: {
    backgroundColor: "#dddddd",
    borderRadius: 8,
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 16,
  },

  /** CAMERA SQUARE **/
  cameraWrapper: {
    alignSelf: "center",
    width: FRAME_SIZE,
    height: FRAME_SIZE,
  },
  camera: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },

  /** OVERLAY FRAME **/
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderWidth: 20,
    borderColor: "rgba(128,128,128,0.3)",
    borderRadius: 8,
    overflow: "hidden",
  },

  /** Laser **/
  laser: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: 2,
    backgroundColor: "#58c7bc",
    opacity: 0.6,
  },
});
