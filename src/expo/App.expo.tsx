/**
 * COIN FLIP - Premium Coin Flip Mobile App
 * Single File React Native & Expo App
 *
 * Features:
 * - Strictly mobile app UI with modern light luxury aesthetic
 * - 3D coin spin physics via React Native's Animated API & Easing
 * - Authentic 24K Gold Coin with curved rim text:
 *     - "★ LIBERTY ★" curved on top rim of Heads
 *     - "IN GOD WE TRUST • 2026" curved on bottom rim of Heads
 *     - "UNITED STATES OF AMERICA" curved on top rim of Tails
 *     - "★ E PLURIBUS UNUM • TEN DOLLARS ★" curved on bottom rim of Tails
 * - Flashing streak counter at the bottom that pulses when hitting 3 in a row
 * - Winning celebration banner and haptic fanfare after 3 strikes
 *
 * Requirements:
 * npx create-expo-app CoinFlip
 * cd CoinFlip
 * npx expo install react-native-svg
 * (Replace App.js or App.tsx with this code and run: npx expo start)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Vibration,
  Platform,
  Modal,
} from 'react-native';
import Svg, { Defs, Path, Circle, Text as SvgText, TextPath, RadialGradient, Stop, G } from 'react-native-svg';

const { width } = Dimensions.get('window');
const COIN_SIZE = Math.min(width * 0.58, 220);

type CoinSide = 'heads' | 'tails';

export default function App() {
  const [result, setResult] = useState<CoinSide>('heads');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [streakSide, setStreakSide] = useState<CoinSide | null>(null);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [totalFlips, setTotalFlips] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Animated values for the coin
  const spinValue = useRef(new Animated.Value(0)).current;
  const heightValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const shadowValue = useRef(new Animated.Value(1)).current;

  // Animated values for celebration modal
  const celebScaleAnim = useRef(new Animated.Value(0.6)).current;

  // Animated values for the streak counter flash
  const flashAnim = useRef(new Animated.Value(1)).current;
  const streakScaleAnim = useRef(new Animated.Value(1)).current;
  const flashLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Trigger flashing loop when streak hits 3 or more
  useEffect(() => {
    if (streak >= 3) {
      if (Platform.OS !== 'web') {
        Vibration.vibrate([0, 70, 50, 100, 50, 150]);
      }

      Animated.sequence([
        Animated.timing(streakScaleAnim, {
          toValue: 1.12,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(streakScaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();

      flashLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(flashAnim, {
            toValue: 0.3,
            duration: 280,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(flashAnim, {
            toValue: 1,
            duration: 280,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      flashLoopRef.current.start();
    } else {
      if (flashLoopRef.current) {
        flashLoopRef.current.stop();
        flashLoopRef.current = null;
      }
      flashAnim.setValue(1);
      streakScaleAnim.setValue(1);
    }

    return () => {
      if (flashLoopRef.current) {
        flashLoopRef.current.stop();
      }
    };
  }, [streak]);

  const flipCoin = () => {
    if (isFlipping) return;

    setIsFlipping(true);

    if (Platform.OS !== 'web') {
      Vibration.vibrate(40);
    }

    const nextSide: CoinSide = Math.random() < 0.5 ? 'heads' : 'tails';
    const turns = 6;
    const targetDegrees = turns * 360 + (nextSide === 'heads' ? 0 : 180);

    spinValue.setValue(0);

    Animated.parallel([
      Animated.timing(spinValue, {
        toValue: targetDegrees,
        duration: 1300,
        easing: Easing.bezier(0.18, 0.82, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(heightValue, {
          toValue: -130,
          duration: 580,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(heightValue, {
          toValue: 0,
          duration: 720,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.15,
          duration: 580,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 720,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(shadowValue, {
          toValue: 0.3,
          duration: 580,
          useNativeDriver: true,
        }),
        Animated.timing(shadowValue, {
          toValue: 1,
          duration: 720,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setResult(nextSide);
      setIsFlipping(false);

      let newStreak = 1;
      if (streakSide === nextSide) {
        newStreak = streak + 1;
      }
      setStreak(newStreak);
      setStreakSide(nextSide);
      setBestStreak((prev) => Math.max(prev, newStreak));
      setTotalFlips((prev) => prev + 1);

      // Winning celebration modal on hitting 3 in a row
      if (newStreak === 3) {
        setShowCelebration(true);
        Animated.spring(celebScaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }).start();
      }

      if (Platform.OS !== 'web') {
        Vibration.vibrate(30);
      }
    });
  };

  const resetGame = () => {
    setStreak(0);
    setStreakSide(null);
    setTotalFlips(0);
    setResult('heads');
    setShowCelebration(false);
    spinValue.setValue(0);
  };

  const headsRotate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const tailsRotate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['180deg', '540deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF9" />

      {/* Top Mobile Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>COIN FLIP</Text>
          <Text style={styles.appSubtitle}>PREMIUM GOLD COIN</Text>
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame} activeOpacity={0.7}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Ribbon */}
      <View style={styles.statsRibbon}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>FLIPS</Text>
          <Text style={styles.statValue}>{totalFlips}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>BEST STREAK</Text>
          <Text style={styles.statValue}>{bestStreak}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>CURRENT</Text>
          <Text style={[styles.statValue, { color: '#B45309' }]}>
            {streakSide ? `${streakSide.toUpperCase()} ×${streak}` : '—'}
          </Text>
        </View>
      </View>

      {/* Main Flip Stage */}
      <View style={styles.stage}>
        <View style={styles.ambientAura} />

        <Animated.View
          style={[
            styles.floorShadow,
            {
              opacity: shadowValue,
              transform: [
                {
                  scaleX: shadowValue.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [1.3, 1],
                  }),
                },
                {
                  scaleY: shadowValue.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [0.6, 1],
                  }),
                },
              ],
            },
          ]}
        />

        <TouchableOpacity activeOpacity={0.9} onPress={flipCoin} disabled={isFlipping}>
          <Animated.View
            style={[
              styles.coinWrapper,
              {
                transform: [
                  { translateY: heightValue },
                  { scale: scaleValue },
                ],
              },
            ]}
          >
            {/* FRONT FACE (HEADS - Real 24K Gold Coin with Curved Text) */}
            <Animated.View
              style={[
                styles.coinFace,
                styles.headsFace,
                { transform: [{ perspective: 1200 }, { rotateX: headsRotate }] },
              ]}
            >
              <Svg width={COIN_SIZE} height={COIN_SIZE} viewBox="0 0 200 200">
                <Defs>
                  <Path id="headsTopArc" d="M 28 100 A 72 72 0 1 1 172 100" />
                  <Path id="headsBottomArc" d="M 32 100 A 68 68 0 0 0 168 100" />
                  <RadialGradient id="headsGrad" cx="35%" cy="30%" r="65%">
                    <Stop offset="0%" stopColor="#FEF08A" />
                    <Stop offset="45%" stopColor="#F59E0B" />
                    <Stop offset="75%" stopColor="#D97706" />
                    <Stop offset="100%" stopColor="#92400E" />
                  </RadialGradient>
                </Defs>

                <Circle cx="100" cy="100" r="95" fill="url(#headsGrad)" stroke="#FCD34D" strokeWidth="4" />
                <Circle cx="100" cy="100" r="82" fill="none" stroke="rgba(254, 240, 138, 0.6)" strokeWidth="1.5" strokeDasharray="2.5, 3" />
                <Circle cx="100" cy="100" r="56" fill="#FBBF24" stroke="rgba(120, 53, 15, 0.4)" strokeWidth="1.5" />

                {/* Curved Text: LIBERTY */}
                <SvgText fill="#78350F" fontSize="12" fontWeight="900" letterSpacing="4">
                  <TextPath href="#headsTopArc" startOffset="50%">
                    ★ LIBERTY ★
                  </TextPath>
                </SvgText>

                {/* Curved Text: IN GOD WE TRUST • 2026 */}
                <SvgText fill="#78350F" fontSize="8.5" fontWeight="900" letterSpacing="2">
                  <TextPath href="#headsBottomArc" startOffset="50%">
                    IN GOD WE TRUST • 2026
                  </TextPath>
                </SvgText>

                {/* Center Bust & HEADS Label */}
                <G transform="translate(100, 88)">
                  <Path d="M0 -16 L2 -11 L6 -10 L3 -6 L4 -2 L0 -4 L-4 -2 L-3 -6 L-6 -10 L-2 -11 Z" fill="#78350F" />
                  <Circle cx="0" cy="-2" r="9" fill="#78350F" />
                </G>
                <SvgText x="100" y="126" textAnchor="middle" fill="#78350F" fontSize="14" fontWeight="900" letterSpacing="2.5">
                  HEADS
                </SvgText>
              </Svg>
            </Animated.View>

            {/* BACK FACE (TAILS - Authentic Bald Eagle with Curved Text) */}
            <Animated.View
              style={[
                styles.coinFace,
                styles.tailsFace,
                { transform: [{ perspective: 1200 }, { rotateX: tailsRotate }] },
              ]}
            >
              <Svg width={COIN_SIZE} height={COIN_SIZE} viewBox="0 0 200 200">
                <Defs>
                  <Path id="tailsTopArc" d="M 24 100 A 76 76 0 1 1 176 100" />
                  <Path id="tailsBottomArc" d="M 30 100 A 70 70 0 0 0 170 100" />
                  <RadialGradient id="tailsGrad" cx="40%" cy="35%" r="65%">
                    <Stop offset="0%" stopColor="#FEF08A" />
                    <Stop offset="50%" stopColor="#D97706" />
                    <Stop offset="80%" stopColor="#B45309" />
                    <Stop offset="100%" stopColor="#78350F" />
                  </RadialGradient>
                </Defs>

                <Circle cx="100" cy="100" r="95" fill="url(#tailsGrad)" stroke="#FCD34D" strokeWidth="4" />
                <Circle cx="100" cy="100" r="82" fill="none" stroke="rgba(254, 240, 138, 0.6)" strokeWidth="1.5" strokeDasharray="2.5, 3" />
                <Circle cx="100" cy="100" r="56" fill="#D97706" stroke="rgba(120, 53, 15, 0.4)" strokeWidth="1.5" />

                {/* Curved Text: UNITED STATES OF AMERICA */}
                <SvgText fill="#FEF08A" fontSize="9.2" fontWeight="900" letterSpacing="1.8">
                  <TextPath href="#tailsTopArc" startOffset="50%">
                    UNITED STATES OF AMERICA
                  </TextPath>
                </SvgText>

                {/* Curved Text: E PLURIBUS UNUM • TEN DOLLARS */}
                <SvgText fill="#FEF08A" fontSize="8" fontWeight="900" letterSpacing="1.6">
                  <TextPath href="#tailsBottomArc" startOffset="50%">
                    ★ E PLURIBUS UNUM • TEN DOLLARS ★
                  </TextPath>
                </SvgText>

                {/* Center Eagle & TAILS Label */}
                <G transform="translate(100, 88)">
                  <Path d="M0 -14 C-4 -11, -12 -7, -16 2 C-12 3, -7 4, -3 0 L-2 7 L0 4 L2 7 L3 0 C7 4, 12 3, 16 2 C12 -7, 4 -11, 0 -14 Z" fill="#FEF08A" />
                </G>
                <SvgText x="100" y="126" textAnchor="middle" fill="#FEF08A" fontSize="14" fontWeight="900" letterSpacing="2.5">
                  TAILS
                </SvgText>
              </Svg>
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>

        <Text style={styles.resultBanner}>
          {isFlipping ? 'In the air...' : result.toUpperCase()}
        </Text>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.flipButton, isFlipping && styles.flipButtonDisabled]}
          onPress={flipCoin}
          disabled={isFlipping}
          activeOpacity={0.85}
        >
          <Text style={styles.flipButtonText}>
            {isFlipping ? 'FLIPPING...' : 'FLIP COIN'}
          </Text>
        </TouchableOpacity>

        {/* STREAK COUNTER AT BOTTOM (Flashes when 3 in a row!) */}
        <Animated.View
          style={[
            styles.streakContainer,
            streak >= 3 && styles.streakContainerActive,
            {
              transform: [{ scale: streakScaleAnim }],
              opacity: streak >= 3 ? flashAnim : 1,
            },
          ]}
        >
          <View style={styles.streakHeaderRow}>
            <Text style={styles.streakFlameIcon}>{streak >= 3 ? '🔥' : '⚡'}</Text>
            <Text style={[styles.streakHeading, streak >= 3 && styles.streakHeadingHighlight]}>
              {streak >= 3
                ? `HOT STREAK! ${streak} ${streakSide?.toUpperCase()} IN A ROW!`
                : streak > 0
                ? `Current Streak: ${streak} ${streakSide?.toUpperCase()}`
                : 'Flip to start a streak!'}
            </Text>
          </View>

          <View style={styles.beadsRow}>
            {[1, 2, 3].map((step) => {
              const isFilled = streak >= step;
              return (
                <View
                  key={step}
                  style={[
                    styles.bead,
                    isFilled && styles.beadActive,
                    streak >= 3 && styles.beadFire,
                  ]}
                >
                  <Text style={[styles.beadText, isFilled && styles.beadTextActive]}>
                    {step}
                  </Text>
                </View>
              );
            })}
            {streak > 3 && (
              <View style={[styles.bead, styles.beadFire, styles.beadExtra]}>
                <Text style={styles.beadTextActive}>+{streak - 3}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </View>

      {/* 3-IN-A-ROW WINNING CELEBRATION MODAL */}
      <Modal visible={showCelebration} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <Animated.View
            style={[
              styles.celebrationCard,
              { transform: [{ scale: celebScaleAnim }] },
            ]}
          >
            <Text style={styles.celebEmoji}>🏆</Text>
            <Text style={styles.celebTag}>STREAK MILESTONE</Text>
            <Text style={styles.celebTitle}>3 IN A ROW!</Text>
            <Text style={styles.celebDesc}>
              Amazing streak! The counter at the bottom is now flashing on fire!
            </Text>
            <TouchableOpacity
              style={styles.celebButton}
              onPress={() => setShowCelebration(false)}
            >
              <Text style={styles.celebButtonText}>KEEP PLAYING</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAF9',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 32 : 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1917',
    letterSpacing: 2.5,
  },
  appSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A8A29E',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  resetButton: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#F5F5F4',
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#57534E',
  },
  statsRibbon: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 14,
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0EFEA',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#78716C',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1917',
    marginTop: 3,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F5F5F4',
    height: '70%',
    alignSelf: 'center',
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 20,
    height: COIN_SIZE + 80,
  },
  ambientAura: {
    position: 'absolute',
    width: COIN_SIZE * 1.4,
    height: COIN_SIZE * 1.4,
    borderRadius: (COIN_SIZE * 1.4) / 2,
    backgroundColor: '#FEF3C7',
    opacity: 0.5,
  },
  floorShadow: {
    position: 'absolute',
    bottom: 24,
    width: COIN_SIZE * 0.72,
    height: 22,
    borderRadius: 15,
    backgroundColor: 'rgba(28, 25, 23, 0.16)',
  },
  coinWrapper: {
    width: COIN_SIZE,
    height: COIN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinFace: {
    position: 'absolute',
    width: COIN_SIZE,
    height: COIN_SIZE,
    borderRadius: COIN_SIZE / 2,
    backfaceVisibility: 'hidden',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  headsFace: {
    backgroundColor: '#F59E0B',
    borderRadius: COIN_SIZE / 2,
  },
  tailsFace: {
    backgroundColor: '#D97706',
    borderRadius: COIN_SIZE / 2,
  },
  resultBanner: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: '800',
    color: '#44403C',
    letterSpacing: 2,
  },
  bottomSection: {
    gap: 12,
  },
  flipButton: {
    backgroundColor: '#1C1917',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 36,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  flipButtonDisabled: {
    backgroundColor: '#A8A29E',
  },
  flipButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FAFAF9',
    letterSpacing: 1.8,
  },
  streakContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: '#E7E5E4',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  streakContainerActive: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderWidth: 2,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  streakHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakFlameIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  streakHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#44403C',
    letterSpacing: 0.5,
  },
  streakHeadingHighlight: {
    color: '#B45309',
    fontWeight: '800',
  },
  beadsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bead: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D6D3D1',
  },
  beadActive: {
    backgroundColor: '#E7E5E4',
    borderColor: '#A8A29E',
  },
  beadFire: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  beadExtra: {
    paddingHorizontal: 6,
  },
  beadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A8A29E',
  },
  beadTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  celebrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  celebEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  celebTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 1.5,
  },
  celebTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1C1917',
    marginTop: 4,
  },
  celebDesc: {
    fontSize: 12,
    color: '#78716C',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  celebButton: {
    backgroundColor: '#1C1917',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  celebButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1.5,
  },
});
