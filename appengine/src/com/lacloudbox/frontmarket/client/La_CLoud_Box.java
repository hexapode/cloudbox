package com.lacloudbox.frontmarket.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.lacloudbox.frontmarket.shared.FieldVerifier;

public class La_CLoud_Box implements EntryPoint
{
	private final CloudBoxServiceAsync	greetingService	= GWT.create(CloudBoxService.class);

	private Button						sendButton		= new Button("Send");
	private TextBox						nameField		= new TextBox();
	private Label						errorLabel		= new Label();

	@Override
	public void onModuleLoad()
	{
		RootPanel.get("nameFieldContainer").add(this.nameField);
		RootPanel.get("sendButtonContainer").add(this.sendButton);
		RootPanel.get("errorLabelContainer").add(this.errorLabel);

		this.nameField.setText("BoxName");
		this.nameField.setFocus(true);
		this.nameField.selectAll();

		this.sendButton.addStyleName("sendButton");

		this.sendButton.addClickHandler(new ClickHandler()
		{

			@Override
			public void onClick(ClickEvent event)
			{
				sendNameToServer();
			}
		});
		this.nameField.addKeyUpHandler(new KeyUpHandler()
		{

			@Override
			public void onKeyUp(KeyUpEvent event)
			{
				if (event.getNativeKeyCode() == KeyCodes.KEY_ENTER)
				{
					sendNameToServer();
				}
			}
		});
	}

	private void sendNameToServer()
	{
		this.errorLabel.setText("");
		String textToServer = this.nameField.getText();
		if (!FieldVerifier.isValidName(textToServer))
		{
			this.errorLabel.setText(FieldVerifier.INVALID_NAME);
			return;
		}

		this.sendButton.setEnabled(false);
		this.nameField.setEnabled(false);
		this.greetingService.retrieveIpFromName(textToServer, new AsyncCallback<String>()
		{
			@Override
			public void onFailure(Throwable caught)
			{
				La_CLoud_Box.this.errorLabel.setText(caught.getMessage());
				La_CLoud_Box.this.sendButton.setEnabled(true);
				La_CLoud_Box.this.nameField.setEnabled(true);
				La_CLoud_Box.this.nameField.setFocus(true);
				La_CLoud_Box.this.nameField.selectAll();
			}

			@Override
			public void onSuccess(String ip)
			{
//				La_CLoud_Box.this.sendButton.setEnabled(true);
//				La_CLoud_Box.this.nameField.setEnabled(true);
//				Window.Location.assign(Window.Location.createUrlBuilder().setParameter("log_level", "TRACE").buildString());

//				if (!FieldVerifier.isValidIp(ip))
//				{
//					La_CLoud_Box.this.errorLabel.setText(FieldVerifier.INVALID_IP);
//					return;
//				}
				Window.Location.assign("http://" + ip + "/");
			}
		});
	}
}
