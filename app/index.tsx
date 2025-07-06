import { useRouter, useNavigationContainerRef } from "expo-router";
import { useEffect , useRef} from "react";
import { View, Text } from "react-native";

export default function Index() {
  const router = useRouter();

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      setTimeout(() => {
        router.replace("/language");
      }, 100);
    }
  }, []);

  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}
