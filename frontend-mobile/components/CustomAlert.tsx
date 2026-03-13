import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'tamagui';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AlertConfig, AlertButton } from '@/contexts/AlertContext';

type Props = {
  visible: boolean;
  config: AlertConfig;
  onDismiss: () => void;
};

export function CustomAlert({ visible, config, onDismiss }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const [inputValue, setInputValue] = useState('');

  const buttons: AlertButton[] = config.buttons ?? [{ text: 'OK', style: 'default' }];

  function handleButtonPress(btn: AlertButton) {
    if (config.input && btn.style !== 'cancel') {
      config.input.onSubmit(inputValue);
    }
    onDismiss();
    setInputValue('');
    btn.onPress?.();
  }

  function handleDismiss() {
    onDismiss();
    setInputValue('');
  }

  function getButtonColor(style?: AlertButton['style']): string {
    if (style === 'destructive') return colors.error;
    if (style === 'cancel') return colors.textSecondary;
    return colors.primary;
  }

  const hasTwoButtons = buttons.length === 2;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleDismiss}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* Title */}
          <Text
            fontSize={17}
            fontWeight="600"
            color={colors.text}
            fontFamily="$body"
            textAlign="center"
            paddingBottom={config.message || config.input ? 6 : 0}
          >
            {config.title}
          </Text>

          {/* Message */}
          {config.message && (
            <Text
              fontSize={15}
              color={colors.textSecondary}
              fontFamily="$body"
              textAlign="center"
              lineHeight={21}
            >
              {config.message}
            </Text>
          )}

          {/* Text Input */}
          {config.input && (
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder={config.input.placeholder}
              placeholderTextColor={colors.textTertiary}
              secureTextEntry={config.input.secureTextEntry}
              value={inputValue}
              onChangeText={setInputValue}
              autoFocus
            />
          )}

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Buttons */}
          <View style={[styles.buttonsRow, hasTwoButtons && styles.buttonsRowSplit]}>
            {buttons.map((btn, i) => (
              <React.Fragment key={i}>
                {hasTwoButtons && i === 1 && (
                  <View style={[styles.buttonDivider, { backgroundColor: colors.border }]} />
                )}
                <TouchableOpacity
                  style={[
                    styles.button,
                    hasTwoButtons && styles.buttonHalf,
                  ]}
                  onPress={() => handleButtonPress(btn)}
                  activeOpacity={0.6}
                >
                  <Text
                    fontSize={17}
                    fontWeight={btn.style === 'cancel' ? '400' : '600'}
                    color={getButtonColor(btn.style)}
                    fontFamily="$body"
                    textAlign="center"
                  >
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  card: {
    width: '100%',
    borderRadius: 14,
    paddingTop: 20,
    overflow: 'hidden',
    gap: 8,
    paddingHorizontal: 20,
  },
  input: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: 'DMSans_400Regular',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: -20,
    marginTop: 12,
  },
  buttonsRow: {
    flexDirection: 'column',
  },
  buttonsRowSplit: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonHalf: {
    flex: 1,
  },
  buttonDivider: {
    width: StyleSheet.hairlineWidth,
  },
});
