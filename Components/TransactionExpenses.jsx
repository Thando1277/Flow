import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

const C = {
    bg: '#0F0F14',
    surface: '#1A1A24',
    elevated: '#22222F',
    border: '#2E2E3E',
    accent: '#7C6FFF',
    accentLight: '#A89CFF',
    expense: '#FF6B7A',
    textPrimary: '#F0EFF8',
    textMuted: '#7A7A9A',
}

const CATEGORY_META = {
    groceries:     { icon: 'cart-outline',            color: '#4ECBA1' },
    electricity:   { icon: 'flash-outline',           color: '#F6D440' },
    water:         { icon: 'water-outline',            color: '#60CFFF' },
    entertainment: { icon: 'game-controller-outline', color: '#FF6B7A' },
    transport:     { icon: 'car-outline',             color: '#A89CFF' },
    rent:          { icon: 'home-outline',            color: '#FF9F7A' },
    food:          { icon: 'restaurant-outline',      color: '#F6A740' },
    health:        { icon: 'medkit-outline',          color: '#4ECBA1' },
    default:       { icon: 'receipt-outline',         color: '#7A7A9A' },
}

const getMeta = (cat = '') => CATEGORY_META[cat.toLowerCase()] || CATEGORY_META.default

// Mock data — replace with Firestore fetch
const MOCK_EXPENSES = [
    { id: '1', date: 'Today',     label: 'Checkers Run',      category: 'groceries',     amount: 1840 },
    { id: '2', date: 'Today',     label: 'Uber Eats',         category: 'food',          amount: 320  },
    { id: '3', date: 'Yesterday', label: 'Netflix & Spotify', category: 'entertainment', amount: 399  },
    { id: '4', date: 'Yesterday', label: 'City Power',        category: 'electricity',   amount: 840  },
    { id: '5', date: 'Mon 16',    label: 'Monthly Rent',      category: 'rent',          amount: 6500 },
    { id: '6', date: 'Mon 16',    label: 'Gym Membership',    category: 'health',        amount: 499  },
    { id: '7', date: 'Sun 15',    label: 'Petrol',            category: 'transport',     amount: 750  },
]

const FILTERS = ['All', 'This Week', 'This Month']

const TransactionRow = ({ item, last }) => {
    const meta = getMeta(item.category)
    return (
        <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: C.border }]}>
            <View style={[styles.iconRing, { backgroundColor: meta.color + '1A', borderColor: meta.color + '40' }]}>
                <Ionicons name={meta.icon} size={19} color={meta.color} />
            </View>
            <View style={styles.rowInfo}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowCat}>{item.category}</Text>
            </View>
            <Text style={[styles.rowAmt, { color: C.expense }]}>-R{item.amount.toLocaleString()}</Text>
        </View>
    )
}

const TransactionExpenses = () => {
    const [filter, setFilter] = useState('All')

    const total = MOCK_EXPENSES.reduce((s, t) => s + t.amount, 0)

    const grouped = MOCK_EXPENSES.reduce((acc, tx) => {
        if (!acc[tx.date]) acc[tx.date] = []
        acc[tx.date].push(tx)
        return acc
    }, {})

    return (
        <View style={styles.container}>
            {/* Total + filter */}
            <View style={styles.topRow}>
                <View>
                    <Text style={styles.totalLabel}>Total Expenses</Text>
                    <Text style={styles.totalAmt}>R{total.toLocaleString()}</Text>
                </View>
                <View style={styles.filterRow}>
                    {FILTERS.map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterChip, filter === f && styles.filterChipActive]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Grouped list */}
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                {Object.entries(grouped).map(([date, txs]) => (
                    <View key={date} style={styles.group}>
                        <Text style={styles.groupDate}>{date}</Text>
                        <View style={styles.card}>
                            {txs.map((tx, i) => (
                                <TransactionRow key={tx.id} item={tx} last={i === txs.length - 1} />
                            ))}
                        </View>
                    </View>
                ))}
                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    )
}

export default TransactionExpenses

const styles = StyleSheet.create({
    container: { flex: 1 },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: C.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.9,
    },
    totalAmt: {
        fontSize: 22,
        fontWeight: '800',
        color: C.expense,
        letterSpacing: -0.5,
        marginTop: 2,
    },
    filterRow: { flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' },
    filterChip: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor: C.surface,
        borderWidth: 1,
        borderColor: C.border,
    },
    filterChipActive: {
        backgroundColor: C.expense + '18',
        borderColor: C.expense + '50',
    },
    filterText: { fontSize: 11, color: C.textMuted, fontWeight: '600' },
    filterTextActive: { color: C.expense },

    group: { marginBottom: 12 },
    groupDate: {
        fontSize: 11,
        fontWeight: '700',
        color: C.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 6,
        marginLeft: 2,
    },
    card: {
        backgroundColor: C.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.border,
        paddingHorizontal: 14,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        gap: 12,
    },
    iconRing: {
        width: 42,
        height: 42,
        borderRadius: 13,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowInfo: { flex: 1 },
    rowLabel: { fontSize: 14, fontWeight: '600', color: C.textPrimary },
    rowCat: { fontSize: 11, color: C.textMuted, marginTop: 2, textTransform: 'capitalize' },
    rowAmt: { fontSize: 14, fontWeight: '700' },
})