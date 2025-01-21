import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import { RootStackParamList } from 'App';
import color from 'src/constant/color';

type Props = NativeStackScreenProps<RootStackParamList, 'Indicator'>;

const IndicatorScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const checkToken = async () => {
      setTimeout(async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          navigation.replace('Main');
        } else {
          navigation.replace('Login');
        }
      }, 2000);
    };

    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../../assets/animations/paw.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.primaryLighter,
  },
  lottie: {
    width: 150,
    height: 150,
  
  },
});

export default IndicatorScreen;



