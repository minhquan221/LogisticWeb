using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LogisticWeb.Models;
using LogisticWeb.Common;
using ModelDatabase;
using ModelHelper;

namespace LogisticWeb.Controllers
{
    public class UnitController : BaseController
    {
        [CommonAuthen]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult GetList(string pageindex, string pagesize)
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                return Json(APIHelper.CallAPI<JsonResultObject<List<MD_UNIT>>>("unit/getlist", new
                {
                    PageIndex = PageIndex,
                    PageSize = PageSize
                }), JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(ErrorHelper.Current.ErrorValidateData(), JsonRequestBehavior.AllowGet);
            }
        }

        [CommonAuthen]
        public ActionResult Detail(string id = "")
        {
            MD_UNIT model = new MD_UNIT();
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_UNIT>>>("unit/getdetail", new
                {
                    id = id
                });
                if (result.IsOk)
                {
                    model = result.dataObj.FirstOrDefault();
                }
            }
            return View(model);
        }

        [CommonAuthen]
        public JsonResult Save(MD_UNIT info)
        {
            if (info.ID != 0)
            {
                //update
                return Json(APIHelper.CallAPI<JsonResultData>("unit/update", new
                {
                    info.ID,
                    info.NAME,
                    info.SHORTNAME,
                    info.VALUE
                }), JsonRequestBehavior.AllowGet);
            }
            else
            {
                //insert
                return Json(APIHelper.CallAPI<JsonResultData>("unit/insert", new
                {
                    info.ID,
                    info.NAME,
                    info.SHORTNAME,
                    info.VALUE
                }), JsonRequestBehavior.AllowGet);
            }
        }
    }
}