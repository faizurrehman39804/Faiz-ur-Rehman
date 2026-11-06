import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPKR,
  numberToWordsPKR,
  calculateInstallmentSchedule,
  calculateKycProgress,
  calculateCommissionSplit,
  formatArea
} from './formatters';

test('formatPKR correctly formats Crore and Lakh in English and Urdu', () => {
  // English
  assert.equal(formatPKR(15000000, 'en'), 'Rs 1.5 Crore');
  assert.equal(formatPKR(8500000, 'en'), 'Rs 85 Lakh');
  assert.equal(formatPKR(45000, 'en'), 'Rs 45,000');

  // Urdu
  assert.equal(formatPKR(15000000, 'ur'), '1.5 کروڑ روپے');
  assert.equal(formatPKR(8500000, 'ur'), '85 لاکھ روپے');
});

test('numberToWordsPKR converts amount for official receipts', () => {
  assert.equal(numberToWordsPKR(15000000), 'Rupees One Crore Fifty Lakh Only');
  assert.equal(numberToWordsPKR(750000), 'Rupees Seven Lakh Fifty Thousand Only');
});

test('calculateInstallmentSchedule generates accurate split and dates', () => {
  const schedule = calculateInstallmentSchedule(10000000, 2000000, 4, 'quarterly', '2026-01-01');
  assert.equal(schedule.length, 4);
  assert.equal(schedule[0].amountPkr, 2000000); // (1 Cr - 20 Lakh) / 4 = 20 Lakh each
  assert.equal(schedule[0].status, 'pending');
});

test('calculateKycProgress sums up weighted verification scores', () => {
  assert.equal(calculateKycProgress({ cnicVerified: true, photoVerified: false, sourceOfFundsVerified: false }), 40);
  assert.equal(calculateKycProgress({ cnicVerified: true, photoVerified: true, sourceOfFundsVerified: true }), 100);
});

test('calculateCommissionSplit calculates agent and company cuts', () => {
  // 1 Crore deal with 1% total commission, 50% agent cut
  const result = calculateCommissionSplit(10000000, 1, 50);
  assert.equal(result.totalCommission, 100000);
  assert.equal(result.agentAmount, 50000);
  assert.equal(result.companyAmount, 50000);
});

test('formatArea handles Marla and Kanal conversions', () => {
  assert.equal(formatArea(20, 'kanal', 'en'), '1 Kanal');
  assert.equal(formatArea(10, 'marla', 'en'), '10 Marla');
  assert.equal(formatArea(10, 'marla', 'ur'), '10 مرلہ');
});
