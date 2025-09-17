// src/api/endpoints.ts
export const API_PREFIX = '/api';

export const endpoints = {
  auth: {
    signup: `${API_PREFIX}/auth/signup`,
    login: `${API_PREFIX}/auth/login`,
    logout: `${API_PREFIX}/auth/logout`,
    session: `${API_PREFIX}/auth/session`,
  },
  stellarList: {
    base: `${API_PREFIX}/likes/rankings`,
    my: `${API_PREFIX}/stellar-systems/me`,
  },
  stellarSystem: {
    base: `${API_PREFIX}/stellar-systems`,
    byId: (id: string) => `${API_PREFIX}/stellar-systems/${id}`,
    clone: `${API_PREFIX}/stellar-systems/clone`,
  },
  follows: {
    base: `${API_PREFIX}/follows`,
  },
  user: {
    profile: `${API_PREFIX}/users/profile`,
    password: `${API_PREFIX}/users/password`,
    base: `${API_PREFIX}/users`,
    profileById: (id: string) => `${API_PREFIX}/users/${id}/profile`,
  },
} as const;
