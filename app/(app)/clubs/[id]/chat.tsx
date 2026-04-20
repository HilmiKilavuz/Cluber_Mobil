// app/(app)/clubs/[id]/chat.tsx
// Kulüp sohbet ekranı — Socket.IO + FlatList inverted

import React, { useState, useRef, useCallback } from 'react';
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
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { Message } from '@/types/chat';
import * as Haptics from 'expo-haptics';

export default function ClubChatScreen() {
  const c = useColors();
  const { id: clubId } = useLocalSearchParams<{ id: string }>();
  const { sessionQuery } = useAuth();
  const currentUserId = sessionQuery.data?.id;

  const { messages, isConnected, isLoading, sendMessage } = useSocket(clubId!);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    sendMessage(text);
    setInputText('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [inputText, sendMessage]);

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => {
      const isMe = item.userId === currentUserId;
      return (
        <View
          style={[
            styles.messageRow,
            isMe ? styles.messageRowMe : styles.messageRowOther,
          ]}
        >
          {!isMe && (
            <Avatar
              uri={item.user?.avatarUrl}
              name={item.user?.displayName}
              size={32}
              style={{ marginRight: Spacing[2] }}
            />
          )}
          <View style={styles.messageBubbleContainer}>
            {!isMe && item.user?.displayName && (
              <Text style={[Typography.caption, { color: c.inkTertiary, marginBottom: 2 }]}>
                {item.user.displayName}
              </Text>
            )}
            <View
              style={[
                styles.bubble,
                isMe
                  ? { backgroundColor: c.accent, borderRadius: Radius.lg, borderBottomRightRadius: 4 }
                  : { backgroundColor: c.bgSecondary, borderRadius: Radius.lg, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: c.border },
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
            <Text
              style={[
                Typography.caption,
                {
                  color: c.inkTertiary,
                  marginTop: 2,
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                },
              ]}
            >
              {format(new Date(item.createdAt), 'HH:mm', { locale: tr })}
            </Text>
          </View>
        </View>
      );
    },
    [currentUserId, c],
  );

  return (
    <ScreenWrapper edges={['top']}>
      <BackHeader
        title="Kulüp Sohbeti"
        rightAction={
          <View style={styles.statusDot}>
            <View
              style={[
                styles.dot,
                { backgroundColor: isConnected ? c.success : c.inkTertiary },
              ]}
            />
          </View>
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={c.accent} />
            <Text style={[Typography.bodyMd, { color: c.inkSecondary, marginTop: Spacing[3] }]}>
              Sohbet yükleniyor...
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageList}
            inverted={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Ionicons name="chatbubbles-outline" size={48} color={c.inkTertiary} />
                <Text style={[Typography.bodyMd, { color: c.inkTertiary, marginTop: Spacing[3] }]}>
                  İlk mesajı sen gönder!
                </Text>
              </View>
            }
          />
        )}

        {/* Mesaj input alanı */}
        <View
          style={[
            styles.inputContainer,
            { borderTopColor: c.border, backgroundColor: c.surface },
          ]}
        >
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
            accessibilityLabel="Gönder"
          >
            <Ionicons
              name="send"
              size={18}
              color={inputText.trim() && isConnected ? c.accentFg : c.inkTertiary}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: Spacing[4],
    gap: Spacing[3],
    flexGrow: 1,
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
    maxWidth: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: Spacing[3],
    borderTopWidth: 1,
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
  statusDot: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});
