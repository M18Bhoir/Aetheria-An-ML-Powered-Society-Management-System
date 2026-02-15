import api from "../utils/api";

export const ticketService = {
  getAll: async () => {
    const response = await api.get("/api/tickets/user");
    return response.data;
  },
  create: async (ticketData) => {
    const response = await api.post("/api/tickets", ticketData);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/tickets/${id}`);
    return response.data;
  },
  addComment: async (ticketId, message) => {
    const response = await api.post(`/api/tickets/comment`, {
      ticketId,
      message,
    });
    return response.data;
  },
};
