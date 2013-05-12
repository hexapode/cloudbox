package com.lacloudbox.frontmarket.client;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;
import com.lacloudbox.frontmarket.shared.CloudBoxServiceException;

@RemoteServiceRelativePath("cloudbox")
public interface CloudBoxService extends RemoteService
{
	String retrieveIpFromName(String name) throws IllegalArgumentException, CloudBoxServiceException;
}
