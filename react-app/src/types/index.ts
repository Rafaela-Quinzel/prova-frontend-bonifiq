// User type from JSONPlaceholder API
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  username?: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// Post type from JSONPlaceholder API
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

// Widget state type
export interface WidgetState {
  user: User | null;
  posts: Post[];
  loading: boolean;
  error: string | null;
}

// PostMessage event payload
export interface PostMessagePayload {
  type: 'GET_USER_ID' | 'USER_ID_RESPONSE';
  userId?: number;
}
