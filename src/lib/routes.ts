export const withBase = (path = "") => {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const normalized = path.replace(/^\//, "");
  return `${base}${normalized}`;
};

export const sceneRoutes = {
  ABOUT: withBase("about/"),
  RECORDS: withBase("records/"),
  CONTEST_CURRENT: withBase("contest/"),
  JOIN: withBase("join/"),
} as const;
