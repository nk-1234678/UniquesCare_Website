import { request } from "./httpClient";

export const authApi = {
  getCurrentUser: () => request({ url: "/auth/me" }),
  login: (payload) => request({ url: "/auth/login", method: "POST", data: payload }),
  register: (payload) => request({ url: "/auth/register", method: "POST", data: payload }),
  logout: () => request({ url: "/auth/logout", method: "POST" }),
  refresh: () => request({ url: "/auth/refresh", method: "POST" }),
  updateProfile: (payload) => request({ url: "/auth/profile", method: "PUT", data: payload }),
  getUsers: () => request({ url: "/auth/users" }),
  getStudents: () => request({ url: "/auth/students" }),
  getTechnicians: () => request({ url: "/auth/technicians" }),
  getStudentDetail: (id) => request({ url: `/auth/students/${id}` }),
  getTechnicianDetail: (id) => request({ url: `/auth/technicians/${id}` }),
  blockStudent: (id, isActive) => request({ url: `/auth/students/${id}/block`, method: "PUT", data: { isActive } }),
  blockTechnician: (id, isActive) => request({ url: `/auth/technicians/${id}/block`, method: "PUT", data: { isActive } }),
};
