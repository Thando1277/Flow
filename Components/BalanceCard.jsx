import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../Firebase/FirebaseConfig'

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
}

export default function BalanceCard() {
    const [balance, setBalance] = useState(0)
    const [income, setIncome]   = useState(0)
    const [spent, setSpent]     = useState(0)
    const [hidden, setHidden]   = useState(false)
    const fadeAnim = useRef(new Animated.Value(0)).current
    const scaleAnim = useRef(new Animated.Value(0.96)).current
    const user = auth.currentUser

    useEffect(() => {
        if (!user) return
        const userRef = doc(db, 'users', user.uid)
        const unsub = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data()
                setBalance(data.balance   ?? 0)
                setIncome(data.income     ?? 0)
                setSpent(data.spent       ?? 0)
            }
        })
        return () => unsub()
    }, [user])

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 10, useNativeDriver: true }),
        ]).start()
    }, [])

    const formatBalance = (val) => {
        const num = parseFloat(val) || 0
        return num.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    const savings = income - spent
    const savingsPct = income > 0 ? Math.round((savings / income) * 100) : 0
    const spentPct   = income > 0 ? Math.min((spent / income) * 100, 100) : 0

    return (
        <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>

            {/* ── Top row ────────────────────────────────────────────── */}
            <View style={styles.topRow}>
                <View style={styles.topLeft}>
                    <View style={styles.cardChip}>
                        <Ionicons name="wallet" size={11} color={C.accentLight} />
                        <Text style={styles.chipText}>Main Account</Text>
                    </View>
                    <Text style={styles.balanceLabel}>Total Balance</Text>
                </View>
                <View style={styles.topRight}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => setHidden(h => !h)}>
                        <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={17} color={C.accentLight} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="ellipsis-horizontal" size={17} color={C.accentLight} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Balance ────────────────────────────────────────────── */}
            <View style={styles.balanceRow}>
                <Text style={styles.currency}>R</Text>
                <Text style={styles.balance}>
                    {hidden ? '••••••' : formatBalance(balance)}
                </Text>
            </View>

            {/* ── Spent progress bar ─────────────────────────────────── */}
            <View style={styles.progressWrap}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${spentPct}%` }]} />
                </View>
                <Text style={styles.progressLabel}>{spentPct}% of income spent</Text>
            </View>

            {/* ── Divider ────────────────────────────────────────────── */}
            <View style={styles.divider} />

            {/* ── Income / Spent stats ───────────────────────────────── */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <View style={[styles.statDot, { backgroundColor: C.income }]} />
                    <View>
                        <Text style={styles.statLabel}>Income</Text>
                        <Text style={[styles.statVal, { color: C.income }]}>
                            {hidden ? '••••' : `R${formatBalance(income)}`}
                        </Text>
                    </View>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                    <View style={[styles.statDot, { backgroundColor: C.expense }]} />
                    <View>
                        <Text style={styles.statLabel}>Spent</Text>
                        <Text style={[styles.statVal, { color: C.expense }]}>
                            {hidden ? '••••' : `R${formatBalance(spent)}`}
                        </Text>
                    </View>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                    <View style={[styles.statDot, { backgroundColor: C.accentLight }]} />
                    <View>
                        <Text style={styles.statLabel}>Saved</Text>
                        <Text style={[styles.statVal, { color: C.accentLight }]}>
                            {hidden ? '••••' : `${savingsPct}%`}
                        </Text>
                    </View>
                </View>
            </View>

        </Animated.View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: C.surface,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: C.accent + '35',
        marginHorizontal: 20,
        marginTop: 8,
        padding: 20,
        // Glow
        shadowColor: C.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
        elevation: 10,
    },

    // ── Top row ──────────────────────────────────────────────────────────────
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    topLeft: { gap: 4 },
    topRight: { flexDirection: 'row', gap: 8 },
    cardChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: C.accent + '18',
        borderWidth: 1,
        borderColor: C.accent + '35',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    chipText: { fontSize: 10, fontWeight: '700', color: C.accentLight, letterSpacing: 0.5 },
    balanceLabel: { fontSize: 12, color: C.textMuted, fontWeight: '500' },
    iconBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: C.elevated,
        borderWidth: 1,
        borderColor: C.border,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ── Balance ──────────────────────────────────────────────────────────────
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 4,
        marginBottom: 16,
    },
    currency: {
        fontSize: 22,
        fontWeight: '700',
        color: C.accentLight,
        marginBottom: 4,
    },
    balance: {
        fontSize: 40,
        fontWeight: '800',
        color: C.textPrimary,
        letterSpacing: -1.5,
        lineHeight: 46,
    },

    // ── Progress bar ─────────────────────────────────────────────────────────
    progressWrap: { marginBottom: 16, gap: 6 },
    progressTrack: {
        height: 4,
        backgroundColor: C.border,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: 4,
        backgroundColor: C.expense,
        borderRadius: 2,
    },
    progressLabel: { fontSize: 10, color: C.textMuted, fontWeight: '500' },

    // ── Divider ──────────────────────────────────────────────────────────────
    divider: { height: 1, backgroundColor: C.border, marginBottom: 14 },

    // ── Stats ────────────────────────────────────────────────────────────────
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statDot: { width: 7, height: 7, borderRadius: 3.5 },
    statLabel: {
        fontSize: 10,
        color: C.textMuted,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statVal: { fontSize: 13, fontWeight: '800', marginTop: 1, letterSpacing: -0.3 },
    statDivider: { width: 1, height: 30, backgroundColor: C.border, marginHorizontal: 4 },
})