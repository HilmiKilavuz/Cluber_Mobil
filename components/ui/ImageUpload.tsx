import React, { useState } from 'react';
import { View, Pressable, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/ui/useColorScheme';
import Toast from 'react-native-toast-message';
import { uploadService } from '@/services/upload/upload.service';
import { Radius } from '@/constants/Tokens';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  children: React.ReactNode;
  aspect?: [number, number];
  containerStyle?: ViewStyle;
  editIconPosition?: 'bottom-right' | 'top-right' | 'center';
  shape?: 'circle' | 'rounded';
}

export function ImageUpload({
  onUploadSuccess,
  children,
  aspect = [1, 1],
  containerStyle,
  editIconPosition = 'bottom-right',
  shape = 'circle',
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const c = useColors();

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Hata', text2: 'Galeri erişim izni reddedildi.' });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setLoading(true);
        const uri = result.assets[0].uri;
        const response = await uploadService.uploadImage(uri);
        onUploadSuccess(response.url);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Hata', text2: 'Resim yüklenirken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const getEditIconStyle = (): ViewStyle => {
    switch (editIconPosition) {
      case 'center':
        return {
          top: '50%',
          left: '50%',
          transform: [{ translateX: -16 }, { translateY: -16 }],
        };
      case 'top-right':
        return {
          top: 0,
          right: 0,
        };
      case 'bottom-right':
      default:
        return {
          bottom: 0,
          right: 0,
        };
    }
  };

  return (
    <Pressable
      onPress={handlePickImage}
      style={[
        styles.container,
        shape === 'circle' ? { borderRadius: Radius.full } : { borderRadius: Radius.lg },
        containerStyle,
      ]}
      disabled={loading}
    >
      {children}
      
      {loading && (
        <View
          style={[
            styles.overlay,
            shape === 'circle' ? { borderRadius: Radius.full } : { borderRadius: Radius.lg },
          ]}
        >
          <ActivityIndicator color="#fff" size="small" />
        </View>
      )}

      {!loading && (
        <View
          style={[
            styles.editIcon,
            { backgroundColor: c.surface, borderColor: c.border },
            getEditIconStyle(),
          ]}
        >
          <Ionicons name="camera-outline" size={16} color={c.ink} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
