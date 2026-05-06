import { useMemo } from "react";

export const useUserProfile = (user) => {
  return useMemo(() => {
    const safeUser = user && typeof user === "object" ? user : null;
    const displayName = safeUser?.name || "User";
    const normalizedRole = String(safeUser?.role || "student").trim().toLowerCase();

    const roleLabelMap = {
      admin: "Administrator",
      technician: "Technician",
      student: "Student",
    };

    const displayRole =
      roleLabelMap[normalizedRole] ||
      (normalizedRole
        ? `${normalizedRole.charAt(0).toUpperCase()}${normalizedRole.slice(1)}`
        : "Student");

    const initials = displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

    return {
      displayName,
      normalizedRole,
      displayRole,
      initials,
    };
  }, [user]);
};
