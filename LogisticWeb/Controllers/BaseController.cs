using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using NLog;
using Newtonsoft.Json;
using LogisticWeb.Common;
using System.Web.Routing;
using ModelHelper;
using ModelDatabase;
using System.Configuration;
using WebRepositories.Interface;
using LogisticWeb.ServiceProvider.BaseFactory;

namespace LogisticWeb.Controllers
{

    public abstract class BaseController : Controller
    {
        public static Logger logger = LogManager.GetCurrentClassLogger();
        //protected override void OnActionExecuting(ActionExecutingContext filterContext)
        //{
        //    #region Log trace
        //    //List<object> data = new List<object>();
        //    //var paramsData = filterContext.RequestContext.HttpContext.Request.Form;
        //    //if (paramsData != null)
        //    //{
        //    //    string[] ParamsKey = paramsData.AllKeys;
        //    //    foreach (var item in ParamsKey)
        //    //    {
        //    //        data.Add(new { key = item, values = paramsData.GetValues(item) });
        //    //    }
        //    //}
        //    //logger.Trace(filterContext.RequestContext.HttpContext.Request.Params.GetValues("ASP.NET_SessionId").First().ToString() + " - " + filterContext.HttpContext.Request.Url + " - " + filterContext.HttpContext.Request.HttpMethod.ToString() + " - " + filterContext.HttpContext.Response.Status + " - " + JsonConvert.SerializeObject(data));
        //    #endregion

        //    base.OnActionExecuting(filterContext);
        //}

        //protected override void OnException(ExceptionContext filterContext)
        //{
        //    //logger.Error(filterContext.Exception.Message);
        //}

        //protected override void OnResultExecuting(ResultExecutingContext filterContext)
        //{
        //    #region Log trace
        //    //Type resultType = filterContext.Result.GetType();
        //    //switch (resultType.Name)
        //    //{
        //    //    case "JsonResult":
        //    //        logger.Trace(filterContext.RequestContext.HttpContext.Request.Params.GetValues("ASP.NET_SessionId").First().ToString() + " - result - " + filterContext.HttpContext.Request.Url + " - " + filterContext.HttpContext.Response.Status);
        //    //        break;
        //    //    default:
        //    //        logger.Trace(filterContext.RequestContext.HttpContext.Request.Params.GetValues("ASP.NET_SessionId").First().ToString() + " - result - " + filterContext.HttpContext.Request.Url + " - " + filterContext.HttpContext.Response.Status);
        //    //        break;
        //    //}
        //    #endregion

        //    base.OnResultExecuting(filterContext);
        //}

        public string GetIpClient()
        {
            string ip = HttpContext.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            string ClientIP = string.Empty;
            if (!string.IsNullOrEmpty(ip))
            {
                string[] ipRange = ip.Split(',');
                int le = ipRange.Length - 1;
                ClientIP = ipRange[0];
            }
            else
            {
                ClientIP = HttpContext.Request.ServerVariables["REMOTE_ADDR"];
                
            }
            bool IsDebug = ConfigurationManager.AppSettings["Debug"] == "1" ? true : false;
            if (IsDebug)
            {
                System.IO.File.WriteAllText(ConfigurationManager.AppSettings["Path"], "HTTP_X_FORWARDED_FOR_" + DateTime.Now.ToString("yyyyMMdd_HHmmssttt") + " - " + HttpContext.Request.ServerVariables["HTTP_X_FORWARDED_FOR"]);
                System.IO.File.WriteAllText(ConfigurationManager.AppSettings["Path"], "REMOTE_ADDR_" + DateTime.Now.ToString("yyyyMMdd_HHmmssttt") + " - " + HttpContext.Request.ServerVariables["REMOTE_ADDR"]);
            }
            return ClientIP;
        }


        public BaseController()
        {
        }

        protected override void HandleUnknownAction(string actionName)
        {
            Response.Redirect("/error");
            //base.HandleUnknownAction(actionName);
        }
    }
}