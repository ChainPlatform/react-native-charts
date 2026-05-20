import { Platform } from 'react-native';

export const px = v => (Platform.OS === 'web' ? Math.round(v) + 0.5 : v);
