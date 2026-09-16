const APPLICATION_KEY = "fxdc_workshop_application_id";

export function saveWorkshopApplicationId(id: string) {
  sessionStorage.setItem(APPLICATION_KEY, id);
}

export function getWorkshopApplicationId() {
  return sessionStorage.getItem(APPLICATION_KEY) ?? "";
}

export function programCheckoutPath(courseId: string, isLoggedIn: boolean) {
  if (courseId === "enhancement") return "/#courses";
  if (isLoggedIn) return `/checkout/${courseId}`;
  return `/workshop?course=${encodeURIComponent(courseId)}`;
}

export function workshopEntryPath(isLoggedIn: boolean) {
  return isLoggedIn ? "/account" : "/workshop";
}

export function toolsEntryPath(isLoggedIn: boolean) {
  return isLoggedIn ? "/account" : "/trading-tools";
}
