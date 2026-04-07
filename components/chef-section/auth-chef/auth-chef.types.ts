// components/chef-section/auth-chef/auth-chef.types.ts

export interface ChefAuthLoginContent {
  title: string;
  usernameLabel: string;
  passwordLabel: string;
  submitLabel: string;
  imageAlt: string;
  imagePath: string;
}

export interface ChefAuthFormState {
  username: string;
  password: string;
}

export interface ChefAuthHeroProps {
  imagePath: string;
  imageAlt: string;
}

export interface ChefAuthCardProps {
  content: ChefAuthLoginContent;
}

export interface ChefAuthInputFieldProps {
  id: string;
  name: string;
  type: "text" | "password";
  autoComplete: string;
  label: string;
  placeholder: string;
  className?: string;
}
