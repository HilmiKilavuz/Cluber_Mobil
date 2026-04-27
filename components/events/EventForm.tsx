// components/events/EventForm.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useCreateEvent } from '@/hooks/events/useEvents';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Radius } from '@/constants/Tokens';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const eventSchema = z.object({
  title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır.'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır.').optional().or(z.literal('')),
  date: z.string().min(1, 'Başlangıç tarihi seçilmelidir.'),
  location: z.string().min(3, 'Konum belirtilmelidir.'),
  imageUrl: z.string().optional().nullable(),
  maxParticipants: z.string().optional().refine((val) => !val || !isNaN(Number(val)), { message: 'Geçerli bir sayı girin.' }),
  category: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  clubId: string;
  onSuccess?: () => void;
}

export function EventForm({ clubId, onSuccess }: EventFormProps) {
  const c = useColors();
  const createEventMutation = useCreateEvent();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateMode, setDateMode] = useState<'date' | 'time'>('date');

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: { title: '', description: '', date: '', location: '', imageUrl: null, maxParticipants: '', category: '' },
  });

  const selectedDateStr = watch('date');
  const selectedDate = selectedDateStr ? new Date(selectedDateStr) : undefined;

  const onSubmit = async (data: EventFormData) => {
    try {
      // Backend CreateEventDto expects ONLY title, description, date, location, and clubId.
      // Extra fields cause Bad Request due to whitelist: true and forbidNonWhitelisted: true.
      await createEventMutation.mutateAsync({
        clubId,
        title: data.title,
        description: data.description || undefined,
        date: new Date(data.date).toISOString(),
        location: data.location,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({ type: 'success', text1: 'Etkinlik başarıyla oluşturuldu!' });
      onSuccess?.();
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'set' && date) {
      setValue('date', date.toISOString(), { shouldValidate: true });
      if (Platform.OS === 'android' && dateMode === 'date') {
        setDateMode('time');
        setShowDatePicker(true);
      }
    }
  };

  const openDatePicker = () => {
    setDateMode('date');
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>
        <ImageUpload
          aspect={[16, 9]}
          shape="rounded"
          onUploadSuccess={(url) => setValue('imageUrl', url, { shouldValidate: true })}
          containerStyle={styles.bannerUploadContainer}
        >
          <View style={[styles.bannerPreview, { backgroundColor: c.bgSecondary, borderColor: c.border }]}>
            {watch('imageUrl') ? (
              <Image source={{ uri: watch('imageUrl')! }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
            ) : (
              <Text style={[Typography.bodySm, { color: c.inkTertiary }]}>Görsel Ekle (Opsiyonel)</Text>
            )}
          </View>
        </ImageUpload>
      </View>

      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Etkinlik Başlığı"
            placeholder="örn. Haftalık Buluşma"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Açıklama"
            placeholder="Etkinlik hakkında detaylı bilgi..."
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.description?.message}
            multiline
            numberOfLines={3}
            containerStyle={{ marginTop: Spacing[4] }}
          />
        )}
      />

      <View style={{ marginTop: Spacing[4] }}>
        <Text style={[Typography.label, { color: c.inkSecondary, marginBottom: 8 }]}>TARİH VE SAAT</Text>
        <Pressable
          onPress={openDatePicker}
          style={[styles.dateButton, { backgroundColor: c.surface, borderColor: errors.date ? c.error : c.border }]}
        >
          <Text style={[Typography.bodyMd, { color: selectedDate ? c.ink : c.inkTertiary }]}>
            {selectedDate ? format(selectedDate, 'dd MMMM yyyy HH:mm', { locale: tr }) : 'Tarih ve Saat Seçin'}
          </Text>
        </Pressable>
        {errors.date && (
          <Text style={[Typography.caption, { color: c.error, marginTop: 4 }]}>{errors.date.message}</Text>
        )}
      </View>

      {showDatePicker && (
        <View style={Platform.OS === 'ios' ? styles.iosPickerContainer : undefined}>
          <DateTimePicker
            value={selectedDate || new Date()}
            mode={Platform.OS === 'ios' ? 'datetime' : dateMode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
          {Platform.OS === 'ios' && (
            <Button
              label="Tamam"
              onPress={() => setShowDatePicker(false)}
              variant="ghost"
              size="sm"
              style={{ marginTop: Spacing[2] }}
            />
          )}
        </View>
      )}

      <Controller
        control={control}
        name="location"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Konum"
            placeholder="Kafeterya, Zoom, vb."
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.location?.message}
            containerStyle={{ marginTop: Spacing[4] }}
          />
        )}
      />

      <Controller
        control={control}
        name="maxParticipants"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Kontenjan (Opsiyonel)"
            placeholder="örn. 20"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.maxParticipants?.message}
            keyboardType="number-pad"
            containerStyle={{ marginTop: Spacing[4] }}
          />
        )}
      />

      <Button
        label="Etkinliği Oluştur"
        onPress={handleSubmit(onSubmit)}
        loading={createEventMutation.isPending}
        fullWidth
        size="lg"
        style={{ marginTop: Spacing[8] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  mediaContainer: {
    marginBottom: Spacing[6],
    alignItems: 'center',
  },
  bannerUploadContainer: {
    width: '100%',
    height: 160,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  bannerPreview: {
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  iosPickerContainer: {
    marginTop: Spacing[2],
    alignItems: 'center',
  },
});
