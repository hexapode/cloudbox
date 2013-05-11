package com.lacloudbox.frontmarket.client;

import com.google.gwt.user.client.rpc.AsyncCallback;
import com.lacloudbox.frontmarket.shared.CloudBoxServiceException;

public interface CloudBoxServiceAsync
{
	void retrieveIpFromName(String input, AsyncCallback<String> callback) throws IllegalArgumentException, CloudBoxServiceException;
}
