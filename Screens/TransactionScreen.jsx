import {
    StyleSheet, Text, View, TouchableOpacity, Animated,
    SafeAreaView, StatusBar, Platform
} from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../Components/BottomNavigation';
import TransactionIncome from '../Components/TransactionIncome';
import TransactionExpenses from '../Components/TransactionExpenses';

// ─── Design tokens ────────────────────────────────────────────────────────
const C = {
    bg: '#0F0F14',
    surface: '#1A1A24',
    elevated: '#22222F',
    border: '#2E2E3E',
    accent: '#7C6FFF',
    accentLight: '#A89CFF',
    income: '#4ECBA1',
    expense: '#FF6B7A',
    textPrimary: '#F0EFF8',
    textMuted: '#7A7A9A',
    white: '#FFFFFF',
};

const TransactionScreen = () => {
    const [selected, setSelected] = useState('Income');
    const slideAnim = useRef(new Animated.Value(0)).current;
    const fabScale  = useRef(new Animated.Value(1)).current;
    const navigation = useNavigation();

    const toggle = (type) => {
        setSelected(type);
        Animated.spring(slideAnim, {
            toValue: type === 'Income' ? 0 : 1,
            tension: 120,
            friction: 10,
            useNativeDriver: false,
        }).start();
    };

    const translateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const incomeOpacity  = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.45] });
    const expenseOpacity = slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] });

    const onFabPress = () => {
        Animated.sequence([
            Animated.spring(fabScale, { toValue: 0.85, useNativeDriver: true, tension: 200, friction: 8 }),
            Animated.spring(fabScale, { toValue: 1,    useNativeDriver: true, tension: 200, friction: 8 }),
        ]).start(() => navigation.navigate('AddTransactionScreen'));
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />

            {/* ── Header ──────────────────────────────────────────────── */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Transactions</Text>
                    <Text style={styles.headerSub}>Your income & expenses</Text>
                </View>
                <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="funnel-outline" size={16} color={C.accentLight} />
                    <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
            </View>

            {/* ── Summary pills ────────────────────────────────────────── */}
            <View style={styles.summaryRow}>
                <View style={styles.summaryPill}>
                    <View style={[styles.summaryDot, { backgroundColor: C.income }]} />
                    <View>
                        <Text style={styles.summaryLabel}>Total Income</Text>
                        <Text style={[styles.summaryVal, { color: C.income }]}>R28,000</Text>
                    </View>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryPill}>
                    <View style={[styles.summaryDot, { backgroundColor: C.expense }]} />
                    <View>
                        <Text style={styles.summaryLabel}>Total Spent</Text>
                        <Text style={[styles.summaryVal, { color: C.expense }]}>R13,600</Text>
                    </View>
                </View>
            </View>

            {/* ── Toggle ──────────────────────────────────────────────── */}
            <View style={styles.toggleWrapper}>
                <View style={styles.toggleTrack}>
                    {/* Sliding pill */}
                    <Animated.View style={[styles.togglePill, { left: translateX }]} />

                    {/* Income tab */}
                    <TouchableOpacity style={styles.toggleTab} onPress={() => toggle('Income')} activeOpacity={0.85}>
                        <Animated.View style={[styles.toggleTabInner, { opacity: incomeOpacity }]}>
                            <Ionicons
                                name={selected === 'Income' ? 'arrow-down-circle' : 'arrow-down-circle-outline'}
                                size={15}
                                color={selected === 'Income' ? C.income : C.textMuted}
                            />
                            <Text style={[
                                styles.toggleText,
                                selected === 'Income' && { color: C.income, fontWeight: '700' }
                            ]}>Income</Text>
                        </Animated.View>
                    </TouchableOpacity>

                    {/* Expenses tab */}
                    <TouchableOpacity style={styles.toggleTab} onPress={() => toggle('Expenses')} activeOpacity={0.85}>
                        <Animated.View style={[styles.toggleTabInner, { opacity: expenseOpacity }]}>
                            <Ionicons
                                name={selected === 'Expenses' ? 'arrow-up-circle' : 'arrow-up-circle-outline'}
                                size={15}
                                color={selected === 'Expenses' ? C.expense : C.textMuted}
                            />
                            <Text style={[
                                styles.toggleText,
                                selected === 'Expenses' && { color: C.expense, fontWeight: '700' }
                            ]}>Expenses</Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Transaction list ─────────────────────────────────────── */}
            <View style={styles.listArea}>
                {selected === 'Income' ? <TransactionIncome /> : <TransactionExpenses />}
            </View>

            {/* ── FAB ─────────────────────────────────────────────────── */}
            <Animated.View style={[styles.fabWrap, { transform: [{ scale: fabScale }] }]}>
                <TouchableOpacity style={styles.fab} onPress={onFabPress} activeOpacity={1}>
                    <Ionicons name="add" size={28} color={C.white} />
                </TouchableOpacity>
            </Animated.View>

            <BottomNavigation />
        </SafeAreaView>
    );
};

export default TransactionScreen;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: C.bg,
    },

    // ── Header ──────────────────────────────────────────────────────────────
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 16 : 8,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: C.textPrimary,
        letterSpacing: -0.5,
    },
    headerSub: {
        fontSize: 12,
        color: C.textMuted,
        marginTop: 2,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: C.surface,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: C.accentLight,
    },

    // ── Summary row ─────────────────────────────────────────────────────────
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 16,
        backgroundColor: C.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.border,
        padding: 16,
    },
    summaryPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    summaryDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    summaryLabel: {
        fontSize: 11,
        color: C.textMuted,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    summaryVal: {
        fontSize: 17,
        fontWeight: '800',
        marginTop: 2,
        letterSpacing: -0.4,
    },
    summaryDivider: {
        width: 1,
        height: 36,
        backgroundColor: C.border,
        marginHorizontal: 16,
    },

    // ── Toggle ──────────────────────────────────────────────────────────────
    toggleWrapper: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    toggleTrack: {
        flexDirection: 'row',
        backgroundColor: C.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: C.border,
        height: 48,
        position: 'relative',
        overflow: 'hidden',
    },
    togglePill: {
        position: 'absolute',
        width: '50%',
        height: '100%',
        backgroundColor: C.elevated,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: C.border,
    },
    toggleTab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    toggleTabInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: C.textMuted,
        letterSpacing: 0.1,
    },

    // ── List ────────────────────────────────────────────────────────────────
    listArea: {
        flex: 1,
        paddingHorizontal: 20,
    },

    // ── FAB ─────────────────────────────────────────────────────────────────
    fabWrap: {
        position: 'absolute',
        bottom: 90,
        right: 20,
    },
    fab: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor: C.accent,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: C.accent,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
        elevation: 10,
    },
});