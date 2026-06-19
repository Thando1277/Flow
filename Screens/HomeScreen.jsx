import {
    StyleSheet, Text, View, TouchableOpacity, Image,
    ScrollView, Modal, FlatList, SafeAreaView, Platform,
    StatusBar, Animated, Dimensions
} from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Components
import BalanceCard from '../Components/BalanceCard';
import BottomNavigation from '../Components/BottomNavigation';
import ActivityCard from '../Components/ActivityCard';
import SpendingOverView from '../Components/SpendingOverView';

// ─── Design tokens (matches AddTransactionScreen) ──────────────────────────
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

const SCREEN_HEIGHT = Dimensions.get('window').height;

// ─── Category → icon + color map ───────────────────────────────────────────
const CATEGORY_META = {
    salary:        { icon: 'briefcase-outline',      color: '#4ECBA1' },
    savings:       { icon: 'wallet-outline',          color: '#7C6FFF' },
    gift:          { icon: 'gift-outline',            color: '#F6A740' },
    groceries:     { icon: 'cart-outline',            color: '#4ECBA1' },
    electricity:   { icon: 'flash-outline',           color: '#F6D440' },
    water:         { icon: 'water-outline',           color: '#60CFFF' },
    entertainment: { icon: 'game-controller-outline', color: '#FF6B7A' },
    transport:     { icon: 'car-outline',             color: '#A89CFF' },
    rent:          { icon: 'home-outline',            color: '#FF9F7A' },
    food:          { icon: 'restaurant-outline',      color: '#F6A740' },
    health:        { icon: 'medkit-outline',          color: '#4ECBA1' },
    default:       { icon: 'ellipse-outline',         color: C.textMuted },
};

const getCategoryMeta = (category = '') => {
    const key = category.toLowerCase();
    return CATEGORY_META[key] || CATEGORY_META.default;
};

// ─── Transaction row ───────────────────────────────────────────────────────
const TransactionRow = ({ item }) => {
    const meta = getCategoryMeta(item.category);
    const isIncome = item.type === 'income';

    return (
        <View style={txStyles.row}>
            <View style={[txStyles.iconRing, { backgroundColor: meta.color + '1A', borderColor: meta.color + '40' }]}>
                <Ionicons name={meta.icon} size={20} color={meta.color} />
            </View>
            <View style={txStyles.info}>
                <Text style={txStyles.label} numberOfLines={1}>{item.notes || item.category}</Text>
                <Text style={txStyles.sub}>{item.category} · {item.date}</Text>
            </View>
            <Text style={[txStyles.amount, { color: isIncome ? C.income : C.expense }]}>
                {isIncome ? '+' : '-'} R{parseFloat(item.amount).toFixed(2)}
            </Text>
        </View>
    );
};

const txStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        gap: 14,
    },
    iconRing: {
        width: 44,
        height: 44,
        borderRadius: 14,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        flex: 1,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: C.textPrimary,
    },
    sub: {
        fontSize: 12,
        color: C.textMuted,
        marginTop: 2,
        textTransform: 'capitalize',
    },
    amount: {
        fontSize: 15,
        fontWeight: '700',
    },
});

// ─── All Transactions Modal ────────────────────────────────────────────────
const AllTransactionsModal = ({ visible, onClose, transactions = [] }) => {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 260,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    // Group by date
    const grouped = transactions.reduce((acc, tx) => {
        const key = tx.date || 'Unknown date';
        if (!acc[key]) acc[key] = [];
        acc[key].push(tx);
        return acc;
    }, {});
    const sections = Object.entries(grouped);

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((s, t) => s + parseFloat(t.amount || 0), 0);
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((s, t) => s + parseFloat(t.amount || 0), 0);

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <View style={modalStyles.overlay}>
                <TouchableOpacity style={modalStyles.backdrop} onPress={onClose} activeOpacity={1} />
                <Animated.View style={[modalStyles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                    {/* Handle */}
                    <View style={modalStyles.handle} />

                    {/* Header */}
                    <View style={modalStyles.header}>
                        <View>
                            <Text style={modalStyles.title}>All Transactions</Text>
                            <Text style={modalStyles.subtitle}>{transactions.length} records</Text>
                        </View>
                        <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
                            <Ionicons name="close" size={20} color={C.textMuted} />
                        </TouchableOpacity>
                    </View>

                    {/* Summary strip */}
                    <View style={modalStyles.summaryStrip}>
                        <View style={modalStyles.summaryItem}>
                            <View style={[modalStyles.summaryDot, { backgroundColor: C.income }]} />
                            <View>
                                <Text style={modalStyles.summaryLabel}>Income</Text>
                                <Text style={[modalStyles.summaryAmt, { color: C.income }]}>
                                    R{totalIncome.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                        <View style={modalStyles.summaryDivider} />
                        <View style={modalStyles.summaryItem}>
                            <View style={[modalStyles.summaryDot, { backgroundColor: C.expense }]} />
                            <View>
                                <Text style={modalStyles.summaryLabel}>Expenses</Text>
                                <Text style={[modalStyles.summaryAmt, { color: C.expense }]}>
                                    R{totalExpense.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Transaction list */}
                    {transactions.length === 0 ? (
                        <View style={modalStyles.empty}>
                            <Ionicons name="receipt-outline" size={48} color={C.border} />
                            <Text style={modalStyles.emptyText}>No transactions yet</Text>
                            <Text style={modalStyles.emptySubText}>Add your first transaction to get started</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={sections}
                            keyExtractor={([date]) => date}
                            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item: [date, txs] }) => (
                                <View style={modalStyles.group}>
                                    <Text style={modalStyles.groupDate}>{date}</Text>
                                    {txs.map((tx, i) => <TransactionRow key={i} item={tx} />)}
                                </View>
                            )}
                        />
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
};

const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        backgroundColor: C.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: SCREEN_HEIGHT * 0.88,
        borderTopWidth: 1,
        borderColor: C.border,
        paddingTop: 12,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: C.border,
        alignSelf: 'center',
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: C.textPrimary,
        letterSpacing: -0.4,
    },
    subtitle: {
        fontSize: 12,
        color: C.textMuted,
        marginTop: 2,
    },
    closeBtn: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: C.elevated,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryStrip: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: C.elevated,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.border,
        padding: 16,
        marginBottom: 20,
        alignItems: 'center',
    },
    summaryItem: {
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
    summaryDivider: {
        width: 1,
        height: 32,
        backgroundColor: C.border,
        marginHorizontal: 16,
    },
    summaryLabel: {
        fontSize: 11,
        color: C.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    summaryAmt: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 2,
    },
    group: {
        marginBottom: 12,
    },
    groupDate: {
        fontSize: 11,
        fontWeight: '600',
        color: C.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
        marginTop: 8,
    },
    empty: {
        alignItems: 'center',
        paddingVertical: 60,
        gap: 10,
    },
    emptyText: {
        fontSize: 17,
        fontWeight: '600',
        color: C.textPrimary,
    },
    emptySubText: {
        fontSize: 13,
        color: C.textMuted,
    },
});

// ─── HomeScreen ────────────────────────────────────────────────────────────
const HomeScreen = () => {
    const [username, setUsername] = useState('');
    const [showAllTx, setShowAllTx] = useState(false);

    // Replace this with your real transaction fetch
    const [transactions, setTransactions] = useState([
        { id: '1', date: 'Mon Jun 16 2025', category: 'Salary',  type: 'income',  amount: '25000', notes: 'June salary' },
        { id: '2', date: 'Mon Jun 16 2025', category: 'Groceries', type: 'expense', amount: '850',   notes: 'Checkers run' },
        { id: '3', date: 'Tue Jun 17 2025', category: 'Electricity', type: 'expense', amount: '420', notes: '' },
        { id: '4', date: 'Tue Jun 17 2025', category: 'Entertainment', type: 'expense', amount: '199', notes: 'Netflix' },
        { id: '5', date: 'Wed Jun 18 2025', category: 'Savings', type: 'income', amount: '3000', notes: 'Emergency fund' },
    ]);

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const auth = getAuth();
                const db = getFirestore();
                const user = auth.currentUser;
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUsername(userDoc.data().fullname.split(' ')[0]);
                    }
                }
            } catch (e) {
                console.log('Could not fetch user:', e);
            }
        };
        getCurrentUser();
    }, []);

    const recentTransactions = transactions.slice(0, 4);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* ── Top bar ──────────────────────────────────────────── */}
                <View style={styles.topBar}>
                    <View style={styles.userRow}>
                        <Image
                            source={require('../assets/linkedin profile.jpg')}
                            style={styles.avatar}
                        />
                        <View style={styles.userTexts}>
                            <Text style={styles.greeting}>Hello, {username || 'there'} 👋</Text>
                            <Text style={styles.tagline}>Track your money with ease</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.bellBtn}>
                        <Ionicons name="notifications-outline" size={22} color={C.textPrimary} />
                        {/* Notification dot */}
                        <View style={styles.bellDot} />
                    </TouchableOpacity>
                </View>

                {/* ── Balance card ──────────────────────────────────────── */}
                <View style={styles.section}>
                    <BalanceCard />
                </View>

                {/* ── Recent Activity ───────────────────────────────────── */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <TouchableOpacity
                        style={styles.seeAllBtn}
                        onPress={() => setShowAllTx(true)}
                        activeOpacity={0.75}
                    >
                        <Text style={styles.seeAllText}>See all</Text>
                        <Ionicons name="chevron-forward" size={14} color={C.accentLight} />
                    </TouchableOpacity>
                </View>

                {/* Inline recent transaction rows */}
                <View style={styles.txCard}>
                    {recentTransactions.length === 0 ? (
                        <View style={styles.txEmpty}>
                            <Ionicons name="receipt-outline" size={32} color={C.border} />
                            <Text style={styles.txEmptyText}>No transactions yet</Text>
                        </View>
                    ) : (
                        recentTransactions.map((tx, i) => (
                            <TransactionRow key={tx.id || i} item={tx} />
                        ))
                    )}
                </View>

                {/* ── Spending Overview ─────────────────────────────────── */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Spending Overview</Text>
                </View>
                <View style={styles.section}>
                    <SpendingOverView />
                </View>

                {/* Spacer for bottom nav */}
                <View style={{ height: 90 }} />
            </ScrollView>

            {/* ── Bottom Navigation ─────────────────────────────────────── */}
            <BottomNavigation />

            {/* ── All Transactions Modal ────────────────────────────────── */}
            <AllTransactionsModal
                visible={showAllTx}
                onClose={() => setShowAllTx(false)}
                transactions={transactions}
            />
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: C.bg,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 16 : 8,
    },

    // ── Top bar ──────────────────────────────────────────────────────────────
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: C.accent + '60',
    },
    userTexts: {
        gap: 2,
    },
    greeting: {
        fontSize: 17,
        fontWeight: '700',
        color: C.textPrimary,
        letterSpacing: -0.3,
    },
    tagline: {
        fontSize: 12,
        color: C.textMuted,
    },
    bellBtn: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: C.surface,
        borderWidth: 1,
        borderColor: C.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bellDot: {
        position: 'absolute',
        top: 8,
        right: 9,
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: C.expense,
        borderWidth: 1.5,
        borderColor: C.bg,
    },

    // ── Section layout ───────────────────────────────────────────────────────
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: C.textPrimary,
        letterSpacing: -0.3,
    },
    seeAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: C.surface,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: C.border,
    },
    seeAllText: {
        fontSize: 13,
        fontWeight: '600',
        color: C.accentLight,
    },

    // ── Transaction card ─────────────────────────────────────────────────────
    txCard: {
        backgroundColor: C.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: C.border,
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 4,
        marginBottom: 24,
    },
    txEmpty: {
        alignItems: 'center',
        paddingVertical: 28,
        gap: 8,
    },
    txEmptyText: {
        fontSize: 14,
        color: C.textMuted,
    },
});