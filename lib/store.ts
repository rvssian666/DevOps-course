export interface User {
  id: number;
  username: string;
  userEmail: string;
  password?: string;
  passwordConfirm?: string;
  profileImg?: string | null;
  profileImgPath?: string | null;
  dateOfBirth?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
  gender?: string | null;
  maritalStatus?: string | null;
  permanentAddress?: string | null;
  tempAddress?: string | null;
  primaryOccupation?: string | null;
  secondaryOccupation?: string | null;
  skills?: string | null;
  phoneNumber?: string | null;
  secondaryPhoneNumber?: string | null;
  nationality?: string | null;
  language?: string | null;
  workingExperience?: string | null;
}

export interface PostItem {
  id: number;
  author: string;
  authorRole: string;
  avatar: string;
  createdAt: string;
  category: 'Architecture' | 'CI/CD' | 'Culture';
  title: string;
  body: string;
  image?: string;
  tags: string[];
  likes: number;
  comments: { author: string; avatar: string; text: string; time: string }[];
}

export function validateRegistration(
  input: { username?: string; userEmail?: string; password?: string; passwordConfirm?: string },
  existingUsernames: string[]
): Record<string, string> {
  const errors: Record<string, string> = {};
  const username = (input.username || '').trim();
  const userEmail = (input.userEmail || '').trim();
  const password = (input.password || '').trim();
  const passwordConfirm = (input.passwordConfirm || '').trim();

  if (!userEmail || !userEmail.includes('@')) {
    errors.userEmail = 'Please enter a valid email address.';
  }

  if (!username) {
    errors.username = 'This field is required.';
  } else if (username.length < 6 || username.length > 32) {
    errors.username = 'Please use between 6 and 32 characters.';
  } else if (existingUsernames.some((u) => u.toLowerCase() === username.toLowerCase())) {
    errors.username = 'Someone already has that username.';
  }

  if (!password) {
    errors.password = 'This field is required.';
  } else if (password.length < 8 || password.length > 32) {
    errors.password = 'Try one with at least 8 characters.';
  }

  if (passwordConfirm !== password) {
    errors.passwordConfirm = "These passwords don't match.";
  }

  return errors;
}

export function filterUsers(users: User[], query: string, roleFilter: string): User[] {
  const q = (query || '').trim().toLowerCase();
  const rf = (roleFilter || 'all').trim().toLowerCase();

  return users.filter((u) => {
    const matchesQuery =
      !q ||
      u.username.toLowerCase().includes(q) ||
      (u.userEmail || '').toLowerCase().includes(q) ||
      (u.skills || '').toLowerCase().includes(q) ||
      (u.primaryOccupation || '').toLowerCase().includes(q) ||
      String(u.id) === q;

    const matchesRole =
      rf === 'all' ||
      (u.primaryOccupation || '').toLowerCase().includes(rf);

    return matchesQuery && matchesRole;
  });
}

export function updateUserRecord(user: User, form: Partial<User>): User {
  return {
    ...user,
    username: form.username ? form.username.trim() : user.username,
    userEmail: form.userEmail ?? user.userEmail,
    dateOfBirth: form.dateOfBirth ?? user.dateOfBirth,
    fatherName: form.fatherName ?? user.fatherName,
    motherName: form.motherName ?? user.motherName,
    gender: form.gender ?? user.gender,
    language: form.language ?? user.language,
    maritalStatus: form.maritalStatus ?? user.maritalStatus,
    nationality: form.nationality ?? user.nationality,
    permanentAddress: form.permanentAddress ?? user.permanentAddress,
    tempAddress: form.tempAddress ?? user.tempAddress,
    phoneNumber: form.phoneNumber ?? user.phoneNumber,
    secondaryPhoneNumber: form.secondaryPhoneNumber ?? user.secondaryPhoneNumber,
    primaryOccupation: form.primaryOccupation ?? user.primaryOccupation,
    secondaryOccupation: form.secondaryOccupation ?? user.secondaryOccupation,
    skills: form.skills ?? user.skills,
    workingExperience: form.workingExperience ?? user.workingExperience,
  };
}
