package org.greatpisces.support.entity;

import java.util.LinkedList;
import java.util.List;

public class NoteDirItem {

    private Integer id;

    private String title;

    private List<String> files;

    public NoteDirItem() {}

    public NoteDirItem(Integer id, String title) {
        this.id = id;
        this.title = title;
        this.files = new LinkedList<String>();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getFiles() {
        return files;
    }

    public void setFiles(List<String> files) {
        this.files = files;
    }

    public boolean addFile(String file) {
        return this.files.add(file);
    }

    public boolean removeFile(String file) {
        return this.files.remove(file);
    }

    public void clearFile() {
        this.files.clear();
    }
}
