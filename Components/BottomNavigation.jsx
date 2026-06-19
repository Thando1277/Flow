import { StyleSheet, Text, TouchableOpacity, View, Platform, Animated } from 'react-native'
import { useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';

// ─── Design tokens (matches app theme) ────────────────────────────────────
const C = {
    bg: '#0F0F14',
    surface: '#1A1A24',
    elevated: '#22222F',
    border: '#2E2E3E',
    accent: '#7C6FFF',
    accentLight: '#A89CFF',
    textPrimary: '#F0EFF8',
    textMuted: '#7A7A9A',
};

const TABS = [
    { route: 'HomeScreen',        icon: 'home',     iconOutline: 'home-outline',     label: 'Home'        },
    { route: 'TransactionScreen', icon: 'wallet',   iconOutline: 'wallet-outline',   label: 'Wallet'      },
    { route: 'ReportsScreen',     icon: 'bar-chart',iconOutline: 'bar-chart-outline',label: 'Reports'     },
    { route: 'SettingsScreen',    icon: 'settings', iconOutline: 'settings-outline', label: 'Settings'    },
];

// ─── Single tab button ─────────────────────────────────────────────────────
const TabButton = ({ tab, isActive, onPress }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const pillWidth = useRef(new Animated.Value(0)).current;
    const pillOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: isActive ? 1.12 : 1,
                useNativeDriver: true,
                tension: 120,
                friction: 8,
            }),
            Animated.timing(pillWidth, {
                toValue: isActive ? 1 : 0,
                duration: 220,
                useNativeDriver: false,
            }),
            Animated.timing(pillOpacity, {
                toValue: isActive ? 1 : 0,
                duration: 180,
                useNativeDriver: false,
            }),
        ]).start();
    }, [isActive]);

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
            Animated.spring(scale, { toValue: isActive ? 1.12 : 1, useNativeDriver: true, tension: 200, friction: 8 }),
        ]).start();
        onPress();
    };

    const interpolatedWidth = pillWidth.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 52],
    });

    return (
        <TouchableOpacity
            style={styles.tabBtn}
            onPress={handlePress}
            activeOpacity={1}
        >
            <Animated.View style={[styles.tabInner, { transform: [{ scale }] }]}>
                {/* Active pill glow behind icon */}
                <Animated.View style={[
                    styles.activePill,
                    {
                        width: interpolatedWidth,
                        opacity: pillOpacity,
                    }
                ]} />
                <Ionicons
                    name={isActive ? tab.icon : tab.iconOutline}
                    size={23}
                    color={isActive ? C.accentLight : C.textMuted}
                />
            </Animated.View>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
            </Text>
        </TouchableOpacity>
    );
};

// ─── BottomNavigation ──────────────────────────────────────────────────────
const BottomNavigation = () => {
    const navigation = useNavigation();
    const state = useNavigationState(s => s);
    const currentRoute = state.routes[state.index].name;

    return (
        <View style={styles.wrapper}>
            {/* Frosted top border line */}
            <View style={styles.topLine} />
            <View style={styles.container}>
                {TABS.map(tab => (
                    <TabButton
                        key={tab.route}
                        tab={tab}
                        isActive={currentRoute === tab.route}
                        onPress={() => {
                            if (currentRoute !== tab.route) {
                                navigation.replace(tab.route);
                            }
                        }}
                    />
                ))}
            </View>
        </View>
    );
};

export default BottomNavigation;

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: C.surface,
        paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    },
    topLine: {
        height: 1,
        backgroundColor: C.border,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 10,
        paddingHorizontal: 8,
    },
    tabBtn: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
    },
    tabInner: {
        width: 52,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    activePill: {
        position: 'absolute',
        height: 36,
        borderRadius: 12,
        backgroundColor: C.accent + '28',
        borderWidth: 1,
        borderColor: C.accent + '40',
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: C.textMuted,
        letterSpacing: 0.2,
    },
    tabLabelActive: {
        color: C.accentLight,
        fontWeight: '700',
    },
});