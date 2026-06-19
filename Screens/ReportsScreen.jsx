import {
    StyleSheet, Text, View, ScrollView, TouchableOpacity,
    SafeAreaView, StatusBar, Platform, Animated, Dimensions
} from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import BottomNavigation from '../Components/BottomNavigation'

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
    warn: '#F6A740',
    textPrimary: '#F0EFF8',
    textMuted: '#7A7A9A',
    white: '#FFFFFF',
};

const SCREEN_W = Dimensions.get('window').width;

// ─── Mock data ─────────────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MONTHLY_DATA = {
    // [income, expense] per month
    Jan: { income: 25000, expense: 14200 },
    Feb: { income: 25000, expense: 16800 },
    Mar: { income: 27500, expense: 12900 },
    Apr: { income: 25000, expense: 18400 },
    May: { income: 25000, expense: 15300 },
    Jun: { income: 28000, expense: 13600 },
};

const CATEGORY_BREAKDOWN = [
    { name: 'Groceries',     icon: 'cart-outline',             color: '#4ECBA1', amount: 3200, pct: 0.24 },
    { name: 'Rent',          icon: 'home-outline',             color: '#FF9F7A', amount: 6500, pct: 0.48 },
    { name: 'Entertainment', icon: 'game-controller-outline',  color: '#FF6B7A', amount: 1200, pct: 0.09 },
    { name: 'Electricity',   icon: 'flash-outline',            color: '#F6D440', amount: 840,  pct: 0.06 },
    { name: 'Water',         icon: 'water-outline',            color: '#60CFFF', amount: 380,  pct: 0.03 },
    { name: 'Transport',     icon: 'car-outline',              color: '#A89CFF', amount: 1280, pct: 0.10 },
];

const TOP_EXPENSES = [
    { label: 'Monthly Rent',       category: 'Rent',          icon: 'home-outline',           color: '#FF9F7A', amount: 6500 },
    { label: 'Checkers Run',       category: 'Groceries',     icon: 'cart-outline',           color: '#4ECBA1', amount: 1840 },
    { label: 'Uber Eats',          category: 'Food',          icon: 'restaurant-outline',     color: '#F6A740', amount: 960  },
    { label: 'Netflix & Spotify',  category: 'Entertainment', icon: 'game-controller-outline',color: '#FF6B7A', amount: 399  },
    { label: 'City Power',         category: 'Electricity',   icon: 'flash-outline',          color: '#F6D440', amount: 840  },
];

// ─── Animated bar chart ────────────────────────────────────────────────────
const BAR_H = 140;
const BAR_W = 28;

const BarChart = ({ data }) => {
    const months = Object.keys(data);
    const maxVal = Math.max(...months.flatMap(m => [data[m].income, data[m].expense]));
    const anims = useRef(months.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        const animations = months.map((_, i) =>
            Animated.spring(anims[i], {
                toValue: 1,
                delay: i * 60,
                tension: 80,
                friction: 10,
                useNativeDriver: false,
            })
        );
        Animated.stagger(60, animations).start();
    }, []);

    return (
        <View style={barStyles.root}>
            {months.map((month, i) => {
                const inc = data[month].income / maxVal;
                const exp = data[month].expense / maxVal;
                return (
                    <View key={month} style={barStyles.group}>
                        <View style={barStyles.bars}>
                            {/* Income bar */}
                            <Animated.View style={[
                                barStyles.bar,
                                { backgroundColor: C.income + 'CC', marginRight: 3 },
                                { height: anims[i].interpolate({ inputRange: [0,1], outputRange: [0, BAR_H * inc] }) }
                            ]} />
                            {/* Expense bar */}
                            <Animated.View style={[
                                barStyles.bar,
                                { backgroundColor: C.expense + 'CC' },
                                { height: anims[i].interpolate({ inputRange: [0,1], outputRange: [0, BAR_H * exp] }) }
                            ]} />
                        </View>
                        <Text style={barStyles.label}>{month}</Text>
                    </View>
                );
            })}
        </View>
    );
};

const barStyles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: BAR_H + 24,
        paddingHorizontal: 4,
    },
    group: {
        alignItems: 'center',
        gap: 6,
    },
    bars: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: BAR_H,
    },
    bar: {
        width: BAR_W / 2 - 1,
        borderRadius: 6,
        minHeight: 4,
    },
    label: {
        fontSize: 11,
        color: C.textMuted,
        fontWeight: '500',
    },
});

// ─── Spending donut ring (pure View arcs via rotation trick) ───────────────
const DonutRing = ({ segments, size = 120, stroke = 14 }) => {
    // We render colored arcs via border trick
    const r = size / 2;
    const inner = size - stroke * 2;
    return (
        <View style={{ width: size, height: size, position: 'relative' }}>
            {segments.map((seg, i) => {
                const prev = segments.slice(0, i).reduce((s, x) => s + x.pct, 0);
                const deg = prev * 360;
                const span = seg.pct * 360;
                // Split into two half-circle layers for spans > 180
                return (
                    <View
                        key={i}
                        style={{
                            position: 'absolute',
                            width: size,
                            height: size,
                            borderRadius: r,
                            overflow: 'hidden',
                            transform: [{ rotate: `${deg}deg` }],
                        }}
                        pointerEvents="none"
                    >
                        <View style={{
                            position: 'absolute',
                            width: size,
                            height: size,
                            borderRadius: r,
                            borderWidth: stroke,
                            borderColor: seg.color,
                            opacity: 0.85,
                        }} />
                    </View>
                );
            })}
            {/* Center hole */}
            <View style={{
                position: 'absolute',
                top: stroke,
                left: stroke,
                width: inner,
                height: inner,
                borderRadius: inner / 2,
                backgroundColor: C.surface,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={{ fontSize: 11, color: C.textMuted, fontWeight: '600' }}>Spent</Text>
                <Text style={{ fontSize: 16, color: C.expense, fontWeight: '800' }}>
                    R{CATEGORY_BREAKDOWN.reduce((s, c) => s + c.amount, 0).toLocaleString()}
                </Text>
            </View>
        </View>
    );
};

// ─── Insight card ──────────────────────────────────────────────────────────
const InsightCard = ({ icon, iconColor, title, value, sub, accent }) => (
    <View style={[insightStyles.card, { borderColor: accent + '30' }]}>
        <View style={[insightStyles.iconRing, { backgroundColor: accent + '18', borderColor: accent + '35' }]}>
            <Ionicons name={icon} size={18} color={accent} />
        </View>
        <Text style={insightStyles.title}>{title}</Text>
        <Text style={[insightStyles.value, { color: accent }]}>{value}</Text>
        <Text style={insightStyles.sub}>{sub}</Text>
    </View>
);

const insightStyles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: C.elevated,
        borderRadius: 16,
        borderWidth: 1.5,
        padding: 14,
        gap: 5,
        minWidth: 100,
    },
    iconRing: {
        width: 34,
        height: 34,
        borderRadius: 10,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: { fontSize: 11, color: C.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
    value: { fontSize: 17, fontWeight: '800', letterSpacing: -0.4 },
    sub:   { fontSize: 11, color: C.textMuted },
});

// ─── Percentage bar ────────────────────────────────────────────────────────
const PctBar = ({ pct, color }) => {
    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.spring(anim, { toValue: pct, tension: 60, friction: 10, useNativeDriver: false }).start();
    }, []);
    const barW = SCREEN_W - 40 - 20 - 20 - 90; // card padding + icon + amount col
    return (
        <View style={{ height: 5, backgroundColor: C.border, borderRadius: 3, flex: 1, overflow: 'hidden' }}>
            <Animated.View style={{
                height: 5,
                borderRadius: 3,
                backgroundColor: color,
                width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            }} />
        </View>
    );
};

// ─── ReportsScreen ─────────────────────────────────────────────────────────
const ReportsScreen = () => {
    const months = Object.keys(MONTHLY_DATA);
    const [selectedMonth, setSelectedMonth] = useState(months.length - 1);
    const currentMonth = months[selectedMonth];
    const { income, expense } = MONTHLY_DATA[currentMonth];
    const savings = income - expense;
    const savingsPct = Math.round((savings / income) * 100);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />

            {/* ── Header ──────────────────────────────────────────────── */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Reports</Text>
                    <Text style={styles.headerSub}>Your financial picture</Text>
                </View>
                <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="options-outline" size={18} color={C.accentLight} />
                    <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* ── Month selector ───────────────────────────────────── */}
                <View style={styles.monthRow}>
                    <TouchableOpacity
                        style={[styles.monthArrow, selectedMonth === 0 && { opacity: 0.3 }]}
                        onPress={() => setSelectedMonth(m => Math.max(0, m - 1))}
                        disabled={selectedMonth === 0}
                    >
                        <Ionicons name="chevron-back" size={18} color={C.accentLight} />
                    </TouchableOpacity>
                    <View style={styles.monthLabel}>
                        <Text style={styles.monthText}>{currentMonth} 2025</Text>
                        <View style={styles.monthDots}>
                            {months.map((_, i) => (
                                <View key={i} style={[
                                    styles.monthDot,
                                    i === selectedMonth && { backgroundColor: C.accent, width: 16 }
                                ]} />
                            ))}
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.monthArrow, selectedMonth === months.length - 1 && { opacity: 0.3 }]}
                        onPress={() => setSelectedMonth(m => Math.min(months.length - 1, m + 1))}
                        disabled={selectedMonth === months.length - 1}
                    >
                        <Ionicons name="chevron-forward" size={18} color={C.accentLight} />
                    </TouchableOpacity>
                </View>

                {/* ── Summary trio ─────────────────────────────────────── */}
                <View style={styles.trioRow}>
                    <View style={styles.trioCard}>
                        <Text style={styles.trioLabel}>Income</Text>
                        <Text style={[styles.trioVal, { color: C.income }]}>R{income.toLocaleString()}</Text>
                    </View>
                    <View style={[styles.trioCard, styles.trioCenterCard]}>
                        <Text style={styles.trioLabel}>Saved</Text>
                        <Text style={[styles.trioVal, { color: C.accentLight }]}>{savingsPct}%</Text>
                        <Text style={styles.trioSub}>R{savings.toLocaleString()}</Text>
                    </View>
                    <View style={styles.trioCard}>
                        <Text style={styles.trioLabel}>Spent</Text>
                        <Text style={[styles.trioVal, { color: C.expense }]}>R{expense.toLocaleString()}</Text>
                    </View>
                </View>

                {/* ── 6-month bar chart ────────────────────────────────── */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>6-Month Overview</Text>
                        <View style={styles.legend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: C.income }]} />
                                <Text style={styles.legendText}>Income</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: C.expense }]} />
                                <Text style={styles.legendText}>Expenses</Text>
                            </View>
                        </View>
                    </View>
                    <BarChart data={MONTHLY_DATA} />
                </View>

                {/* ── Insight cards ────────────────────────────────────── */}
                <Text style={styles.sectionTitle}>Insights</Text>
                <View style={styles.insightRow}>
                    <InsightCard
                        icon="trending-down-outline"
                        accent={C.expense}
                        title="Biggest spend"
                        value="Rent"
                        sub="48% of expenses"
                    />
                    <InsightCard
                        icon="trophy-outline"
                        accent={C.income}
                        title="Best month"
                        value="Jun"
                        sub="Lowest spend"
                    />
                    <InsightCard
                        icon="swap-vertical-outline"
                        accent={C.warn}
                        title="vs Last month"
                        value="-11%"
                        sub="Spending down"
                    />
                </View>

                {/* ── Spending breakdown ───────────────────────────────── */}
                <Text style={styles.sectionTitle}>Spending by Category</Text>
                <View style={styles.card}>
                    {/* Donut + legend */}
                    <View style={styles.donutRow}>
                        <DonutRing segments={CATEGORY_BREAKDOWN} size={130} stroke={16} />
                        <View style={styles.donutLegend}>
                            {CATEGORY_BREAKDOWN.map(cat => (
                                <View key={cat.name} style={styles.donutLegendItem}>
                                    <View style={[styles.donutDot, { backgroundColor: cat.color }]} />
                                    <Text style={styles.donutLegendLabel}>{cat.name}</Text>
                                    <Text style={[styles.donutLegendPct, { color: cat.color }]}>
                                        {Math.round(cat.pct * 100)}%
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Category rows with animated pct bars */}
                    <View style={styles.catDivider} />
                    {CATEGORY_BREAKDOWN.map(cat => (
                        <View key={cat.name} style={styles.catRow}>
                            <View style={[styles.catIconRing, {
                                backgroundColor: cat.color + '1A',
                                borderColor: cat.color + '40'
                            }]}>
                                <Ionicons name={cat.icon} size={15} color={cat.color} />
                            </View>
                            <View style={styles.catInfo}>
                                <View style={styles.catInfoTop}>
                                    <Text style={styles.catName}>{cat.name}</Text>
                                    <Text style={[styles.catAmt, { color: cat.color }]}>
                                        R{cat.amount.toLocaleString()}
                                    </Text>
                                </View>
                                <PctBar pct={cat.pct} color={cat.color} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* ── Top 5 expenses ───────────────────────────────────── */}
                <Text style={styles.sectionTitle}>Top Expenses</Text>
                <View style={styles.card}>
                    {TOP_EXPENSES.map((tx, i) => (
                        <View key={i} style={[
                            styles.txRow,
                            i < TOP_EXPENSES.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.border }
                        ]}>
                            <Text style={styles.txRank}>#{i + 1}</Text>
                            <View style={[styles.txIconRing, {
                                backgroundColor: tx.color + '1A',
                                borderColor: tx.color + '40'
                            }]}>
                                <Ionicons name={tx.icon} size={17} color={tx.color} />
                            </View>
                            <View style={styles.txInfo}>
                                <Text style={styles.txLabel}>{tx.label}</Text>
                                <Text style={styles.txCat}>{tx.category}</Text>
                            </View>
                            <Text style={[styles.txAmt, { color: C.expense }]}>
                                -R{tx.amount.toLocaleString()}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* ── Saving rate ring ─────────────────────────────────── */}
                <Text style={styles.sectionTitle}>Savings Rate</Text>
                <View style={[styles.card, styles.savingsCard]}>
                    <View style={styles.savingsLeft}>
                        <Text style={styles.savingsBig}>{savingsPct}%</Text>
                        <Text style={styles.savingsLabel}>saved this month</Text>
                        <View style={styles.savingsBadge}>
                            <Ionicons
                                name={savingsPct >= 20 ? 'checkmark-circle' : 'alert-circle'}
                                size={13}
                                color={savingsPct >= 20 ? C.income : C.warn}
                            />
                            <Text style={[styles.savingsBadgeText, {
                                color: savingsPct >= 20 ? C.income : C.warn
                            }]}>
                                {savingsPct >= 20 ? 'On track' : 'Below target'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.savingsRight}>
                        <View style={styles.savingsBarTrack}>
                            <View style={[styles.savingsBarFill, { height: `${savingsPct}%` }]} />
                        </View>
                        <Text style={styles.savingsTarget}>20% target</Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <BottomNavigation />
        </SafeAreaView>
    );
};

export default ReportsScreen;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: C.bg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 16 : 8,
        paddingBottom: 12,
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
    scroll: { flex: 1 },
    scrollContent: { padding: 20 },

    // ── Month selector ──────────────────────────────────────────────────────
    monthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: C.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.border,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    monthArrow: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: C.elevated,
        justifyContent: 'center',
        alignItems: 'center',
    },
    monthLabel: { alignItems: 'center', gap: 8 },
    monthText: {
        fontSize: 16,
        fontWeight: '700',
        color: C.textPrimary,
        letterSpacing: -0.3,
    },
    monthDots: { flexDirection: 'row', gap: 5 },
    monthDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: C.border,
    },

    // ── Summary trio ────────────────────────────────────────────────────────
    trioRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    trioCard: {
        flex: 1,
        backgroundColor: C.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: C.border,
        padding: 14,
        alignItems: 'center',
        gap: 4,
    },
    trioCenterCard: {
        borderColor: C.accent + '50',
        backgroundColor: C.accent + '10',
    },
    trioLabel: { fontSize: 11, color: C.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
    trioVal: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
    trioSub: { fontSize: 11, color: C.textMuted },

    // ── Generic card ────────────────────────────────────────────────────────
    card: {
        backgroundColor: C.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: C.border,
        padding: 16,
        marginBottom: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: C.textPrimary,
    },
    legend: { flexDirection: 'row', gap: 12 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { fontSize: 11, color: C.textMuted, fontWeight: '500' },

    // ── Section label ───────────────────────────────────────────────────────
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: C.textPrimary,
        letterSpacing: -0.3,
        marginBottom: 12,
    },

    // ── Insights ────────────────────────────────────────────────────────────
    insightRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
    },

    // ── Donut ───────────────────────────────────────────────────────────────
    donutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 16,
    },
    donutLegend: { flex: 1, gap: 6 },
    donutLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
    },
    donutDot: { width: 8, height: 8, borderRadius: 4 },
    donutLegendLabel: { flex: 1, fontSize: 12, color: C.textMuted },
    donutLegendPct: { fontSize: 12, fontWeight: '700' },
    catDivider: { height: 1, backgroundColor: C.border, marginBottom: 12 },

    // ── Category rows ───────────────────────────────────────────────────────
    catRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    catIconRing: {
        width: 34,
        height: 34,
        borderRadius: 10,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    catInfo: { flex: 1, gap: 5 },
    catInfoTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    catName: { fontSize: 13, fontWeight: '600', color: C.textPrimary },
    catAmt: { fontSize: 13, fontWeight: '700' },

    // ── Top expenses ────────────────────────────────────────────────────────
    txRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
    },
    txRank: {
        width: 22,
        fontSize: 11,
        fontWeight: '700',
        color: C.textMuted,
        textAlign: 'center',
    },
    txIconRing: {
        width: 38,
        height: 38,
        borderRadius: 11,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txInfo: { flex: 1 },
    txLabel: { fontSize: 14, fontWeight: '600', color: C.textPrimary },
    txCat: { fontSize: 11, color: C.textMuted, marginTop: 1, textTransform: 'capitalize' },
    txAmt: { fontSize: 14, fontWeight: '700' },

    // ── Savings rate ────────────────────────────────────────────────────────
    savingsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    savingsLeft: { gap: 6 },
    savingsBig: {
        fontSize: 48,
        fontWeight: '900',
        color: C.accentLight,
        letterSpacing: -2,
        lineHeight: 54,
    },
    savingsLabel: { fontSize: 13, color: C.textMuted },
    savingsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: C.elevated,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    savingsBadgeText: { fontSize: 12, fontWeight: '600' },
    savingsRight: { alignItems: 'center', gap: 6 },
    savingsBarTrack: {
        width: 28,
        height: 100,
        backgroundColor: C.border,
        borderRadius: 14,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    savingsBarFill: {
        width: '100%',
        backgroundColor: C.accent,
        borderRadius: 14,
    },
    savingsTarget: { fontSize: 10, color: C.textMuted, fontWeight: '600' },
});