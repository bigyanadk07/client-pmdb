// src/types/api.ts
export interface ErrorResponse {
    message: string;
    errors?: Array<{
      value: string;
      msg: string;
      param: string;
      location: string;
    }>;
  }
  
  export interface AuthResponse {
    _id: string;
    username: string;
    email: string;
    token: string;
    message?: string;
  }