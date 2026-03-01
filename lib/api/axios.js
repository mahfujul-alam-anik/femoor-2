let mockServer;

const ensureMock = async () => {
  if (!mockServer && typeof window !== 'undefined') {
    const mockModule = await import('./mockServer');
    mockServer = mockModule.createMockServer();
  }
};

const request = async (method, url, options = {}) => {
  await ensureMock();
  return mockServer.handle({ method, url, ...options });
};

export const api = {
  get: (url, config) => request('GET', url, { config }),
  post: (url, data, config) => request('POST', url, { data, config }),
  patch: (url, data, config) => request('PATCH', url, { data, config }),
  delete: (url, config) => request('DELETE', url, { config })
};
