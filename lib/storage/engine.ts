export interface UserData {
  username: string;
  balance: number;
  bets: Array<{
    id: string;
    game: string;
    amount: number;
    result: string;
    payout: number;
    date: string;
  }>;
  createdAt: string;
}

export const getCurrentUser = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nplus_current_user');
};

export const setCurrentUser = (username: string) => {
  localStorage.setItem('nplus_current_user', username);
};

export const getUserData = (username: string): UserData | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(`nplus_user_${username}`);
  if (!data) return null;
  return JSON.parse(data);
};

export const saveUserData = (username: string, data: UserData) => {
  localStorage.setItem(`nplus_user_${username}`, JSON.stringify(data));
};

export const createUser = (username: string): UserData => {
  const user: UserData = {
    username,
    balance: 1000,
    bets: [],
    createdAt: new Date().toISOString(),
  };
  saveUserData(username, user);
  return user;
};

export const placeBetLocal = (username: string, game: string, amount: number, betData: any): { success: boolean; newBalance: number } => {
  const user = getUserData(username);
  if (!user) throw new Error('User not found');
  if (user.balance < amount) throw new Error('Insufficient balance');
  user.balance -= amount;
  saveUserData(username, user);
  return { success: true, newBalance: user.balance };
};

export const settleBetLocal = (username: string, game: string, amount: number, result: string, payout: number): { newBalance: number } => {
  const user = getUserData(username);
  if (!user) throw new Error('User not found');
  user.balance += payout;
  user.bets.push({
    id: `${game}_${Date.now()}`,
    game,
    amount,
    result,
    payout,
    date: new Date().toISOString(),
  });
  saveUserData(username, user);
  return { newBalance: user.balance };
};
