import React, { useEffect } from 'react';
import { Animated, GestureResponderEvent } from 'react-native';
import styled, { css } from 'styled-components/native';

import {
  IAccessibility,
  IBubbleTabConfig,
  TIconRenderer,
  TBubbleTabBarIcon,
} from './types';

interface IBubbleTabParent extends
  Omit<IBubbleTabConfig, 'name' | 'activeIcon'>, IAccessibility {}

export interface IBubbleTab extends IBubbleTabParent {
  iconRenderer: TIconRenderer,
  activeTabSize: number;
  disabledTabSize: number;
  tabName: string;
  icon: TBubbleTabBarIcon;
  isActive: boolean;
  testID?: string;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
}

const BubbleTab: React.FC<IBubbleTab> = ({
  iconRenderer,
  activeTabSize,
  disabledTabSize,
  tabName,
  icon,
  activeColor,
  inactiveColor = '#e0e0e0',
  activeBackgroundColor,
  isActive,
  onPress,
  onLongPress,
  accessibilityRole,
  accessibilityLabel,
  accessibilityStates = [],
  testID,
}) => {
  const tabWidth = new Animated.Value(isActive ? activeTabSize : disabledTabSize);
  const labelOpacity = new Animated.Value(isActive ? 1 : 0);
  const labelWidth = new Animated.Value(isActive ? 50 : 0);

  const onTabOpen = () => {
    Animated
      .parallel([
        Animated.timing(tabWidth, {
          toValue: activeTabSize,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(labelWidth, {
          toValue: 50,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(labelOpacity, {
          toValue: 1,
          duration: 150,
          delay: 150,
          useNativeDriver: true,
        }),
      ])
      .start();
  };

  const onTabHide = () => {
    Animated
      .parallel([
        Animated.timing(tabWidth, {
          toValue: 75,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(labelWidth, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(labelOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
      .start();
  };

  useEffect(
    () => {
      if (!isActive) {
        onTabHide();
      } else {
        onTabOpen();
      }
    },
    [isActive],
  );

  const color = isActive ? activeColor : inactiveColor;
  const backgroundColor = isActive ? activeBackgroundColor : 'transparent';
  const renderedIcon = iconRenderer({ icon, color });

  return (
    <TouchableBubbleTabContainer
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole={accessibilityRole}
      accessibilityStates={accessibilityStates}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <AnimatedBubbleTabWrapper
        backgroundColor={backgroundColor}
        style={{ width: tabWidth }}
      >
        {renderedIcon}
        {isActive && (
          <BubbleTabLabel
            numberOfLines={1}
            color={color}
            style={{ opacity: labelOpacity }}
          >
            {tabName}
          </BubbleTabLabel>
        )}
      </AnimatedBubbleTabWrapper>
    </TouchableBubbleTabContainer>
  );
};

export default BubbleTab;

const TouchableBubbleTabContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

interface IAnimatedBubbleTabWrapper {
  backgroundColor: string;
}

const AnimatedBubbleTabWrapper = styled(Animated.View)<IAnimatedBubbleTabWrapper>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 18px;
  border-radius: 20px;

  ${({ backgroundColor }) => backgroundColor && css`
    background-color: ${backgroundColor};
  `};
`;

interface IBubbleTabLabel {
  color: string;
}

const BubbleTabLabel = styled(Animated.Text)<IBubbleTabLabel>`
  margin-left: 10px;
  font-size: 14.5px;
  width: auto;
  height: auto;
  font-weight: bold;

  ${({ color }) => color && css`
    color: ${color};
  `};
`;
