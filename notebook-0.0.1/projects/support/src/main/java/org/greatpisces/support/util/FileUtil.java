package org.greatpisces.support.util;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.*;

public class FileUtil {

    private static final Log logger = LogFactory.getLog(FileUtil.class);

    public static void createFile(String filePath, String fileName, String value) throws IOException {

        File file = new File(filePath);
        file.mkdirs();

        OutputStream outputStream = new FileOutputStream(filePath + fileName);

        Writer writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.append(value);

        writer.close();
        outputStream.close();
    }

    public static void writeFile(String fileName, String value) throws IOException {
        OutputStream outputStream = new FileOutputStream(fileName);

        Writer writer = new OutputStreamWriter(outputStream, "UTF-8");
        writer.append(value);

        writer.close();
        outputStream.close();
    }

    public static String readerFile(String fileName) throws IOException {
        InputStream inputStream = new FileInputStream(fileName);
        Reader reader = new InputStreamReader(inputStream, "UTF-8");
        StringBuffer sb = new StringBuffer();
        while (reader.ready()) {
            sb.append((char) reader.read());
        }

        reader.close();
        inputStream.close();

        return sb.toString();
    }
}
