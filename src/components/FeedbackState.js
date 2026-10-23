import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';

export default function FeedbackState({ loading, message, onRetry }) {
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color={colors.primary} />}
      <Text style={styles.message}>{message}</Text>
      {onRetry && <Pressable style={styles.button} onPress={onRetry}><Text style={styles.buttonText}>Reintentar</Text></Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  message: { textAlign: 'center', color: colors.textMuted, fontSize: 16, lineHeight: 22 },
  button: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: 12, borderRadius: 10 },
  buttonText: { color: '#FFF', fontWeight: '700' },
});