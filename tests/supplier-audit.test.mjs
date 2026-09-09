import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateScore, canFinalize, grade, createAnswers, DEPARTMENTS } from '../src/components/supplier/model.ts';
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

test('each department gets an independent guided checklist', () => {
 assert.equal(DEPARTMENTS.length, 9);
 for (const department of DEPARTMENTS) {
  const first = createAnswers(department);
  assert.equal(first.length, 6);
  assert.ok(first.every(item => item.question && item.guidance && item.score === ''));
  first[0].score = '4';
  assert.equal(createAnswers(department)[0].score, '');
 }
});
test('new forms require audit details and assigned, dated corrective actions', () => {
 const current = { ...audit([answer('4')]), checklistVersion: 2, location: 'Plant 1', scope: 'Machining', supplierContact: 'Budi' };
 assert.equal(canFinalize(current), true);
 for (const key of ['location', 'scope', 'supplierContact']) assert.equal(canFinalize({ ...current, [key]: ' ' }), false);
 const lowScore = { ...answer('2', 'Perbaiki instruksi'), pic: 'Andi', dueDate: '2026-09-10' };
 assert.equal(canFinalize({ ...current, answers: [lowScore] }), true);
 for (const patch of [{ pic: '' }, { dueDate: '' }, { dueDate: '2026-09-08' }]) {
  assert.equal(canFinalize({ ...current, answers: [{ ...lowScore, ...patch }] }), false);
 }
 assert.equal(canFinalize({ ...current, answers: [answer('4'), answer('NA')] }), true);
});
