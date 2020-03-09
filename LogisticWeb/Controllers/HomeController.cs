using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LogisticWeb.Common;
using LogisticWeb.Models;

namespace LogisticWeb.Controllers
{
    public class HomeController : BaseController
    {
        [CommonAuthen]
        public ActionResult Index()
        {
            return View();
        }
        [CommonAuthen]
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }
        [CommonAuthen]
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}