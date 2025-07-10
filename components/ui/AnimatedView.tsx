import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

interface AnimatedViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
  duration?: number;
  type?: 'fade' | 'slide' | 'scale';
}

export function AnimatedView({
  children,
  style,
  delay = 0,
  duration = 300,
  type = 'fade',
}: AnimatedViewProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    if (type === 'fade') {
      opacity.value = withDelay(delay, withSpring(1, { duration }));
    } else if (type === 'slide') {
      opacity.value = withDelay(delay, withSpring(1, { duration }));
      translateY.value = withDelay(delay, withSpring(0, { duration }));
    } else if (type === 'scale') {
      opacity.value = withDelay(delay, withSpring(1, { duration }));
      scale.value = withDelay(delay, withSpring(1, { duration }));
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

export function FadeInView({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}