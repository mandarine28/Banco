import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { useAuth } from '@/state/auth';
import { colors } from '@/theme';

GoogleSignin.configure({
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

export default function AuthScreen() {
  const { user, signInWithEmail, signUpWithEmail, signInWithApple, signInWithGoogle, signOut } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Utilisateur déjà connecté — afficher son compte
  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.title}>Mon compte</Text>
          <Text style={[styles.toggleText, { fontSize: 16, textAlign: 'center', marginBottom: 8 }]}>
            {user.email}
          </Text>
          <Pressable
            style={[styles.button, styles.buttonPrimary]}
            onPress={async () => {
              try { await signOut(); router.back(); } catch { /* ignore */ }
            }}
          >
            <Text style={styles.buttonPrimaryText}>Se déconnecter</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.toggleRow}>
            <Text style={styles.toggleText}>Retour</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
      router.back();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError(null);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) throw new Error('Token Apple manquant');
      await signInWithApple(credential.identityToken, credential.authorizationCode ?? undefined);
      router.back();
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e && e.code === 'ERR_REQUEST_CANCELED') return;
      setError(e instanceof Error ? e.message : 'Connexion Apple échouée.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      if (!tokens.idToken) throw new Error('Token Google manquant');
      await signInWithGoogle(tokens.idToken);
      router.back();
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'SIGN_IN_CANCELLED') return;
      setError(e instanceof Error ? e.message : 'Connexion Google échouée.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>{isSignUp ? 'Créer un compte' : 'Se connecter'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.inputPlaceholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor={colors.inputPlaceholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleEmailAuth}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonPrimaryText}>
              {isSignUp ? 'Créer le compte' : 'Connexion'}
            </Text>
          )}
        </Pressable>

        <Pressable onPress={() => setIsSignUp((v) => !v)} style={styles.toggleRow}>
          <Text style={styles.toggleText}>
            {isSignUp ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? Créer un compte'}
          </Text>
        </Pressable>

        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>ou</Text>
          <View style={styles.separatorLine} />
        </View>

        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={12}
            style={styles.appleButton}
            onPress={handleAppleSignIn}
          />
        )}

        <Pressable style={[styles.button, styles.buttonGoogle]} onPress={handleGoogleSignIn}>
          <Text style={styles.buttonGoogleText}>Continuer avec Google</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.purple,
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.lavender,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.black,
  },
  error: {
    color: '#e53e3e',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.purple,
    marginTop: 4,
  },
  buttonPrimaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonGoogle: {
    borderWidth: 1.5,
    borderColor: colors.lavender,
    backgroundColor: colors.white,
  },
  buttonGoogleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  toggleRow: {
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: colors.purple,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lavender,
  },
  separatorText: {
    color: colors.muted,
    fontSize: 14,
  },
  appleButton: {
    height: 50,
    width: '100%',
  },
});
