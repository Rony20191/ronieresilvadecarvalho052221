package com.group.music_catalog_manage.infrastructure.web.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.List;
import com.group.music_catalog_manage.application.exceptions.*;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ArtistNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleArtistNotFound(ArtistNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(AlbumNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleAlbumNotFound(AlbumNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }


    @ExceptionHandler(NoHandlerFoundException.class)
    public void rethrow(NoHandlerFoundException ex) throws NoHandlerFoundException {
        throw ex;
    }


    private ResponseEntity<ApiErrorResponse> build(
            HttpStatus status,
            String message) {
        return build(status, message, null);
    }

    private ResponseEntity<ApiErrorResponse> build(
            HttpStatus status,
            String message,
            List<String> details) {
        ApiErrorResponse response = new ApiErrorResponse(
                status.value(),
                message,
                details,
                Instant.now());
        return ResponseEntity.status(status).body(response);
    }
}
