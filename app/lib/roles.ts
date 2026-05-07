export const ROLES = ["passenger", "driver"] as const;
export type Role = (typeof ROLES)[number];

const DEFAULT_ROLE: Role = "passenger";

export function parseRole(raw: string | null | undefined): Role {
  return (ROLES as readonly string[]).includes(raw ?? "")
    ? (raw as Role)
    : DEFAULT_ROLE;
}
