// Google Auth using Expo Web Browser (simpler approach)
import * as WebBrowser from 'expo-web-browser';

// Stack Auth Configuration
const STACK_AUTH_CONFIG = {
  projectId: "134b9c44-52d4-4719-9f60-b8f494ebe994",
  publishableKey: "YOUR_PUBLISHABLE_KEY_HERE",
  secretKey: "YOUR_SECRET_KEY_HERE",
  baseUrl: "https://api.stack-auth.com/api/v1",
  googleOAuth: {
    clientId: "YOUR_GOOGLE_CLIENT_ID_HERE",
    clientSecret: "YOUR_GOOGLE_CLIENT_SECRET_HERE",
    redirectUrl: "https://api.stack-auth.com/api/v1/auth/oauth/callback/google"
  }
};

// Google OAuth URLs
const GOOGLE_OAUTH_CONFIG = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

// Mock Stack Auth Client for compatibility
class StackAuthClient {
  async signInWithOAuth(provider: string): Promise<any> {
    try {
      console.log(`[Auth] Attempting to sign in with ${provider}`);

      if (provider !== 'google') {
        throw new Error(`Unsupported provider: ${provider}`);
      }

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${STACK_AUTH_CONFIG.googleOAuth.clientId}&` +
        `redirect_uri=${encodeURIComponent(STACK_AUTH_CONFIG.googleOAuth.redirectUrl)}&` +
        `scope=${encodeURIComponent('openid profile email')}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent`;

      console.log('[Auth] Opening web browser for Google OAuth');
      const result = await WebBrowser.openBrowserAsync(googleAuthUrl);

      if (result.type === 'cancel' || result.type === 'dismiss') {
        console.log('[Auth] User cancelled authentication');
        throw new Error('User cancelled authentication');
      }

      // In a real app, you would exchange the authorization code for an access token.
      // Here, we'll just return mock data as the original code did.
      console.log('[Auth] OAuth flow completed, returning mock user data.');
      return {
        user: {
          id: 'google-user-id-123',
          displayName: 'محمد أحمد',
          email: 'user@gmail.com',
          avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        },
        accessToken: 'mock-google-access-token',
      };

    } catch (error: any) {
      console.error('[Auth] OAuth error:', error.message);
      // Providing a fallback for development purposes, as in the original code
      console.warn('[Auth] OAuth failed. Returning fallback mock data.');
      return {
        user: {
          id: 'mock-user-id-fallback',
          displayName: 'مستخدم تجريبي',
          email: 'mock@example.com'
        },
        accessToken: 'mock-fallback-access-token'
      };
    }
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<any> {
    console.log(`Mock: Sign in with email ${email}`);
    return {
      user: {
        id: 'mock-user-id',
        displayName: email,
        email: email
      },
      accessToken: 'mock-access-token'
    };
  }

  async signUpWithEmailAndPassword(email: string, password: string, displayName?: string): Promise<any> {
    console.log(`Mock: Sign up with email ${email}`);
    return {
      user: {
        id: 'mock-user-id',
        displayName: displayName || email,
        email: email
      },
      accessToken: 'mock-access-token'
    };
  }

  async sendPasswordResetEmail(email: string): Promise<any> {
    console.log(`Mock: Password reset for ${email}`);
    return { success: true };
  }

  async signOut(): Promise<any> {
    console.log('Mock: Sign out');
    return { success: true };
  }

  get user(): any {
    return null;
  }

  async getAccessToken(): Promise<string | null> {
    return 'mock-access-token';
  }
}

// Initialize Stack Auth Client
export const stackAuthClient = new StackAuthClient();

// Auth Service Class
export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Google Sign In
  async signInWithGoogle(): Promise<any> {
    try {
      console.log('Starting Google Sign In...');
      const result = await stackAuthClient.signInWithOAuth('google');

      if (result && result.user) {
        console.log('Google Sign In successful:', result.user);
        return {
          success: true,
          user: result.user,
          accessToken: result.accessToken
        };
      } else {
        console.error('Google Sign In failed: Invalid response');
        return {
          success: false,
          error: 'Invalid response from server'
        };
      }
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Email Sign In
  async signInWithEmailAndPassword(email: string, password: string): Promise<any> {
    try {
      const result = await stackAuthClient.signInWithEmailAndPassword(email, password);
      return {
        success: true,
        user: result.user,
        accessToken: result.accessToken
      };
    } catch (error) {
      console.error('Email Sign In Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Create Account with Email
  async signUpWithEmailAndPassword(email: string, password: string, displayName?: string): Promise<any> {
    try {
      const result = await stackAuthClient.signUpWithEmailAndPassword(email, password, displayName);
      return {
        success: true,
        user: result.user,
        accessToken: result.accessToken
      };
    } catch (error) {
      console.error('Email Sign Up Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Reset Password
  async resetPassword(email: string): Promise<any> {
    try {
      const result = await stackAuthClient.sendPasswordResetEmail(email);
      return {
        success: true,
        message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
      };
    } catch (error) {
      console.error('Reset Password Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Sign Out
  async signOut(): Promise<any> {
    try {
      const result = await stackAuthClient.signOut();
      return {
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
      };
    } catch (error) {
      console.error('Sign Out Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get Current User
  getCurrentUser(): any {
    try {
      return stackAuthClient.user;
    } catch (error) {
      console.error('Get Current User Error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    try {
      return !!stackAuthClient.user;
    } catch (error) {
      console.error('Check Authentication Error:', error);
      return false;
    }
  }

  // Get Access Token
  async getAccessToken(): Promise<string | null> {
    try {
      return await stackAuthClient.getAccessToken();
    } catch (error) {
      console.error('Get Access Token Error:', error);
      return null;
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export configuration for reference
export { STACK_AUTH_CONFIG };
