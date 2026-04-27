// app/(app)/clubs/[id]/chat.tsx
// Kulüp sohbet ekranı — Socket.IO gerçek zamanlı mesajlaşma
//
// Mimari:
//  - useSocket hook → Socket.IO bağlantısı + HTTP geçmiş yükleme
//  - FlatList (inverted=false, scrollToEnd) — yeni mesajlar altta
//  - KeyboardAvoidingView → klavye açıkken input görünür kalır
//  - Bağlantı durumu → header'daki yeşil/gri nokta

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { BackHeader } from '@/components/layout/BackHeader';
import { Avatar } from '@/components/ui/Avatar';
import { useSocket } from '@/hooks/chat/useSocket';
import { useAuth } from '@/hooks/auth/useAuth';
import { useColors } from '@/hooks/ui/useColorScheme';
import { Typography } from '@/constants/Typography';
import { Spacing, Layout, Radius } from '@/constants/Tokens';
import { format, isToday, isYesterday } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { Message } from '@/types/chat';
import * as Haptics from 'expo-haptics';

// ──────────────────────────────────────────────────────────────────────────────
// Yardımcı — mesaj tarih etiketi
// ──────────────────────────────────────────────────────────────────────────────

function formatMessageDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return format(date, 'HH:mm', { locale: tr });
  if (isYesterday(date)) return `Dün ${format(date, 'HH:mm', { locale: tr })}`;
  return format(date, 'd MMM HH:mm', { locale: tr });
}

// ──────────────────────────────────────────────────────────────────────────────
// Tekil mesaj bileşeni (memo ile gereksiz re-render önlenir)
// ──────────────────────────────────────────────────────────────────────────────

interface MessageItemProps {
  item: Message;
  isMe: boolean;
  colors: ReturnType<typeof useColors>;
}

const MessageItem = React.memo(function MessageItem({
  item,
  isMe,
  colors: c,
}: MessageItemProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={[
        styles.messageRow,
        isMe ? styles.messageRowMe : styles.messageRowOther,
      ]}
    >
      {/* Karşı tarafın avatarı */}
      {!isMe && (
        <Avatar
          uri={item.user?.avatarUrl}
          name={item.user?.displayName}
          size={32}
          style={{ marginRight: Spacing[2], alignSelf: 'flex-end' }}
        />
      )}

      <View style={styles.messageBubbleContainer}>
        {/* Gönderen adı (yalnızca karşı taraf) */}
        {!isMe && item.user?.displayName && (
          <Text
            style={[
              Typography.caption,
              { color: c.inkTertiary, marginBottom: 3 },
            ]}
          >
            {item.user.displayName}
          </Text>
        )}

        {/* Balon */}
        <View
          style={[
            styles.bubble,
            isMe
              ? {
                  backgroundColor: c.accent,
                  borderRadius: Radius.lg,
                  borderBottomRightRadius: 4,
                }
              : {
                  backgroundColor: c.bgSecondary,
                  borderRadius: Radius.lg,
                  borderBottomLeftRadius: 4,
                  borderWidth: 1,
                  borderColor: c.border,
                },
          ]}
        >
          <Text
            style={[
              Typography.bodyMd,
              { color: isMe ? c.accentFg : c.ink },
            ]}
          >
            {item.content}
          </Text>
        </View>

        {/* Saat */}
        <Text
          style={[
            Typography.caption,
            {
              color: c.inkTertiary,
              marginTop: 3,
              alignSelf: isMe ? 'flex-end' : 'flex-start',
            },
          ]}
        >
          {formatMessageDate(item.createdAt)}
        </Text>
      </View>
    </Animated.View>
  );
});

// ──────────────────────────────────────────────────────────────────────────────
// Ana ekran
// ──────────────────────────────────────────────────────────────────────────────

export default function ClubChatScreen() {
  const c = useColors();
  const { id: clubId } = useLocalSearchParams<{ id: string }>();
  const { sessionQuery } = useAuth();
  const currentUserId = sessionQuery.data?.id;

  const { messages, isConnected, isLoading, sendMessage } = useSocket(clubId!);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Yeni mesaj geldiğinde veya liste değiştiğinde en alta scroll et
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || !isConnected) return;

    sendMessage(text);
    setInputText('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Gönderim sonrası en alta scroll
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, [inputText, sendMessage, isConnected]);

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => (
      <MessageItem
        item={item}
        isMe={item.userId === currentUserId}
        colors={c}
      />
    ),
    [currentUserId, c],
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  // ── Bağlantı durum göstergesi ───────────────────────────────────────────────
  const ConnectionIndicator = (
    <View style={styles.statusContainer}>
      <View
        style={[
          styles.dot,
          { backgroundColor: isConnected ? c.success : c.inkTertiary },
        ]}
      />
      <Text style={[Typography.caption, { color: c.inkTertiary, marginLeft: 4 }]}>
        {isConnected ? 'Canlı' : 'Bağlanıyor...'}
      </Text>
    </View>
  );

  return (
    <ScreenWrapper>
      <BackHeader title="Kulüp Sohbeti" rightAction={ConnectionIndicator} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* ── Yükleme durumu ──────────────────────────────────────────────── */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={c.accent} size="large" />
            <Text
              style={[
                Typography.bodyMd,
                { color: c.inkSecondary, marginTop: Spacing[3] },
              ]}
            >
              Sohbet yükleniyor...
            </Text>
          </View>
        ) : (
          /* ── Mesaj listesi ────────────────────────────────────────────────── */
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={keyExtractor}
            renderItem={renderMessage}
            contentContainerStyle={[
              styles.messageList,
              messages.length === 0 && styles.messageListEmpty,
            ]}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            // Performans ayarları
            removeClippedSubviews
            maxToRenderPerBatch={15}
            windowSize={10}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={48}
                  color={c.inkTertiary}
                />
                <Text
                  style={[
                    Typography.headingMd,
                    { color: c.ink, marginTop: Spacing[4] },
                  ]}
                >
                  Henüz mesaj yok
                </Text>
                <Text
                  style={[
                    Typography.bodyMd,
                    {
                      color: c.inkSecondary,
                      marginTop: Spacing[2],
                      textAlign: 'center',
                    },
                  ]}
                >
                  İlk mesajı sen gönder!
                </Text>
              </View>
            }
          />
        )}

        {/* ── Mesaj giriş alanı ──────────────────────────────────────────── */}
        <View
          style={[
            styles.inputContainer,
            {
              borderTopColor: c.border,
              backgroundColor: c.surface,
            },
          ]}
        >
          {/* Bağlı değilse uyarı bandı */}
          {!isConnected && !isLoading && (
            <View
              style={[
                styles.offlineBanner,
                { backgroundColor: c.warningBg },
              ]}
            >
              <Ionicons name="wifi-outline" size={14} color={c.warning} />
              <Text
                style={[
                  Typography.caption,
                  { color: c.warning, marginLeft: 4 },
                ]}
              >
                Bağlantı bekleniyor...
              </Text>
            </View>
          )}

          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.textInput,
                {
                  color: c.ink,
                  backgroundColor: c.bgSecondary,
                  borderColor: c.border,
                  fontFamily: 'DM-Sans-Regular',
                },
              ]}
              placeholder="Bir mesaj yaz..."
              placeholderTextColor={c.inkTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={handleSend}
            />
            <Pressable
              onPress={handleSend}
              disabled={!inputText.trim() || !isConnected}
              style={[
                styles.sendButton,
                {
                  backgroundColor:
                    inputText.trim() && isConnected ? c.accent : c.bgSecondary,
                },
              ]}
              accessibilityLabel="Mesaj gönder"
              accessibilityRole="button"
            >
              <Ionicons
                name="send"
                size={18}
                color={
                  inputText.trim() && isConnected ? c.accentFg : c.inkTertiary
                }
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Stiller
// ──────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[4],
    paddingBottom: Spacing[2],
    gap: Spacing[3],
  },
  messageListEmpty: {
    flex: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  messageRowMe: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messageRowOther: {
    alignSelf: 'flex-start',
  },
  messageBubbleContainer: {
    maxWidth: '100%',
  },
  bubble: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? Spacing[4] : Spacing[2],
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: Spacing[2],
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[3],
    gap: Spacing[2],
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    height: 44,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[16],
    paddingHorizontal: Layout.screenPaddingH,
  },
});
