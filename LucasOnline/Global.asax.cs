using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace LucasOnline
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            Exception exception = Server.GetLastError();
            Response.Clear();

            HttpException httpException = exception as HttpException;

            if (httpException != null)
            {
                string action = "";
                switch (httpException.GetHttpCode())
                {
                    case 404:
                        action = "Index";
                        break;
                    case 500:
                        action = "HttpError500";
                        break;
                    default:
                        action = "General";
                        break;
                }

                Server.ClearError();

                Response.Redirect(String.Format("~/#!/home"));
            }
        }
    }
}
