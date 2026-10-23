import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';


export default function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {selectedPokemon ? (
        <DetailScreen
          pokemonId={selectedPokemon}
          onBack={() => setSelectedPokemon(null)}
        />
      ) : (
        <HomeScreen onSelectPokemon={setSelectedPokemon} />
      )}
    </SafeAreaProvider>
  );
}
