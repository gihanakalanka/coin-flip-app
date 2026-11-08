import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStreak, calculateStats, computeTargetAngle } from './coinLogic.ts';

test('first flip initializes streak of 1', () => {
  const result = calculateStreak(0, null, 'heads', 0);
  assert.equal(result.count, 1);
  assert.equal(result.side, 'heads');
  assert.equal(result.isThreeOrMore, false);
  assert.equal(result.hitThreeMilestone, false);
  assert.equal(result.bestStreak, 1);
});

test('two in a row increases streak without milestone', () => {
  const result = calculateStreak(1, 'heads', 'heads', 1);
  assert.equal(result.count, 2);
  assert.equal(result.isThreeOrMore, false);
  assert.equal(result.hitThreeMilestone, false);
});

test('three in a row triggers the three-in-a-row milestone and flashes', () => {
  const result = calculateStreak(2, 'heads', 'heads', 2);
  assert.equal(result.count, 3);
  assert.equal(result.isThreeOrMore, true);
  assert.equal(result.hitThreeMilestone, true);
  assert.equal(result.bestStreak, 3);
});

test('four in a row maintains three-or-more flag but milestone was already hit', () => {
  const result = calculateStreak(3, 'heads', 'heads', 3);
  assert.equal(result.count, 4);
  assert.equal(result.isThreeOrMore, true);
  assert.equal(result.hitThreeMilestone, false);
  assert.equal(result.bestStreak, 4);
});

test('opposite side resets streak to 1', () => {
  const result = calculateStreak(4, 'heads', 'tails', 4);
  assert.equal(result.count, 1);
  assert.equal(result.side, 'tails');
  assert.equal(result.isThreeOrMore, false);
  assert.equal(result.hitThreeMilestone, false);
  assert.equal(result.bestStreak, 4);
});

test('computeTargetAngle ensures exact face alignment', () => {
  const angleHeads = computeTargetAngle(0, 'heads', 4);
  assert.equal(angleHeads % 360, 0);

  const angleTails = computeTargetAngle(0, 'tails', 4);
  assert.equal(angleTails % 360, 180);

  const angleHeadsFromTails = computeTargetAngle(180, 'heads', 4);
  assert.equal(angleHeadsFromTails % 360, 0);
});

test('calculateStats computes counts and percentages accurately', () => {
  const mockHistory = [
    { id: '1', side: 'heads' as const, timestamp: 1, flipNumber: 1, streakCount: 1 },
    { id: '2', side: 'heads' as const, timestamp: 2, flipNumber: 2, streakCount: 2 },
    { id: '3', side: 'tails' as const, timestamp: 3, flipNumber: 3, streakCount: 1 },
    { id: '4', side: 'tails' as const, timestamp: 4, flipNumber: 4, streakCount: 2 },
  ];
  const stats = calculateStats(mockHistory);
  assert.equal(stats.total, 4);
  assert.equal(stats.headsCount, 2);
  assert.equal(stats.tailsCount, 2);
  assert.equal(stats.headsPercentage, 50);
  assert.equal(stats.tailsPercentage, 50);
});
