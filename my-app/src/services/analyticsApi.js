// services/analyticsApi.js
import api from "../utils/api";
export const getMaintenanceCollection = () =>
  api.get("/api/analytics/maintenance-collection");

export const getComplaintCategories = () =>
  api.get("/api/analytics/complaints-by-category");

export const getAmenityPeakHours = () =>
  api.get("/api/analytics/amenity-peak-hours");

export const getVisitorTrends = () => api.get("/api/analytics/visitor-trends");
