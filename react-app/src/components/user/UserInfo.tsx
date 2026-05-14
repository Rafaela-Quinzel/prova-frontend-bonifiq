import type { User } from '../../types';
import './UserInfo.css';

interface UserInfoProps {
  user: User;
}

export const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className="user-info-container">
      <h2 className="user-name">{user.name}</h2>
      <div className="user-email">
        <strong>E-mail:</strong> {user.email}
      </div>
    </div>
  );
};
