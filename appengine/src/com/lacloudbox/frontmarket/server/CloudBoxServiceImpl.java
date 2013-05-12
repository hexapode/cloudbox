package com.lacloudbox.frontmarket.server;

import java.util.List;
import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;
import javax.jdo.Query;
import com.google.gwt.user.server.rpc.RemoteServiceServlet;
import com.lacloudbox.frontmarket.client.CloudBoxService;
import com.lacloudbox.frontmarket.shared.CloudBoxServiceException;
import com.lacloudbox.frontmarket.shared.FieldVerifier;

@SuppressWarnings("serial")
public class CloudBoxServiceImpl extends RemoteServiceServlet implements CloudBoxService
{
	private static final PersistenceManagerFactory	PMF	= JDOHelper.getPersistenceManagerFactory("transactions-optional");

	@Override
	public String retrieveIpFromName(String boxName) throws IllegalArgumentException, CloudBoxServiceException
	{
		String ret = null;

		if (!FieldVerifier.isValidName(boxName))
		{
			throw new IllegalArgumentException(FieldVerifier.INVALID_NAME);
		}

		PersistenceManager pm = getPersistenceManager();
		try
		{
			Query q = pm.newQuery(BoxInfos.class, "name == boxName");
			q.declareParameters("java.lang.String boxName");
			q.setOrdering("lastUpdateDate");
			List<BoxInfos> boxes = (List<BoxInfos>) q.execute(boxName);

			if ((boxes != null) && (boxes.size() > 0))
			{
				BoxInfos box = boxes.get(boxes.size() - 1);
				if (box != null)
				{
					ret = box.getIp();
					if (!FieldVerifier.isValidIp(ret))
					{
						throw new CloudBoxServiceException("We have a problem with your box. Unplug and replug it, then try again.");
					}
				}
			}
			else
			{
				throw new CloudBoxServiceException("We do not know that box. If you just plugged your box, try again in a few seconds.");
			}
		}
		catch (Exception e)
		{
			if (e instanceof CloudBoxServiceException)
			{
				throw e;
			}
			throw new CloudBoxServiceException("It seems we have a problem. Please try again later");
//			throw new CloudBoxServiceException(e.getMessage());
		}
		finally
		{
			pm.close();
		}

		return ret;
	}

	private PersistenceManager getPersistenceManager()
	{
		return PMF.getPersistenceManager();
	}
}
