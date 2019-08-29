package org.greatpisces.support.service;

import org.greatpisces.support.entity.NoteDirItem;

import java.util.List;

public interface NoteDirService {

    public NoteDirItem save(NoteDirItem noteDirItem);

    public boolean delete(int id);

    public NoteDirItem get(int id);

    public List<NoteDirItem> getAll();

    public String addFile(int id, String value);

    public boolean updateFile(String fileName, String value);

    public boolean deleteFile(int id, String fileName);
}
