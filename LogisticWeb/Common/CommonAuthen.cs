using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using LogisticWeb.Models;
//using LogisticWeb.Services;
using System.Configuration;
using ModelHelper;
using ModelDatabase;
using NLog;
using System.Net;
using System.Net.Sockets;
using Newtonsoft.Json;
using System.Text;
using System.Web.Hosting;
using System.IO;
using WebRepositories.Interface;
using LogisticWeb.Controllers;

namespace LogisticWeb.Common
{
    public class CommonAuthen : AuthorizeAttribute
    {
        public ISecurityService _svcSecurity
        {
            get
            {
                return SecurityServiceHelper.Current;
            }
        }
        //private static readonly Logger Logger = NLog.LogManager.GetCurrentClassLogger();
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            #region test

            //if (filterContext.HttpContext.Session[Constants.SessionLogin] == null)
            //{
            //    if (filterContext.HttpContext.Request.IsAjaxRequest())
            //    {
            //        filterContext.HttpContext.Response.StatusCode = 403;
            //    }
            //    else
            //    {
            //        string SessionCurrent = string.Empty;
            //        if (filterContext.HttpContext.Request.Cookies["SessionId_LoginUser"] != null)
            //            SessionCurrent = filterContext.HttpContext.Request.Cookies["SessionId_LoginUser"].Value;
            //        if (string.IsNullOrEmpty(SessionCurrent))
            //        {
            //            filterContext.Result = new RedirectToRouteResult(
            //                            new RouteValueDictionary
            //                           {
            //                       {"action", "Login" },
            //                       {"controller", "Account" }
            //                           });
            //        }
            //        else
            //        {
            //            var resultSession = APIHelper.CallAPI<JsonResultObject<SYS_USER>>("user/queryloginSession", new
            //            {
            //                SessionId = SessionCurrent
            //            });
            //            if (resultSession.IsOk)
            //            {
            //                filterContext.HttpContext.Session[Constants.SessionLogin] = (SYS_USER)resultSession.dataObj;
            //            }
            //            else
            //            {
            //                filterContext.Result = new RedirectToRouteResult(
            //                                new RouteValueDictionary
            //                               {
            //                       {"action", "Login" },
            //                       {"controller", "Account" }
            //                               });
            //            }
            //        }
            //    }
            //}

            #endregion

            #region live

            if (ConfigurationManager.AppSettings["IpAccept"] != null)
            {
                var IPAllow = ConfigurationManager.AppSettings["IpAccept"].Split(';');
                var ClientIP = filterContext.HttpContext.Request.ServerVariables["REMOTE_ADDR"];
                bool IsDebug = ConfigurationManager.AppSettings["Debug"] == "1" ? true : false;
                if (IsDebug)
                {
                    File.WriteAllText(ConfigurationManager.AppSettings["Path"], "HTTP_X_FORWARDED_FOR_" + DateTime.Now.ToString("yyyyMMdd_HHmmssttt") + " - " + filterContext.HttpContext.Request.ServerVariables["HTTP_X_FORWARDED_FOR"]);
                    File.WriteAllText(ConfigurationManager.AppSettings["Path"], "REMOTE_ADDR_" + DateTime.Now.ToString("yyyyMMdd_HHmmssttt") + " - " + filterContext.HttpContext.Request.ServerVariables["REMOTE_ADDR"]);
                }
                int count = 0;
                for (var i = 0; i < IPAllow.Length; i++)
                {
                    if (IPAllow[i] == ClientIP)
                    {
                        count++;
                        break;
                    }
                }
                if (count == 0)
                {
                    var dataCheck = _svcSecurity.GetDataFromIP(ClientIP);
                    if (dataCheck == null)
                    {
                        filterContext.Result = new RedirectResult("http://google.com");
                    }
                    //else
                    //{
                    //    ClientOutsite.Current.Add(dataCheck.IPINTERNET);
                    //}
                    //if (ClientOutsite.Current.Where(x => x == ClientIP).Count() == 0)
                    //{
                    //    filterContext.Result = new RedirectResult("http://google.com");
                    //}

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
                                                    { "action", "Login" },
                                                    { "controller", "Account" },
                                                    { "ReturnUrl", filterContext.HttpContext.Request.RawUrl }
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
                                    filterContext.HttpContext.Session[Constants.SessionLogin] = (SYS_USER)resultSession.dataObj;
                                }
                                else
                                {
                                    filterContext.Result = new RedirectToRouteResult(
                                                    new RouteValueDictionary
                                                   {
                                   { "action", "Login" },
                                   { "controller", "Account" },
                                   { "ReturnUrl", filterContext.HttpContext.Request.RawUrl }
                                                   });
                                }
                            }
                        }
                    }

                }
                else
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
                                   {"controller", "Account" },
                                   { "ReturnUrl", filterContext.HttpContext.Request.RawUrl }
                                               });
                            }
                            else
                            {
                                var result = APIHelper.CallAPI<JsonResultObject<SYS_USER>>("user/queryloginSession", new
                                {
                                    SessionId = SessionCurrent
                                });
                                if (result.IsOk)
                                {
                                    filterContext.HttpContext.Session[Constants.SessionLogin] = (SYS_USER)result.dataObj;
                                }
                                else
                                {
                                    filterContext.Result = new RedirectToRouteResult(
                                                    new RouteValueDictionary
                                                   {
                                   {"action", "Login" },
                                   {"controller", "Account" },
                                   { "ReturnUrl", filterContext.HttpContext.Request.RawUrl }
                                                   });
                                }
                            }
                        }
                    }
                }
            }
            else
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
                                   {"controller", "Account" },
                                   { "ReturnUrl", filterContext.HttpContext.Request.RawUrl }
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
                                filterContext.HttpContext.Session[Constants.SessionLogin] = (SYS_USER)resultSession.dataObj;
                            }
                            else
                            {
                                filterContext.Result = new RedirectToRouteResult(
                                                new RouteValueDictionary
                                               {
                                   {"action", "Login" },
                                   {"controller", "Account" },
                                   { "ReturnUrl", filterContext.HttpContext.Request.RawUrl }
                                               });
                            }
                        }
                    }
                }
            }
            #endregion

        }
    }
}