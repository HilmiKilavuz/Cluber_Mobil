// components/ui/Input.tsx
// Form input bileşeni — label, error, focus animasyonu

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
  Animated,
} from 'react-native';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Radius } from '@/constants/Tokens';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
}

export function Input({
  label,
  error,
  hint,
  containerStyle,
  secureTextEntry,
  ...rest
}: InputProps) {
  const c = useColors();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  const borderColor = error ? c.error : isFocused ? c.accent : c.border;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[Typography.label, { color: c.inkSecondary, marginBottom: 6 }]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            borderWidth: isFocused ? 1.5 : 1,
            backgroundColor: c.surface,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: c.ink,
              fontFamily: 'DM-Sans-Regular',
              fontSize: 15,
            },
          ]}
          placeholderTextColor={c.inkTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          {...rest}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setIsSecureVisible((v) => !v)}
            style={styles.eyeButton}
            accessibilityLabel={isSecureVisible ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            <Ionicons
              name={isSecureVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={c.inkSecondary}
            />
          </Pressable>
        )}
      </View>

      {error && (
        <Text style={[Typography.caption, { color: c.error, marginTop: 4 }]}>
          {error}
        </Text>
      )}
      {hint && !error && (
        <Text style={[Typography.caption, { color: c.inkTertiary, marginTop: 4 }]}>
          {hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputWrapper: {
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  eyeButton: {
    padding: 12,
  },
});
