export interface SignUpFormData {
  email: string;
  password: string;
}

export interface SignUpFormInput extends SignUpFormData {
  confirmPassword: string;
}
