package com.vishal.studentmanagement.service.impl;

import com.vishal.studentmanagement.dto.NoteRequest;
import com.vishal.studentmanagement.entity.Note;
import com.vishal.studentmanagement.entity.User;
import com.vishal.studentmanagement.repository.NoteRepository;
import com.vishal.studentmanagement.repository.UserRepository;
import com.vishal.studentmanagement.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Note createNote(NoteRequest request) {
        User currentUser = getAuthenticatedUser();

        Note note = Note.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(currentUser)
                .build();

        return noteRepository.save(note);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Note> getMyNotes() {
        User currentUser = getAuthenticatedUser();
        return noteRepository.findByUserOrderByCreatedAtDesc(currentUser);
    }

    @Override
    @Transactional
    public Note updateNote(Long id, NoteRequest request) {
        User currentUser = getAuthenticatedUser();

        Note note = noteRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException(
                        "Note not found with id: " + id
                ));

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());

        return noteRepository.save(note);
    }

    @Override
    @Transactional
    public void deleteNote(Long id) {
        User currentUser = getAuthenticatedUser();

        if (!noteRepository.existsByIdAndUser(id, currentUser)) {
            throw new RuntimeException("Note not found with id: " + id);
        }

        noteRepository.deleteByIdAndUser(id, currentUser);
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Authenticated user not found with email: " + email
                ));
    }
}