import React from 'react';
import { View, useWindowDimensions, StyleProp, ViewStyle } from 'react-native';

/** Screens are phone-first. On iPad/Mac (wide) we center content in a
 * comfortable measure instead of letting it stretch edge-to-edge. */
export const WIDE_BREAKPOINT = 768;

export function useWide(breakpoint: number = WIDE_BREAKPOINT): boolean {
  const { width } = useWindowDimensions();
  return width >= breakpoint;
}

/**
 * Centers its children with a max width on wide screens; a plain full-width
 * pass-through on phones. Use inside a screen's scroll content.
 */
export default function Bounded({
  max = 820,
  children,
  style,
}: {
  max?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const wide = useWide();
  return (
    <View style={[{ width: '100%', alignSelf: 'center', maxWidth: wide ? max : undefined }, style]}>
      {children}
    </View>
  );
}
