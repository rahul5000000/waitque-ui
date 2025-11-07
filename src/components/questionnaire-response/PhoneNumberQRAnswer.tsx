import React from "react";
import TextQRAnswer from "./TextQRAnswer";

export default function PhoneNumberQRAnswer({children, value}) {
  return (
    <TextQRAnswer value={value}>{children}</TextQRAnswer>
  )
}