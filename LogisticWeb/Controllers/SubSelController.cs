using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LogisticWeb.Models;
using LogisticWeb.Common;
using ModelHelper;
using ModelDatabase;
using ModelHelper.ViewModel;

namespace LogisticWeb.Controllers
{
    public class SubSelController : BaseController
    {
        [CommonAuthen]
        public ActionResult Index(string pageindex = "")
        {
            long index = 1;
            if (!string.IsNullOrEmpty(pageindex))
            {
                long.TryParse(pageindex, out index);
            }
            ViewBag.PageIndex = index;
            return View();
        }

        

        //[CommonAction]
        [HttpPost]
        public JsonResult GetListbyId(string value)
        {
            return Json(APIHelper.CallAPI<JsonResultObject<List<MD_SUBSELECTION>>>("subselection/getlist", new
            {
                PageIndex = 0,
                PageSize = -1,
                OrderBy = " ID ASC ",
                FilterQuery = " SELECTION = '" + value + "' "
            }), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetListFollowId(string value)
        {
            return Json(APIHelper.CallAPI<JsonResultObject<List<MD_SUBSELECTION>>>("subselection/getlist", new
            {
                PageIndex = 0,
                PageSize = -1,
                OrderBy = " ID ASC ",
                FilterQuery = " SELECTIONID = '" + value + "' "
            }), JsonRequestBehavior.AllowGet);
        }

        [CommonAuthen]
        public ActionResult Detail(string id = "")
        {
            MD_SUBSELECTION model = new MD_SUBSELECTION();
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_SUBSELECTION>>>("subselection/getdetail", new
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
        public JsonResult Save(MD_SUBSELECTION info)
        {
            if (info.ID != 0)
            {
                if (string.IsNullOrEmpty(info.NAME))
                {
                    return Json(new JsonResultData
                    {
                        IsOk = false,
                        dataErr = null,
                        dataObj = null,
                        Msg = "NAME can not be null",
                        totalrows = 0
                    }, JsonRequestBehavior.AllowGet);
                }
                if (string.IsNullOrEmpty(info.SHORTNAME))
                {
                    return Json(new JsonResultData
                    {
                        IsOk = false,
                        dataErr = null,
                        dataObj = null,
                        Msg = "SHORTNAME can not be null",
                        totalrows = 0
                    }, JsonRequestBehavior.AllowGet);
                }
                //update
                return Json(APIHelper.CallAPI<JsonResultData>("subselection/update", new
                {
                    info.ID,
                    info.SELECTIONID,
                    info.NAME,
                    info.SHORTNAME,
                    info.VALUE
                }), JsonRequestBehavior.AllowGet);
            }
            else
            {
                if (string.IsNullOrEmpty(info.NAME))
                {
                    return Json(new JsonResultData
                    {
                        IsOk = false,
                        dataErr = null,
                        dataObj = null,
                        Msg = "NAME can not be null",
                        totalrows = 0
                    }, JsonRequestBehavior.AllowGet);
                }
                if (string.IsNullOrEmpty(info.SHORTNAME))
                {
                    return Json(new JsonResultData
                    {
                        IsOk = false,
                        dataErr = null,
                        dataObj = null,
                        Msg = "SHORTNAME can not be null",
                        totalrows = 0
                    }, JsonRequestBehavior.AllowGet);
                }
                //insert
                return Json(APIHelper.CallAPI<JsonResultData>("subselection/insert", new
                {
                    info.ID,
                    info.SELECTIONID,
                    info.NAME,
                    info.SHORTNAME,
                    info.VALUE
                }), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetList(string pageindex, string pagesize)
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                return Json(APIHelper.CallAPI<JsonResultObject<List<MD_SUBSELECTION>>>("subselection/getlist", new
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
        [HttpPost]
        public JsonResult Delete(string id = "")
        {
            if (!string.IsNullOrEmpty(id))
            {
                return Json(APIHelper.CallAPI<JsonResultData>("subselection/delete", new
                {
                    id = id
                }), JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataErr = null,
                    dataObj = null,
                    Msg = "Id is null",
                    totalrows = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}