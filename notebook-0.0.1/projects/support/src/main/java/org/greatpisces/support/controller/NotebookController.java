package org.greatpisces.support.controller;

import org.greatpisces.support.entity.NoteDirItem;
import org.greatpisces.support.response.ApiResponse;
import org.greatpisces.support.response.ApiResponse.Status;
import org.greatpisces.support.response.ApiResponse.ApiError;
import org.greatpisces.support.service.NoteDirService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/notebook")
public class NotebookController {

    /*
    401, add failure
    402, update failure
    403, delete failure
    404, get failure
    405, add file failure
    406, update file failure
    407, delete file failure
    */
    private NoteDirService noteDirService;

    @Autowired
    public NotebookController(NoteDirService noteDirService) {
        this.noteDirService = noteDirService;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ApiResponse addNoteDirItem(@RequestBody NoteDirItem noteDirItem) {
        NoteDirItem item = noteDirService.save(noteDirItem);
        if(item == null) {
            return new ApiResponse(Status.ERROR, null, new ApiError(401, "the failure of add item!"));
        }
        return new ApiResponse(Status.OK, item);
    }

    @RequestMapping(value = "/update", method = RequestMethod.PUT)
    public ApiResponse updateNoteDirItem(@RequestBody NoteDirItem noteDirItem) {
        NoteDirItem item = noteDirService.save(noteDirItem);
        if(item == null) {
            return new ApiResponse(Status.ERROR, null, new ApiError(402, "the failure of update item!"));
        }
        return new ApiResponse(Status.OK, item);
    }

    @RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
    public ApiResponse deleteNoteDirItem(@PathVariable Integer id) {
        if(!noteDirService.delete(id)) {
            return new ApiResponse(Status.ERROR, null, new ApiError(403, "the failure of delete item!"));
        }
        return new ApiResponse(Status.OK, null);
    }

    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public ApiResponse getNoteDirItem() {
        return new ApiResponse(Status.OK, noteDirService.getAll());
    }

    @RequestMapping(value = "/addFile/{id}", method = RequestMethod.POST)
    public ApiResponse addNoteFile(@PathVariable Integer id, @RequestBody String value) {
        String file = noteDirService.addFile(id, value);
        if(file == null) {
            return new ApiResponse(Status.ERROR, null, new ApiError(405, "the failure of add file!"));
        }
        return new ApiResponse(Status.OK, file);
    }

    @RequestMapping(value = "/updateFile", method = RequestMethod.PUT)
    public ApiResponse updateNoteFile(@RequestBody Map<String, String> params) {
        String fileName = params.get("fileName");
        String value = params.get("value");
        if(!noteDirService.updateFile(fileName, value)) {
            return new ApiResponse(Status.ERROR, null, new ApiError(406, "the failure of update file!"));
        }
        return new ApiResponse(Status.OK, null);
    }

    @RequestMapping(value = "/deleteFile/{id}", method = RequestMethod.DELETE)
    public ApiResponse deleteNoteFile(@PathVariable Integer id, @RequestParam("fileName") String fileName) {
        if(!noteDirService.deleteFile(id, fileName)) {
            return new ApiResponse(Status.ERROR, null, new ApiError(407, "the failure of delete file!"));
        }
        return new ApiResponse(Status.OK, null);
    }

}
