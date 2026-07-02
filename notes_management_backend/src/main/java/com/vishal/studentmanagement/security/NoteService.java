package com.vishal.studentmanagement.service;

import com.vishal.studentmanagement.dto.NoteRequest;
import com.vishal.studentmanagement.entity.Note;

import java.util.List;

public interface NoteService {

    Note createNote(NoteRequest request);

    List<Note> getMyNotes();

    Note updateNote(Long id, NoteRequest request);

    void deleteNote(Long id);
}