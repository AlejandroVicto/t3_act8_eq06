const authService = {
  async login({ username, password }) {
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Usuario o contraseña incorrectos.');
    }

    return data; // Retorna id, username, firstName, lastName, image, accessToken, etc.
  },
};

export default authService;