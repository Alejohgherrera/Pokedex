import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PokemonCard from '../components/PokemonCard';
import FeedbackState from '../components/FeedbackState';
import { getPokemonByNameOrId, getPokemonPage } from '../services/pokeApi';
import { colors, spacing } from '../theme/colors';

const PAGE_SIZE = 20;

export default function HomeScreen({ onSelectPokemon }) {
  const [searchText, setSearchText] = useState('');
  const [pokemon, setPokemon] = useState([]);
  const [total, setTotal] = useState(Infinity);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const offsetRef = useRef(0);

  
  const loadFirstPage = useCallback(async (signal) => {
    setLoading(true); setError(null); setEmptyMessage(null);
    try {
      const page = await getPokemonPage(0, signal);
      offsetRef.current = page.pokemon.length;
      setIsSearchActive(false);
      setPokemon(page.pokemon); setTotal(page.total);
    } catch (err) {
      if (err.name !== 'AbortError') setError('No se pudo conectar con la API. Revisa tu internet.');
    } finally { setLoading(false); }
  }, []);

  
  useEffect(() => {
    const controller = new AbortController();
    loadFirstPage(controller.signal);
    return () => controller.abort();
  }, [loadFirstPage]);

  const loadMore = async () => {
    if (loading || loadingMore || offsetRef.current >= total || isSearchActive) return;
    setLoadingMore(true);
    try {
      const page = await getPokemonPage(offsetRef.current);
      offsetRef.current += page.pokemon.length;
      setPokemon((current) => [...current, ...page.pokemon]);
    } catch { setError('No se pudieron cargar más Pokémon. Intenta de nuevo.'); }
    finally { setLoadingMore(false); }
  };

  const handleSearch = async () => {
    const term = searchText.trim().toLowerCase();
    if (!term) return loadFirstPage();
    setLoading(true); setError(null); setEmptyMessage(null);
    try {
      const result = await getPokemonByNameOrId(term);
      setIsSearchActive(true);
      setPokemon(result ? [result] : []);
      setEmptyMessage(result ? null : `No encontramos un Pokémon llamado “${term}”.`);
    } catch { setError('No se pudo realizar la búsqueda. Revisa tu internet e inténtalo de nuevo.'); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>PokéDex Explorer</Text>
      <View style={styles.searchRow}>
        <TextInput style={styles.input} placeholder="Busca por nombre o número..." value={searchText} onChangeText={setSearchText} onSubmitEditing={handleSearch} returnKeyType="search" autoCapitalize="none" autoCorrect={false} />
        <Pressable style={styles.button} onPress={handleSearch}><Text style={styles.buttonText}>Buscar</Text></Pressable>
      </View>
      {loading ? <FeedbackState loading message="Cargando Pokémon..." /> : error ? <FeedbackState message={error} onRetry={() => (searchText.trim() ? handleSearch() : loadFirstPage())} /> : (
        <FlatList data={pokemon} numColumns={2} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => <PokemonCard pokemon={item} onPress={() => onSelectPokemon(item.id)} />} contentContainerStyle={styles.list} onEndReached={loadMore} onEndReachedThreshold={0.35} refreshing={false} onRefresh={() => loadFirstPage()} ListEmptyComponent={<FeedbackState message={emptyMessage || 'No hay resultados para mostrar.'} />} ListFooterComponent={loadingMore ? <ActivityIndicator style={styles.footer} color={colors.primary} /> : null} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background }, title: { fontSize: 28, fontWeight: '800', color: colors.text, paddingHorizontal: spacing.md, paddingTop: spacing.md },
  searchRow: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm }, input: { flex: 1, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: spacing.md, height: 46, color: colors.text },
  button: { justifyContent: 'center', backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: spacing.md }, buttonText: { color: '#FFF', fontWeight: '700' }, list: { paddingHorizontal: spacing.xs, paddingBottom: spacing.xl }, footer: { marginVertical: spacing.md },
});
