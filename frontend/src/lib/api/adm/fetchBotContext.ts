export const fetchContext = async (context:string) => {
  try {

    const result = await fetch(`http://localhost:3000/auth/admin/context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ context }),
    });
    return result.json();
  } catch (error) {
    return error;
  }
}