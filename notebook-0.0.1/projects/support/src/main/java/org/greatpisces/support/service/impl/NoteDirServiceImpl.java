package org.greatpisces.support.service.impl;

import org.greatpisces.support.entity.NoteDir;
import org.greatpisces.support.entity.NoteDirItem;
import org.greatpisces.support.entity.NoteRepo;
import org.greatpisces.support.service.NoteDirService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteDirServiceImpl implements NoteDirService {

    private NoteDir noteDir;

    private NoteRepo noteRepo;

    @Autowired
    public NoteDirServiceImpl(NoteDir noteDir, NoteRepo noteRepo) {
        this.noteDir = noteDir;
        this.noteRepo = noteRepo;
    }

    public NoteDirItem add(NoteDirItem noteDirItem) {
        return noteDir.addItem(noteDirItem.getTitle());
    }

    public NoteDirItem update(NoteDirItem noteDirItem) {
        return noteDir.updateItem(noteDirItem);
    }

    //返回null时, 表示错误
    @Override
    public NoteDirItem save(NoteDirItem noteDirItem) {
        if(noteDirItem.getId() == null) {
            return this.add(noteDirItem);
        } else {
            return this.update(noteDirItem);
        }
    }

    @Override
    public boolean delete(int id) {
        return noteDir.deleteItem(id);
    }

    @Override
    public NoteDirItem get(int id) {
        return noteDir.getItem(id);
    }

    @Override
    public List<NoteDirItem> getAll() {
        return noteDir.getItems();
    }

    @Override
    public String addFile(int id, String value) {
        NoteDirItem item = noteDir.getItem(id);
        String file = noteRepo.createFile(item.getTitle(), "html", value);
        if(file != null) {
            noteDir.addFile(id, file);
            return file;
        }
        return null;
    }

    @Override
    public boolean updateFile(String fileName, String value) {
        return noteRepo.updateFile(fileName, value);
    }

    @Override
    public boolean deleteFile(int id, String fileName) {
        return noteDir.removeFile(id, fileName);
    }
}
