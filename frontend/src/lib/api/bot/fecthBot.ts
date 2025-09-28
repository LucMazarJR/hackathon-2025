export const fetchChatBot = async (message: string) => {
  // const id = localStorage.getItem("ID");
  const id = 1;
  try {

    const history = localStorage.getItem("message");
    const result = await fetch(`http://localhost:3000/bot/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, history }),
    });

    return result.json();
  } catch (error) {
    return error;
  }
};

export const fetchChatBotWithDocument = async (message: string, file: File) => {
  const id = 1;
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('message', message);

    const result = await fetch(`http://localhost:3000/bot/${id}/document`, {
      method: "POST",
      body: formData,
    });

    return result.json();
  } catch (error) {
    return error;
  }
};
