import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
  withDelay
} from "react-native-reanimated";


export default function LoadingOverlay({ isLoaded }) {
  const opacity = useSharedValue(1);            // full opacity to start
  const scale = useSharedValue(1);              // blob breathing effect
  const borderRadius = useSharedValue(80);      // organic morph
  const [render, setRender] = React.useState(true);

  // Fade-out when loaded
  useEffect(() => {
    if (isLoaded) {
      opacity.value = withDelay(1000, withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.ease),
      }, () => {
        // After fade-out, stop rendering the overlay
        runOnJS(setRender)(false);
      }));
    }
  }, [isLoaded]);

  // Organic blob pulsing
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.9, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    borderRadius.value = withRepeat(
      withSequence(
        withTiming(180, { duration: 1500, easing: Easing.ease }),
        withTiming(50, { duration: 1500, easing: Easing.ease })
      ),
      -1,
      true
    );
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const blobStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderRadius: borderRadius.value,
  }));

  return (
    <>
    {!render ? null :
      <>
        <Animated.View style={[styles.overlay, overlayStyle]}>
        <Animated.View style={[styles.blob, blobStyle]}>
          <Text className="text-center font-bold text-3xl">Hi!</Text>
        </Animated.View>
      </Animated.View>  
      </>
    }
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  blob: {
    width: '80%',
    aspectRatio: 1,
    backgroundColor: "#f9f9f9",
    borderColor: "#bbbbbb",
    borderWidth: 20,
    shadowColor: "#aaaaaa",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
