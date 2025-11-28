import { useFonts } from 'expo-font';
import { SpecialGothicExpandedOne_400Regular } from '@expo-google-fonts/special-gothic-expanded-one';
import { Manrope_400Regular, Manrope_600SemiBold } from '@expo-google-fonts/manrope';

export function useAppFonts() {
    const [fontsLoaded, fontError] = useFonts({
        SpecialGothicExpandedOne: SpecialGothicExpandedOne_400Regular,
        'Manrope-Regular': Manrope_400Regular,
        'Manrope-SemiBold': Manrope_600SemiBold,
    });

    return {
        fontsLoaded,
        fontError,
    };
}

