import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import MatrixCalculator from './src/MatrixCalculator';

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <MatrixCalculator />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
