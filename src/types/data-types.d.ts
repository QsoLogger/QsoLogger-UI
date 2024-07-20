export interface ListOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export type Options = ListOption[];
export type DateTime = string;

export interface DataRow {
  id?: number | null;
  createdAt?: DateTime;
  updatedAt?: DateTime;
}


export type Bool = boolean | 0 | 1 | null | undefined;

export interface UserItem extends DataRow {
  name: string;
  email: string;
  passwd: string;
  status: number;
  group: number;
}
