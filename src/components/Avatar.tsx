import { getInitials, avatarColor } from '../utils';

interface AvatarProps {
  firstName: string;
  lastName: string;
  id: string;
  avatar?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-xl',
};

export default function Avatar({ firstName, lastName, id, avatar, size = 'md' }: AvatarProps) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={`${firstName} ${lastName}`}
        className={`${sizeMap[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-semibold text-neutral-700 shrink-0`}
      style={{ backgroundColor: avatarColor(id) }}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
}
