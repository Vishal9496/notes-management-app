import api from "./api";

export async function fetchNotes() {
  const { data } = await api.get("/notes");
  return data;
}

export async function createNote({ title, content }) {
  const { data } = await api.post("/notes", {
    title,
    content,
  });
  return data;
}

export async function updateNote(id, { title, content }) {
  const { data } = await api.put(`/notes/${id}`, {
    title,
    content,
  });
  return data;
}

export async function deleteNote(id) {
  await api.delete(`/notes/${id}`);
}