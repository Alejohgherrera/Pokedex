import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/colors';

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export default function PokemonCard({ pokemon, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button">
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.number}>#{String(pokemon.id).padStart(3, '0')}</Text>
        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, margin: spacing.xs, backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#101828', shadowOpacity: 0.08, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  image: { width: '100%', height: 132, resizeMode: 'contain', backgroundColor: '#F1F4F9' },
  info: { padding: spacing.sm },
  number: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  name: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 2 },
});
