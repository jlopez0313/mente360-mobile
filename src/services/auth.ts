import { baseApi } from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPayload {
  email: string;
}

export const login = async (formData: LoginPayload) => {
  const { post } = await baseApi();
  return post('/login', formData, { 'Content-type': 'application/json' });
};

export const register = async (formData: RegisterPayload) => {
  const { post } = await baseApi();
  return post('/register', formData, { 'Content-type': 'application/json' });
};

export const reset = async (formData: ResetPayload) => {
  const { post } = await baseApi();
  return post('/reset', formData, { 'Content-type': 'application/json' });
};
