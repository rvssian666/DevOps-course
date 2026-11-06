import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRegistration, filterUsers, updateUserRecord, User } from './store';

const sampleUsers: User[] = [
  {
    id: 7,
    username: 'admin_vp',
    userEmail: 'admin@hkhinfo.com',
    primaryOccupation: 'DevOps Architect',
    skills: 'Docker Kubernetes AWS'
  },
  {
    id: 8,
    username: 'Abrar Nirban',
    userEmail: 'abrar.nirban74@gmail.com',
    primaryOccupation: 'Software Engineer',
    skills: 'Java HTML CSS'
  }
];

test('validateRegistration catches short username, duplicate username, and mismatched passwords', () => {
  const errShort = validateRegistration(
    { username: 'abc', userEmail: 'test@example.com', password: 'password123', passwordConfirm: 'password123' },
    ['admin_vp']
  );
  assert.equal(errShort.username, 'Please use between 6 and 32 characters.');

  const errDup = validateRegistration(
    { username: 'ADMIN_VP', userEmail: 'test@example.com', password: 'password123', passwordConfirm: 'password123' },
    ['admin_vp']
  );
  assert.equal(errDup.username, 'Someone already has that username.');

  const errMismatch = validateRegistration(
    { username: 'newuser1', userEmail: 'test@example.com', password: 'password123', passwordConfirm: 'different123' },
    ['admin_vp']
  );
  assert.equal(errMismatch.passwordConfirm, "These passwords don't match.");
});

test('validateRegistration passes valid user input', () => {
  const errors = validateRegistration(
    { username: 'devops_pro', userEmail: 'pro@hkhinfo.com', password: 'securePass99', passwordConfirm: 'securePass99' },
    ['admin_vp']
  );
  assert.deepEqual(errors, {});
});

test('filterUsers filters by search query and occupation', () => {
  const bySkill = filterUsers(sampleUsers, 'kubernetes', 'all');
  assert.equal(bySkill.length, 1);
  assert.equal(bySkill[0].username, 'admin_vp');

  const byRole = filterUsers(sampleUsers, '', 'software engineer');
  assert.equal(byRole.length, 1);
  assert.equal(byRole[0].username, 'Abrar Nirban');
});

test('updateUserRecord updates specified fields while preserving untouched ones', () => {
  const updated = updateUserRecord(sampleUsers[0], {
    skills: 'Terraform Ansible AWS',
    workingExperience: '12'
  });
  assert.equal(updated.username, 'admin_vp');
  assert.equal(updated.skills, 'Terraform Ansible AWS');
  assert.equal(updated.workingExperience, '12');
});
