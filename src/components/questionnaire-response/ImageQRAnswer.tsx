import React from "react";
import { Image, View } from "react-native";
import QRAnswerTitle from "./QRAnswerTitle";

export default function ImageQRAnswer({children, url, cdnBaseUrl}) {
  return (
    <View className="flex">
      <QRAnswerTitle>{children}</QRAnswerTitle>
      <Image source={{ uri: cdnBaseUrl + "/" + url }} className="h-48 rounded-xl" />
    </View>
  )
}