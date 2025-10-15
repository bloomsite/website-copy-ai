import apiClient from "../../services/apiClient";

interface TokenInfo {
  has_auth_header: boolean;
  auth_header: string;
  token_valid: boolean;
  token_error?: string;
  token_user_id?: number;
  token_exp?: number;
  token_type?: string;
  token_jti?: string;
  token_iat?: number;
  token_user_exists?: boolean;
  token_user_data?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    role: string;
    is_active: boolean;
  };
}

interface UserInfo {
  is_authenticated: boolean;
  is_anonymous: boolean;
  username: string;
  user_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined?: string;
  last_login?: string;
}

interface AuthStatusResponse {
  timestamp: string;
  request_info: {
    method: string;
    path: string;
    user_agent: string;
    remote_addr: string;
  };
  session_info: {
    session_key?: string;
    session_data: Record<string, any>;
    is_empty: boolean;
  };
  user_info: UserInfo;
  token_info: TokenInfo;
  cookies: {
    csrftoken: string;
    sessionid: string;
    all_cookies: string[];
  };
  csrf_info: {
    csrf_token: string;
    csrf_processing_view: boolean;
  };
  permissions_info: {
    view_permission_classes: string[];
    user_permissions: string[];
    user_groups: string[];
  };
  environment_info: {
    debug_mode: boolean;
    jwt_access_token_lifetime: string;
    jwt_refresh_token_lifetime: string;
    cors_allow_all_origins: boolean;
    cors_allow_credentials: boolean;
  };
}

const useAuthStatus = () => {
  const fetchAuthStatus = async (): Promise<AuthStatusResponse | null> => {
    try {
      const response = await apiClient.get<AuthStatusResponse>("api/users/me/");
      console.log("Full auth status:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching auth status:", error);
      return null;
    }
  };

  const testAuthStatusWithPost = async (
    testData: any = {}
  ): Promise<AuthStatusResponse | null> => {
    try {
      const response = await apiClient.post<AuthStatusResponse>(
        "api/users/me/",
        testData
      );
      console.log("Full auth status (POST):", response.data);
      return response.data;
    } catch (error) {
      console.error("Error testing auth status with POST:", error);
      return null;
    }
  };

  return {
    fetchAuthStatus,
    testAuthStatusWithPost,
  };
};

export default useAuthStatus;
