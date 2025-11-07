import React from "react";
import TextQRAnswer from "./TextQRAnswer";

export default function BooleanQRAnswer({children, enabled, falseText = 'No', trueText = 'Yes'}) {
  return (
    <TextQRAnswer value={enabled ? trueText : falseText}>{children}</TextQRAnswer>
  )
}