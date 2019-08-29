package org.greatpisces.support.response;

import java.util.List;
import org.greatpisces.support.response.ApiResponse.Status;
import org.greatpisces.support.response.ApiResponse.ApiError;

public class ListApiResponse {
	
	private final Status status;
	private final List<Object> data;
	private final ApiError error;
	private final int pageNumber;
	private final String nextPage;
	private final long total;
	
	public ListApiResponse(Status status, List<Object> data, 
			ApiError error, int pageNumber, String nextPage, long total) {
		this.status = status;
		this.data = data;
		this.error = error;
		this.pageNumber = pageNumber;
		this.nextPage = nextPage;
		this.total = total;
	}

	public Status getStatus() {
		return status;
	}

	public List<Object> getData() {
		return data;
	}

	public ApiError getError() {
		return error;
	}

	public int getPageNumber() {
		return pageNumber;
	}

	public String getNextPage() {
		return nextPage;
	}

	public long getTotal() {
		return total;
	}

}
