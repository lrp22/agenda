import { Stack, useRouter } from "expo-router";
import { useWindowDimensions, Button, View } from "react-native";

const Layout = () => {
  const { height } = useWindowDimensions();
  const router = useRouter();
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "#fff" } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};
export default Layout;
