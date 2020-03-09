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
    public class MaterialController : BaseController
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
            MD_MATERIAL model = new MD_MATERIAL();
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_MATERIAL>>>("material/getdetail", new
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
        public JsonResult Save(MD_MATERIAL info)
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
                return Json(APIHelper.CallAPI<JsonResultData>("material/update", new
                {
                    info.ID,
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
                return Json(APIHelper.CallAPI<JsonResultData>("material/insert", new
                {
                    info.ID,
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
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_MATERIAL>>>("material/getlist", new
                {
                    PageIndex = PageIndex,
                    PageSize = PageSize
                });
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(ErrorHelper.Current.ErrorValidateData(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetFullInOne()
        {
            var result = APIHelper.CallAPI<JsonResultObject<List<MaterialOneList>>>("material/getfullone");
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetListForImpFile(string importContract)
        {
            return Json(APIHelper.CallAPI<JsonResultObject<List<MD_MATERIAL>>>("material/getlistforimpfile", new
            {
                importContractCode = importContract
            }), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetListForImpFileFull(string importContract)
        {
            var result = APIHelper.CallAPI<JsonResultObject<List<MaterialOneList>>>("material/getlistforimpfilefull", new
            {
                Code = importContract
            });
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [CommonAuthen]
        [HttpPost]
        public JsonResult Delete(string id = "")
        {
            if (!string.IsNullOrEmpty(id))
            {
                return Json(APIHelper.CallAPI<JsonResultData>("material/delete", new
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