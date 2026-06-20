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
    income: '#4ECBA1',
    textPrimary: '#F0EFF8',
    textMuted: '#7A7A9A',
}

const CATEGORY_META = {
    salary:     { icon: 'briefcase-outline',    color: '#4ECBA1' },
    savings:    { icon: 'wallet-outline',        color: '#7C6FFF' },
    gift:       { icon: 'gift-outline',          color: '#F6A740' },
    freelance:  { icon: 'laptop-outline',        color: '#60CFFF' },
    investment: { icon: 'trending-up-outline',   color: '#4ECBA1' },
    default:    { icon: 'cash-outline',          color: '#A89CFF' },
}

const getMeta = (cat = '') => CATEGORY_META[cat.toLowerCase()] || CATEGORY_META.default

const MOCK_INCOME = [
    { id: '1', date: 'Today',     label: 'June Salary',    category: 'salary',     amount: 25000 },
    { id: '2', date: 'Today',     label: 'Freelance Job',  category: 'freelance',  amount: 3500  },
    { id: '3', date: 'Yesterday', label: 'Birthday Gift',  category: 'gift',       amount: 500   },
    { id: '4', date: 'Mon 16',    label: 'Stock Dividend', category: 'investment', amount: 1200  },
    { id: '5', date: 'Mon 16',    label: 'Emergency Fund', category: 'savings',    amount: 3000  },
    { id: '6', date: 'Sun 15',    label: 'Side Project',   category: 'freelance',  amount: 1800  },
]

const FILTERS = ['All', 'This Week', 'This Month']

// ── Plain function, NOT a component export — no separate import needed ──────
function IncomeRow({ item, last }) {
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
            <Text style={[styles.rowAmt, { color: C.income }]}>+R{item.amount.toLocaleString()}</Text>
        </View>
    )
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function TransactionIncome() {
    const [filter, setFilter] = useState('All')
    const total = MOCK_INCOME.reduce((s, t) => s + t.amount, 0)

    const grouped = MOCK_INCOME.reduce((acc, tx) => {
        if (!acc[tx.date]) acc[tx.date] = []
        acc[tx.date].push(tx)
        return acc
    }, {})

    return (
        <View style={styles.container}>
            {/* Total + filters */}
            <View style={styles.topRow}>
                <View>
                    <Text style={styles.totalLabel}>Total Income</Text>
                    <Text style={[styles.totalAmt, { color: C.income }]}>
                        R{total.toLocaleString()}
                    </Text>
                </View>
                <View style={styles.filterRow}>
                    {FILTERS.map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterChip, filter === f && styles.filterChipActive]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[styles.filterText, filter === f && { color: C.income }]}>
                                {f}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Grouped list */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {Object.entries(grouped).map(([date, txs]) => (
                    <View key={date} style={styles.group}>
                        <Text style={styles.groupDate}>{date}</Text>
                        <View style={styles.card}>
                            {txs.map((tx, i) => (
                                <IncomeRow key={tx.id} item={tx} last={i === txs.length - 1} />
                            ))}
                        </View>
                    </View>
                ))}
                <View style={{ height: 140 }} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    totalLabel: {
        fontSize: 11, fontWeight: '700', color: C.textMuted,
        textTransform: 'uppercase', letterSpacing: 0.9,
    },
    totalAmt: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, marginTop: 2 },
    filterRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' },
    filterChip: {
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
        backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    },
    filterChipActive: { backgroundColor: C.income + '18', borderColor: C.income + '50' },
    filterText: { fontSize: 11, color: C.textMuted, fontWeight: '600' },

    group: { marginBottom: 12 },
    groupDate: {
        fontSize: 11, fontWeight: '700', color: C.textMuted,
        textTransform: 'uppercase', letterSpacing: 1,
        marginBottom: 6, marginLeft: 2,
    },
    card: {
        backgroundColor: C.surface, borderRadius: 16,
        borderWidth: 1, borderColor: C.border, paddingHorizontal: 14,
    },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 12 },
    iconRing: {
        width: 42, height: 42, borderRadius: 13,
        borderWidth: 1.5, justifyContent: 'center', alignItems: 'center',
    },
    rowInfo: { flex: 1 },
    rowLabel: { fontSize: 14, fontWeight: '600', color: C.textPrimary },
    rowCat: { fontSize: 11, color: C.textMuted, marginTop: 2, textTransform: 'capitalize' },
    rowAmt: { fontSize: 14, fontWeight: '700' },
})