import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  date_joined: string;
  last_login: string | null;
}

interface UseUsersOptions {
  role?: string;
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export function useUsers(options: UseUsersOptions = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {};
        if (options.role) params.role = options.role;
        if (options.id) params.id = options.id;
        if (options.first_name) params.first_name = options.first_name;
        if (options.last_name) params.last_name = options.last_name;
        if (options.email) params.email = options.email;
        const res = await apiClient.get("/api/users/fetch/", { params });
        setUsers(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [options.first_name, options.email, options.last_name, options.role]);

  return { users, loading, error };
}
