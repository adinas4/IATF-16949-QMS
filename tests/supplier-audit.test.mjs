import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore, canFinalize, grade } from '../src/components/supplier/model.ts';
const answer = (score, action = '') => ({ question: 'Kontrol proses', score, evidence: 'Rekaman diperiksa', action });
const audit = answers => ({ id: 'test', supplier: 'Supplier A', date: '2026-09-09', auditor: 'Auditor', department: 'Quality Assurance', status: 'Draft', answers, updatedAt: '' });
test('score includes zero and excludes N/A and unanswered items', () => {
 assert.equal(calculateScore([answer('4'), answer('0'), answer('NA'), answer('')]), 50);
 assert.equal(calculateScore([answer('NA')]), null);
 assert.equal(calculateScore([answer('4'), answer('3'), answer('3')]), 83);
});
test('finalization requires complete evidence, applicable scores and corrective actions', () => {
 assert.equal(canFinalize(audit([answer('4'), answer('NA')])), true);
 assert.equal(canFinalize(audit([answer('NA')])), false);
 assert.equal(canFinalize(audit([answer('4'), answer('')])), false);
 assert.equal(canFinalize(audit([answer('0')])), false);
 assert.equal(canFinalize(audit([answer('0', 'Perbaiki proses; PIC QA; target 20 September')])), true);
 assert.equal(canFinalize(audit([{ ...answer('4'), evidence: ' ' }])), false);
 assert.equal(canFinalize(audit([answer('5')])), false);
});
test('grade boundaries', () => {
 assert.match(grade(85), /^A/); assert.match(grade(84), /^B/);
 assert.match(grade(70), /^B/); assert.match(grade(69), /^C/);
});
