import { getContrastingTextColor, brightenHex, isBright } from "../utils/colorUtils";
import { useAppContext } from "./AppContext";

export function useCompanyTheme() {
  const {company} = useAppContext();
  
  const fallback = {
    backgroundColor: '#eeeeee',
    textColor: '#000000',
    primaryButtonColor: '#2563eb',
    secondaryButtonColor: '#e5e7eb',
    warningButtonColor: '#dd6b20',
    dangerButtonColor: '#e53e3e'
  };

  const theme = {
    backgroundColor: company?.backgroundColor || fallback.backgroundColor,
    textColor: company?.textColor || fallback.textColor,
    primaryButtonColor: company?.primaryButtonColor || fallback.primaryButtonColor,
    secondaryButtonColor: company?.secondaryButtonColor || fallback.secondaryButtonColor,
    warningButtonColor: company?.warningButtonColor || fallback.warningButtonColor,
    dangerButtonColor: company?.dangerButtonColor || fallback.dangerButtonColor,
  };

  const borderColorFactor = 0.75;
  const primaryButtonTextColor = getContrastingTextColor(theme.primaryButtonColor);
  const primaryButtonBorderColor = brightenHex(theme.primaryButtonColor, borderColorFactor);
  const secondaryButtonTextColor = getContrastingTextColor(theme.secondaryButtonColor);
  const secondaryButtonBorderColor = brightenHex(theme.secondaryButtonColor, borderColorFactor);
  const warningButtonTextColor = getContrastingTextColor(theme.warningButtonColor);
  const warningButtonBorderColor = brightenHex(theme.warningButtonColor, borderColorFactor);
  const dangerButtonTextColor = getContrastingTextColor(theme.dangerButtonColor);
  const dangerButtonBorderColor = brightenHex(theme.dangerButtonColor, borderColorFactor);
  const widgetBackgroundColor = brightenHex(theme.primaryButtonColor, 2.8);
  const widgetLighterTextColor = brightenHex(widgetBackgroundColor, 1.5);
  const backgroundColorDarker = brightenHex(theme.backgroundColor, 0.9);
  const darkerTextColor = brightenHex(backgroundColorDarker, 0.7);

  return {
    // Styles you can spread directly into components:
    backgroundStyle: { backgroundColor: theme.backgroundColor },
    textStyle: { color: theme.textColor },
    textInputStyle: { borderColor: backgroundColorDarker, borderWidth: 2, padding: 12, marginBottom: 4, borderRadius: 5, backgroundColor: 'white', color: 'black' },
    primaryButtonStyle: { backgroundColor: theme.primaryButtonColor },
    primaryButtonTextStyle: { color: primaryButtonTextColor },
    secondaryButtonStyle: { backgroundColor: theme.secondaryButtonColor },
    secondaryButtonTextStyle: { color: secondaryButtonTextColor },
    warningButtonStyle: { backgroundColor: theme.warningButtonColor },
    warningButtonTextStyle: { color: warningButtonTextColor },
    dangerButtonStyle: { backgroundColor: theme.dangerButtonColor },
    dangerButtonTextStyle: { color: dangerButtonTextColor },
    widgetBackgroundStyle: { backgroundColor: widgetBackgroundColor, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4  },
    widgetButtonTextStyle: { color: theme.primaryButtonColor },
    widgetButtonLighterTextStyle: { color: widgetLighterTextColor },
    questionnaireWidgetBackgroundStyle: { backgroundColor: theme.primaryButtonColor },
    questionnaireWidgetButtonTextStyle: { color: widgetBackgroundColor },
    cardStyle: {backgroundColor: 'white', borderColor: backgroundColorDarker, borderWidth: 1, borderRadius: 8},
    mutedWidgetBackgroundStyle: { backgroundColor: backgroundColorDarker, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
    mutedWidgetButtonTextStyle: { color: darkerTextColor },
    alertBackgroundStyle: {backgroundColor: backgroundColorDarker},

    // Also expose raw values for flexibility:
    colors: theme,
  };
}
