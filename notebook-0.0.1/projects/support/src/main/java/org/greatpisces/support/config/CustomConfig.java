package org.greatpisces.support.config;

import org.greatpisces.support.entity.NoteDir;
import org.greatpisces.support.entity.NoteRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class CustomConfig {

    @Value("${note.dir.filepath}")
    private String dirPath;

    @Value("${note.file.repository}")
    private String repoPath;

    @Bean
    public NoteDir noteDir() throws IOException {
        return new NoteDir(dirPath);
    }

    @Bean
    public NoteRepo noteRepo() {
        return new NoteRepo(repoPath);
    }
}
