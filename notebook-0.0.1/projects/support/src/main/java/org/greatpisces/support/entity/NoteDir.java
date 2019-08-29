package org.greatpisces.support.entity;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.greatpisces.support.util.FileUtil;
import org.greatpisces.support.util.JsonUtil;
import org.springframework.beans.BeanUtils;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

public class NoteDir {

    private static final Log logger = LogFactory.getLog(NoteDir.class);

    private List<NoteDirItem> items;

    private String fileName;

    public NoteDir() {
        items = new LinkedList<NoteDirItem>();
    }

    public NoteDir(String fileName) throws IOException {
        this.fileName = fileName;
        String value = FileUtil.readerFile(fileName);
        items = new LinkedList<NoteDirItem>(JsonUtil.parseToList(value, NoteDirItem.class));
    }

    private void save() {
        try {
            FileUtil.writeFile(this.fileName, JsonUtil.gson.toJson(this.items));
        } catch (Exception e) {
            logger.error(e);
        }
    }

    private int getIndex() {
        if(this.items.size() != 0) {
            return this.items.get(this.items.size() - 1).getId() + 1;
        } else {
            return 1;
        }
    }

    public synchronized NoteDirItem addItem(String title) {
        NoteDirItem item = new NoteDirItem(this.getIndex(), title);
        if(this.items.add(item)) {
            this.save();
            return item;
        } else {
            return null;
        }
    }

    public synchronized NoteDirItem updateItem(NoteDirItem noteDirItem) {
        NoteDirItem item = this.getItem(noteDirItem.getId());
        if(item != null) {
            BeanUtils.copyProperties(noteDirItem, item, new String[] {"files"});
            this.save();
        }
        return item;
    }

    public synchronized boolean deleteItem(int id) {
        for(NoteDirItem item : this.items) {
            if(item.getId() == id) {
                this.items.remove(item);
                this.save();
                return true;
            }
        }
        return false;
    }

    public NoteDirItem getItem(int id) {
        for(NoteDirItem item : this.items) {
            if(item.getId() == id) {
                return item;
            }
        }
        return null;
    }

    public boolean addFile(int id, String file) {
        NoteDirItem item = this.getItem(id);
        if(item != null && item.addFile(file)) {
            this.save();
            return true;
        }
        return false;
    }

    public boolean removeFile(int id, String file) {
        NoteDirItem item = this.getItem(id);
        if(item != null && item.removeFile(file)) {
            this.save();
            return true;
        }
        return false;
    }

    public List<NoteDirItem> getItems() {
        return items;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
