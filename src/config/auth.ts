/**
 * Mock authentication configuration for the CoreHR demo.
 * In a real application, this would not exist on the frontend,
 * and authentication would be handled securely by a backend service.
 */
export const DEMO_HR_CREDENTIALS = {
  email: 'hr@corehr.io',
  password: 'admin'
};

// Keys used for local mock persistence
export const AUTH_STORAGE_KEY = 'corehr_auth_session';
