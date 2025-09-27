export let loginAdmin = async (
  email: string,
  password: string
): Promise<[number, string]> => {
  if (email === "admin@example.com" && password === "admin123") {
    return [200, "Login bem-sucedido"];
  }
  return [401, "Credenciais inválidas"];
};
