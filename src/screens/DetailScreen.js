import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeedbackState from '../components/FeedbackState';
import { getPokemonDetail } from '../services/pokeApi';
import { colors, spacing } from '../theme/colors';

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const statLabel = (name) => ({ hp: 'PS', attack: 'Ataque', defense: 'Defensa', 'special-attack': 'Ataque especial', 'special-defense': 'Defensa especial', speed: 'Velocidad' }[name] || name);

export default function DetailScreen({ pokemonId, onBack }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPokemon = useCallback(async (signal) => {
    setLoading(true); setError(null);
    try { setPokemon(await getPokemonDetail(pokemonId, signal)); }
    catch (err) { if (err.name !== 'AbortError') setError('No se pudo cargar la ficha del Pokémon.'); }
    finally { setLoading(false); }
  }, [pokemonId]);

  useEffect(() => {
    const controller = new AbortController();
    loadPokemon(controller.signal);
    return () => controller.abort();
  }, [loadPokemon]);

  if (loading) return <SafeAreaView style={styles.safe}><FeedbackState loading message="Cargando ficha..." /></SafeAreaView>;
  if (error) return <SafeAreaView style={styles.safe}><FeedbackState message={error} onRetry={() => loadPokemon()} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable style={styles.back} onPress={onBack}><Text style={styles.backText}>← Volver a la lista</Text></Pressable>
        <Image source={{ uri: pokemon.image }} style={styles.image} />
        <Text style={styles.number}>#{String(pokemon.id).padStart(3, '0')}</Text>
        <Text style={styles.title}>{capitalize(pokemon.name)}</Text>
        <View style={styles.types}>{pokemon.types.map((type) => <View key={type} style={[styles.badge, { backgroundColor: colors.type[type] || colors.type.unknown }]}><Text style={styles.badgeText}>{capitalize(type)}</Text></View>)}</View>
        <View style={styles.measurements}><View><Text style={styles.measurementValue}>{pokemon.height} m</Text><Text style={styles.measurementLabel}>Altura</Text></View><View><Text style={styles.measurementValue}>{pokemon.weight} kg</Text><Text style={styles.measurementLabel}>Peso</Text></View></View>
        <Text style={styles.section}>Estadísticas base</Text>
        {pokemon.stats.map((stat) => <View key={stat.name} style={styles.statRow}><Text style={styles.statName}>{statLabel(stat.name)}</Text><Text style={styles.statValue}>{stat.value}</Text><View style={styles.track}><View style={[styles.fill, { width: `${Math.min((stat.value / 255) * 100, 100)}%` }]} /></View></View>)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, container: { padding: spacing.md, paddingBottom: spacing.xl }, back: { alignSelf: 'flex-start', paddingVertical: spacing.sm }, backText: { color: colors.primaryDark, fontSize: 16, fontWeight: '700' }, image: { width: '100%', height: 280, resizeMode: 'contain', backgroundColor: '#F1F4F9', borderRadius: 20 }, number: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.md, fontWeight: '700' }, title: { textAlign: 'center', fontSize: 30, color: colors.text, fontWeight: '800', marginTop: 2 }, types: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginVertical: spacing.md }, badge: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 }, badgeText: { color: '#FFF', fontWeight: '700' }, measurements: { flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: colors.card, borderRadius: 14, padding: spacing.md }, measurementValue: { color: colors.text, textAlign: 'center', fontSize: 18, fontWeight: '800' }, measurementLabel: { color: colors.textMuted, textAlign: 'center', marginTop: 2 }, section: { marginTop: spacing.lg, marginBottom: spacing.sm, fontSize: 20, color: colors.text, fontWeight: '800' }, statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 }, statName: { width: 118, color: colors.text, fontSize: 13 }, statValue: { width: 32, color: colors.textMuted, fontWeight: '700', textAlign: 'right', marginRight: spacing.sm }, track: { flex: 1, height: 9, backgroundColor: colors.border, borderRadius: 999, overflow: 'hidden' }, fill: { height: '100%', backgroundColor: colors.primary, borderRadius: 999 },
});