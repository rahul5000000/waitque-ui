import React from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRCodeRender({children, size = 200}) {
  return (
    <View>
      <QRCode
        value={children}
        size={size}
        color="black"
        backgroundColor="white"
      />
    </View>
  );
}
