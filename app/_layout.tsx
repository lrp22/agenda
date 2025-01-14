import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    // Fetch session on app start
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session ? session.user : null);
      setInitialized(true);
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session ? session.user : null);
    });

    // Cleanup subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    // Check if the user is navigating a protected route
    const inProtectedGroup = segments[0] === "(authenticated)";

    if (session && !inProtectedGroup) {
      router.replace("/(authenticated)/(tabs)/home");
    } else if (!session) {
      router.replace("/");
    }

    // Hide splash screen after initialization
    SplashScreen.hideAsync();
  }, [initialized, session, segments]);

  // Wait for fonts to load before rendering
  if (!loaded) {
    return null;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
