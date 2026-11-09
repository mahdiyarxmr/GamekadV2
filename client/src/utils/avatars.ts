export interface AvatarPreset {
  id: string;
  name: string;
  url: string;
  category: 'club' | 'member' | 'rokad';
}

export const OFFICIAL_AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'game-club', name: 'کلاب بازی (Game Club)', url: '/profiles/Game Club.jpg', category: 'club' },
  { id: 'boy', name: 'پسر رُکادی (Boy)', url: '/profiles/Boy.png', category: 'member' },
  { id: 'girl', name: 'دختر رُکادی (Girl)', url: '/profiles/Girl.jpg', category: 'member' },
  { id: 'studio', name: 'استودیو بازی و طراحی', url: '/profiles/Studio.jpg', category: 'club' },
  { id: 'academy', name: 'آکادمی مهارتی رُکاد', url: '/profiles/Academy.jpg', category: 'rokad' },
  { id: 'school', name: 'هنرستان استارتاپی رُکاد', url: '/profiles/School.jpg', category: 'rokad' },
  { id: 'institute', name: 'اندیشکده نوآوری رُکاد', url: '/profiles/Institute.jpg', category: 'rokad' },
];

export function getRandomAvatarPreset(): string {
  const randomIndex = Math.floor(Math.random() * OFFICIAL_AVATAR_PRESETS.length);
  return OFFICIAL_AVATAR_PRESETS[randomIndex].url;
}
