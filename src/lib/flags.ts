export type Plan = "basic" | "cms";

export const PLAN = (import.meta.env.PUBLIC_PLAN ?? "basic") as Plan;

export const CMS_ENABLED =
  PLAN === "cms" || import.meta.env.PUBLIC_ENABLE_CMS === "true";

export const UPLOAD_ENABLED = CMS_ENABLED;
export const ADMIN_LINK_ENABLED = false;
export const PHONE_BAR_ENABLED = CMS_ENABLED;
export const JSON_LD_EXTRA_ENABLED = CMS_ENABLED;
