using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LogisticWeb.Models;
using LogisticWeb.Common;
using ModelDatabase;
using ModelHelper;
using ModelHelper.ViewModel;
using System.Configuration;

namespace LogisticWeb.Controllers
{
    public class ConfigProductController : BaseController
    {
        // GET: Selection
        [CommonAuthen]
        public ActionResult Index()
        {
            List<SelectionConfig> model = new List<SelectionConfig>();
            var result = APIHelper.CallAPI<JsonResultObject<List<SelectionConfig>>>("selection/getlistconfig");
            if (result.IsOk)
            {
                model = result.dataObj != null ? result.dataObj : model;
            }
            return View(model);
        }


        [HttpPost]
        public JsonResult UpdateList(List<string> lstList)
        {
            var result = APIHelper.CallAPI<JsonResultData>("selection/updateconfig", new
            {
                lstList = lstList
            });
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        
    }
}