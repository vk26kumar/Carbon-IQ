import React from 'react';
import { View, Text, Button} from 'react-native';
import i18n from "../utils/i18n";
import { useRouter } from 'expo-router';

const LanguageScreen = () => {
    const router = useRouter();

    return (
        <View>
            <Text>{i18n.t("select_language")}</Text>
            <Button 
            title="English" 
            onPress={() => { 
                i18n.locale = 'en'; 
                router.push({ pathname: "/onboard", params: { lang: "en"}});
                }}>
            </Button>
            
            <Button 
            title="हिन्दी" 
            onPress={() => { 
                i18n.locale = 'hi'; 
                router.push({ pathname: "/onboard", params: { lang: "hi"}}); 
            }}>
            </Button>
        </View>
    );
};

export default LanguageScreen;