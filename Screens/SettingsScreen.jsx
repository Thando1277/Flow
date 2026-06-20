import {
    StyleSheet, Text, View, TouchableOpacity, ScrollView,
    SafeAreaView, StatusBar, Platform, Switch, Alert, Image
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import BottomNavigation from '../Components/BottomNavigation';

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

const SettingRow = ({ icon, iconColor = C.accentLight, label, sublabel, onPress, rightEl, last = false }) => (
    <TouchableOpacity
        style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: C.border }]}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
        disabled={!onPress && !rightEl}
    >
        <View style={[styles.rowIcon, { backgroundColor: iconColor + '18', borderColor: iconColor + '35' }]}>
            <Ionicons name={icon} size={18} color={iconColor} />
        </View>
        <View style={styles.rowText}>
            <Text style={styles.rowLabel}>{label}</Text>
            {sublabel ? <Text style={styles.rowSublabel}>{sublabel}</Text> : null}
        </View>
        {rightEl !== undefined
            ? rightEl
            : <Ionicons name="chevron-forward" size={16} color={C.border} />}
    </TouchableOpacity>
);

const SectionHeader = ({ title }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
);

const SettingsScreen = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    const [notificationsOn, setNotificationsOn] = useState(true);
    const [biometricOn, setBiometricOn]         = useState(false);
    const [darkMode, setDarkMode]               = useState(true);
    const [budgetAlerts, setBudgetAlerts]       = useState(true);

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out', style: 'destructive',
                onPress: async () => {
                    try { await signOut(auth); }
                    catch (e) { Alert.alert('Error', e.message); }
                }
            }
        ]);
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This will permanently delete your account and all data. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => {} }
            ]
        );
    };

    const toggle = (val, setter) => (
        <Switch
            value={val}
            onValueChange={setter}
            trackColor={{ false: C.border, true: C.accent + '80' }}
            thumbColor={val ? C.accentLight : C.textMuted}
            ios_backgroundColor={C.border}
        />
    );

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={C.bg} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* Profile card */}
                <TouchableOpacity style={styles.profileCard} activeOpacity={0.8}>
                    <Image
                        source={require('../assets/linkedin profile.jpg')}
                        style={styles.avatar}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.displayName || 'Your Name'}</Text>
                        <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
                        <View style={styles.profileBadge}>
                            <Ionicons name="shield-checkmark" size={11} color={C.income} />
                            <Text style={styles.profileBadgeText}>Verified account</Text>
                        </View>
                    </View>
                    <View style={styles.profileArrow}>
                        <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
                    </View>
                </TouchableOpacity>

                {/* Account */}
                <SectionHeader title="Account" />
                <View style={styles.group}>
                    <SettingRow icon="person-outline"     iconColor={C.accentLight} label="Edit Profile"    sublabel="Update your name and photo"   onPress={() => {}} />
                    <SettingRow icon="lock-closed-outline" iconColor={C.warn}       label="Change Password" sublabel="Last changed 30 days ago"      onPress={() => {}} />
                    <SettingRow icon="mail-outline"        iconColor={C.accentLight} label="Email Address"  sublabel={user?.email || '—'}            onPress={() => {}} last />
                </View>

                {/* Preferences */}
                <SectionHeader title="Preferences" />
                <View style={styles.group}>
                    <SettingRow icon="notifications-outline" iconColor={C.income}      label="Push Notifications" sublabel="Transaction alerts"        rightEl={toggle(notificationsOn, setNotificationsOn)} />
                    <SettingRow icon="finger-print-outline"  iconColor={C.accentLight}  label="Biometric Login"    sublabel="Face ID / Fingerprint"     rightEl={toggle(biometricOn, setBiometricOn)} />
                    <SettingRow icon="moon-outline"          iconColor="#A89CFF"         label="Dark Mode"                                               rightEl={toggle(darkMode, setDarkMode)} />
                    <SettingRow icon="wallet-outline"        iconColor={C.warn}          label="Budget Alerts"      sublabel="Warn when near limit"      rightEl={toggle(budgetAlerts, setBudgetAlerts)} last />
                </View>

                {/* Finance */}
                <SectionHeader title="Finance" />
                <View style={styles.group}>
                    <SettingRow icon="cash-outline"      iconColor={C.income}      label="Currency"             sublabel="South African Rand (ZAR)"  onPress={() => {}} />
                    <SettingRow icon="calendar-outline"  iconColor={C.accentLight}  label="Budget Cycle"         sublabel="Monthly — resets 1st"      onPress={() => {}} />
                    <SettingRow icon="pie-chart-outline" iconColor={C.warn}         label="Spending Categories"  sublabel="Manage your categories"    onPress={() => {}} last />
                </View>

                {/* Data & Privacy */}
                <SectionHeader title="Data & Privacy" />
                <View style={styles.group}>
                    <SettingRow icon="download-outline"      iconColor={C.accentLight} label="Export Transactions" sublabel="Download as CSV" onPress={() => {}} />
                    <SettingRow icon="shield-outline"        iconColor={C.income}       label="Privacy Policy"                               onPress={() => {}} />
                    <SettingRow icon="document-text-outline" iconColor={C.textMuted}    label="Terms of Service"                             onPress={() => {}} last />
                </View>

                {/* Support */}
                <SectionHeader title="Support" />
                <View style={styles.group}>
                    <SettingRow icon="help-circle-outline" iconColor={C.accentLight} label="Help & FAQ"        onPress={() => {}} />
                    <SettingRow icon="chatbubble-outline"  iconColor={C.income}       label="Contact Support"  sublabel="We usually reply within 24h" onPress={() => {}} last />
                </View>

                {/* App info */}
                <View style={styles.appInfo}>
                    <Text style={styles.appName}>MoneyTrack</Text>
                    <Text style={styles.appVersion}>Version 1.0.0</Text>
                </View>

                {/* Sign out */}
                <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
                    <Ionicons name="log-out-outline" size={19} color={C.expense} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                {/* Delete account */}
                <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount} activeOpacity={0.8}>
                    <Text style={styles.deleteText}>Delete Account</Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>

            <BottomNavigation />
        </SafeAreaView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: C.bg },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 16 : 8,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
    },
    headerTitle: { fontSize: 26, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.5 },
    scroll: { flex: 1 },
    scrollContent: { padding: 20 },

    // Profile
    profileCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: C.surface, borderRadius: 20,
        borderWidth: 1.5, borderColor: C.accent + '40',
        padding: 16, marginBottom: 28, gap: 14,
    },
    avatar: { width: 56, height: 56, borderRadius: 16, borderWidth: 2, borderColor: C.accent + '60' },
    profileInfo: { flex: 1, gap: 3 },
    profileName: { fontSize: 17, fontWeight: '700', color: C.textPrimary, letterSpacing: -0.3 },
    profileEmail: { fontSize: 12, color: C.textMuted },
    profileBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    profileBadgeText: { fontSize: 11, color: C.income, fontWeight: '600' },
    profileArrow: {
        width: 30, height: 30, borderRadius: 9,
        backgroundColor: C.elevated, justifyContent: 'center', alignItems: 'center',
    },

    // Section header
    sectionHeader: {
        fontSize: 11, fontWeight: '700', color: C.textMuted,
        textTransform: 'uppercase', letterSpacing: 1.2,
        marginBottom: 8, marginLeft: 4,
    },

    // Group & rows
    group: {
        backgroundColor: C.surface, borderRadius: 18,
        borderWidth: 1, borderColor: C.border,
        paddingHorizontal: 16, marginBottom: 24,
    },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 13 },
    rowIcon: { width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
    rowText: { flex: 1 },
    rowLabel: { fontSize: 15, fontWeight: '600', color: C.textPrimary },
    rowSublabel: { fontSize: 12, color: C.textMuted, marginTop: 1 },

    // App info
    appInfo: { alignItems: 'center', gap: 3, marginBottom: 20 },
    appName: { fontSize: 14, fontWeight: '700', color: C.textMuted, letterSpacing: 0.5 },
    appVersion: { fontSize: 12, color: C.border },

    // Sign out
    signOutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: C.expense + '12', borderWidth: 1.5, borderColor: C.expense + '35',
        borderRadius: 16, height: 52, marginBottom: 12,
    },
    signOutText: { fontSize: 16, fontWeight: '700', color: C.expense },

    // Delete
    deleteBtn: { alignItems: 'center', paddingVertical: 12 },
    deleteText: { fontSize: 13, color: C.textMuted, textDecorationLine: 'underline' },
});