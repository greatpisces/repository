package org.greatpisces.support.entity;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.greatpisces.support.util.DateUtil;
import org.greatpisces.support.util.FileUtil;

public class NoteRepo {

    private static final Log logger = LogFactory.getLog(NoteRepo.class);

    private String repository;

    public NoteRepo(String repository) {
        this.repository = repository;
    }

    public String createFile(String pack, String type, String value) {
        String filePath = new StringBuilder(repository).append('/').append(pack).append('/').toString();
        String fileName = new StringBuilder(DateUtil.getTimestamp()).append('.').append(type).toString();
        try {
            FileUtil.createFile(filePath, fileName, value);
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
        return new StringBuilder("/").append(pack).append('/').append(fileName).toString();
    }

    public boolean updateFile(String fileName, String value) {
        String filePath = new StringBuilder(repository).append(fileName).toString();
        try {
            FileUtil.writeFile(filePath, value);
        } catch (Exception e) {
            logger.error(e);
            return false;
        }
        return true;
    }
}
