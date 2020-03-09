using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using ScanWeb.Models;
using System.Configuration;
using ModelHelper;
using ModelDatabase;
using System.Net;
using System.Net.Sockets;
using Newtonsoft.Json;
using System.Text;
using System.Web.Hosting;
using System.IO;
using ModelHelper.Common;

namespace ScanWeb.Common
{
    public class CommonAuthen : AuthorizeAttribute
    {
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            if (filterContext.HttpContext.Session[Constants.SessionLogin] == null)
            {
                if (filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    filterContext.HttpContext.Response.StatusCode = 403;
                }
                else
                {
                    string SessionCurrent = string.Empty;
                    if (filterContext.HttpContext.Request.Cookies["SessionId_LoginUser"] != null)
                        SessionCurrent = filterContext.HttpContext.Request.Cookies["SessionId_LoginUser"].Value;
                    if (string.IsNullOrEmpty(SessionCurrent))
                    {
                        filterContext.Result = new RedirectToRouteResult(
                                        new RouteValueDictionary
                                       {
                                   {"action", "Login" },
                                   {"controller", "Account" }
                                       });
                    }
                    else
                    {
                        var resultSession = APIHelper.CallAPI<JsonResultObject<SYS_USER>>("user/queryloginSession", new
                        {
                            SessionId = SessionCurrent
                        });
                        if (resultSession.IsOk)
                        {
                            filterContext.HttpContext.Session[Constants.SessionLogin] = ConvertHelper.Current.ConvertObjToObj<LoginUserMobile,SYS_USER>(resultSession.dataObj);
                        }
                        else
                        {
                            filterContext.Result = new RedirectToRouteResult(
                                            new RouteValueDictionary
                                           {
                                   {"action", "Login" },
                                   {"controller", "Account" }
                                           });
                        }
                    }
                }
            }

        }
    }
}