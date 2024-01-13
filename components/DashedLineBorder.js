import React from 'react';
import { View } from 'react-native';
import { Svg, Rect } from 'react-native-svg';

export default function DashedLineBorder({ width, height, dashSize, gapSize, color }) {
  const numDashes = Math.floor(width / (dashSize + gapSize));
  const remainder = width % (dashSize + gapSize);
  const startOffset = remainder / 2;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        {Array.from({ length: numDashes }, (_, index) => (
          <Rect
            key={index}
            x={startOffset + index * (dashSize + gapSize)}
            y={0}
            width={dashSize}
            height={height}
            fill={color}
          />
        ))}
      </Svg>
    </View>
  );
}
