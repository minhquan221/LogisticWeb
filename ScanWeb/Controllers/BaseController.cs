using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ScanWeb.Controllers
{
    public class BaseController : Controller
    {
        public static string BackLink = string.Empty;

        protected override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            BackLink = filterContext.HttpContext.Request.UrlReferrer != null ? filterContext.HttpContext.Request.UrlReferrer.ToString() : "/";
            base.OnResultExecuted(filterContext);
        }
    }
}