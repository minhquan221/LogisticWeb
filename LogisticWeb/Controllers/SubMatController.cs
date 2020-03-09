using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LogisticWeb.Models;
using LogisticWeb.Common;
using ModelHelper;
using ModelDatabase;

namespace LogisticWeb.Controllers
{
    public class SubMatController : BaseController
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

        [CommonAuthen]
        public ActionResult Detail(string id = "")
        {
            MD_SUBMATERIAL model = new MD_SUBMATERIAL();
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_SUBMATERIAL>>>("submaterial/getdetail", new
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

        [HttpPost]
        [CommonAuthen]
        public JsonResult Save(MD_SUBMATERIAL info)
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
                //if (string.IsNullOrEmpty(info.SHORTNAME))
                //{
                //    return Json(new JsonResultData
                //    {
                //        IsOk = false,
                //        dataErr = null,
                //        dataObj = null,
                //        Msg = "SHORTNAME can not be null",
                //        totalrows = 0
                //    }, JsonRequestBehavior.AllowGet);
                //}
                //update
                return Json(APIHelper.CallAPI<JsonResultData>("submaterial/update", new
                {
                    info.ID,
                    info.NAME,
                    info.MATERIALID,
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
                //if (string.IsNullOrEmpty(info.SHORTNAME))
                //{
                //    return Json(new JsonResultData
                //    {
                //        IsOk = false,
                //        dataErr = null,
                //        dataObj = null,
                //        Msg = "SHORTNAME can not be null",
                //        totalrows = 0
                //    }, JsonRequestBehavior.AllowGet);
                //}
                //insert
                return Json(APIHelper.CallAPI<JsonResultData>("submaterial/insert", new
                {
                    info.ID,
                    info.MATERIALID,
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
                return Json(APIHelper.CallAPI<JsonResultObject<List<MD_SUBMATERIAL>>>("submaterial/getlist", new
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
                return Json(APIHelper.CallAPI<JsonResultData>("submaterial/delete", new
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

        [HttpPost]
        public JsonResult GetListbyId(string value)
        {
            return Json(APIHelper.CallAPI<JsonResultObject<List<MD_SUBMATERIAL>>>("submaterial/getlist", new
            {
                PageIndex = 0,
                PageSize = -1,
                OrderBy = " ID ASC ",
                FilterQuery = " MATERIALID = '" + value + "' "
            }), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetListFollowId(string value)
        {
            return Json(APIHelper.CallAPI<JsonResultObject<List<MD_SUBMATERIAL>>>("submaterial/getlist", new
            {
                PageIndex = 0,
                PageSize = -1,
                OrderBy = " ID ASC ",
                FilterQuery = " MATERIALID = '" + value + "' "
            }), JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult GetListForImpFile(string importContract, string materialid)
        {
            return Json(APIHelper.CallAPI<JsonResultObject<List<MD_SUBMATERIAL>>>("submaterial/getlistforimpfile", new
            {
                importContractCode = importContract,
                MaterialId = materialid
            }), JsonRequestBehavior.AllowGet);
        }
    }
}