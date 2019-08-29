package org.greatpisces.support.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {

    public static String getTimestamp() {
        return new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
    }
}
