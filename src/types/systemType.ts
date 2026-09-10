export interface IMenuItem {
  label: string | React.ReactNode;
  value: string | number;
  disabled?: boolean;
  group?: string;
}
