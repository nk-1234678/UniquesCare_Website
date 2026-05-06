import { request } from "./httpClient";

export const complaintApi = {
  getComplaints: (params = {}) => request({ url: "/complaints", params: { limit: 0, ...params } }),
  createComplaint: (payload) => request({ url: "/complaints", method: "POST", data: payload }),
  updateComplaint: (id, payload) => request({ url: `/complaints/${id}`, method: "PUT", data: payload }),
  deleteComplaint: (id) => request({ url: `/complaints/${id}`, method: "DELETE" }),
  getNotifications: () => request({ url: "/notifications" }),
  dismissNotification: (id) => request({ url: `/notifications/${id}/dismiss`, method: "POST" }),
};
