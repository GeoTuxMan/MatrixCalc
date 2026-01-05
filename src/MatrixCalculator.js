import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TextInput } from 'react-native';
import { Card, Title, Paragraph, Checkbox, Button } from 'react-native-paper';
import * as math from 'mathjs';

const MatrixCalculator = () => {
  const [matrixSize, setMatrixSize] = useState(2);
  const [matrix, setMatrix] = useState(Array(2).fill().map(() => Array(2).fill(0)));
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSizeChange = (size) => {
    setMatrixSize(size);
    setMatrix(Array(size).fill().map(() => Array(size).fill(0)));
    setResults({});
  };

  const handleMatrixChange = (value, row, col) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrix(newMatrix);
  };

  const calculateOperations = () => {
    setLoading(true);
    setResults({});
    
    try {
      const mathMatrix = math.matrix(matrix);
      const newResults = {};

      // 1. Determinant
      newResults.determinant = math.det(mathMatrix);
      
      // 2. Diagonala principala
      newResults.diagonal = matrix.map((row, i) => row[i]);
      
      // 3. Matricea transpusa
      newResults.transpose = math.transpose(mathMatrix).toArray();
      
      // 4. Matricea inversa
      if (newResults.determinant !== 0) {
        newResults.inverse = math.inv(mathMatrix).toArray();
      } else {
        newResults.inverse = "Not exist (determinant it's null)";
      }
      
      // 5. Valori proprii (doar pentru matrice 2x2)
      if (matrixSize === 2) {
        const [[a, b], [c, d]] = matrix;
        const trace = a + d;
        const det = a * d - b * c;
        const discriminant = trace * trace - 4 * det;
        
        if (discriminant >= 0) {
          newResults.eigenvalues = [
            (trace + Math.sqrt(discriminant)) / 2,
            (trace - Math.sqrt(discriminant)) / 2
          ];
        } else {
          newResults.eigenvalues = "Complex eigenvalues";
        }
      }
      
      setResults(newResults);
    } catch (error) {
      Alert.alert('Erorr', `Could not calculate all operations: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderSizeSelector = () => (
    <View style={styles.sizeSelectorContainer}>
      <Text style={styles.sizeLabel}>Matrix dimension:</Text>
      <View style={styles.checkboxContainer}>
        {[2, 3, 4, 5, 6].map((size) => (
          <View key={`size-${size}`} style={styles.checkboxWrapper}>
            <Checkbox.Android
              status={matrixSize === size ? 'checked' : 'unchecked'}
              onPress={() => handleSizeChange(size)}
              color="#6200ee"
            />
            <Text style={styles.checkboxLabel}>{size}x{size}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderMatrixInput = () => (
    <View style={styles.matrixContainer}>
      <Text style={styles.matrixLabel}>Enter matrix values:</Text>
      {matrix.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((cell, colIndex) => (
            <TextInput
              key={`cell-${rowIndex}-${colIndex}`}
              style={styles.cell}
              keyboardType="numeric"
              value={String(cell)}
              onChangeText={(text) => handleMatrixChange(text, rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  );

  const renderResults = () => {
    if (loading) {
      return <Text style={styles.loading}>It is calculated...</Text>;
    }

    return (
      <ScrollView style={styles.resultsContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Results</Title>
            
            <Paragraph style={styles.resultItem}>
              <Text style={styles.resultLabel}>Determinant:</Text> {results.determinant}
            </Paragraph>
            
            <Paragraph style={styles.resultItem}>
              <Text style={styles.resultLabel}>Main diagonal:</Text> 
              {Array.isArray(results.diagonal) ? `[${results.diagonal.join(', ')}]` : results.diagonal}
            </Paragraph>
            
            <Paragraph style={styles.resultItem}>
              <Text style={styles.resultLabel}>Transpose matrix:</Text>
            </Paragraph>
            {Array.isArray(results.transpose) && results.transpose.map((row, i) => (
              <Paragraph key={`transpose-row-${i}`}>[{row.join(', ')}]</Paragraph>
            ))}
            
            <Paragraph style={styles.resultItem}>
              <Text style={styles.resultLabel}>Inverse matrix:</Text>
            </Paragraph>
            {Array.isArray(results.inverse) ? (
              results.inverse.map((row, i) => (
                <Paragraph key={`inverse-row-${i}`}>[{row.join(', ')}]</Paragraph>
              ))
            ) : (
              <Paragraph>{results.inverse}</Paragraph>
            )}
            
            {results.eigenvalues && (
              <Paragraph style={styles.resultItem}>
                <Text style={styles.resultLabel}>Eigenvalues:</Text> 
                {Array.isArray(results.eigenvalues) ? 
                  `[${results.eigenvalues.join(', ')}]` : results.eigenvalues}
              </Paragraph>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matrix Calculator</Text>
      
      {renderSizeSelector()}
      {renderMatrixInput()}
      
      <Button 
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        onPress={calculateOperations}
        loading={loading}
        disabled={loading}
      >
        Start
      </Button>
      
      {Object.keys(results).length > 0 && renderResults()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#6200ee',
  },
  sizeSelectorContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sizeLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  matrixContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  matrixLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'center',
  },
  cell: {
    width: 60,
    height: 45,
    borderColor: '#6200ee',
    borderWidth: 1,
    marginRight: 8,
    textAlign: 'center',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#fafafa',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#6200ee',
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6200ee',
  },
  resultItem: {
    marginBottom: 8,
  },
  resultLabel: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
});

export default MatrixCalculator;