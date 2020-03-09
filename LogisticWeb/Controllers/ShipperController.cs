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
    public class ShipperController : BaseController
    {
        [CommonAuthen]
        public ActionResult Index(string pageindex="")
        {
            long index = 1;
            if (!string.IsNullOrEmpty(pageindex))
            {
                long.TryParse(pageindex, out index);
            }
            ViewBag.PageIndex = index;
            return View();
        }

        [HttpPost]
        public JsonResult GetList(string pageindex, string pagesize, string filterquery = "", string orderby="")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_SHIPPER>>>("shipper/getlist", new
                {
                    PageIndex = PageIndex,
                    PageSize = PageSize,
                    FilterQuery = filterquery,
                    OrderBy = orderby
                });
                if (!resultJson.IsOk)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                var listData = resultJson.dataObj;
                if (listData != null)
                {
                    return Json(new JsonResultObject<List<MD_SHIPPER>>
                    {
                        IsOk = true,
                        dataObj = listData,
                        Msg = string.Empty,
                        dataErr = null,
                        totalrows = resultJson.totalrows
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new JsonResultData
                    {
                        IsOk = true,
                        dataObj = null,
                        Msg = string.Empty,
                        dataErr = null,
                        totalrows = 0
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(ErrorHelper.Current.ErrorValidateData(), JsonRequestBehavior.AllowGet);
            }
        }

        [CommonAuthen]
        public ActionResult Detail(string id = "")
        {
            MD_SHIPPER model = new MD_SHIPPER();
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_SHIPPER>>>("shipper/getdetail", new
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
        public JsonResult Getbyid(string id)
        {
            try
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_SHIPPER>>>("shipper/getdetail", new
                {
                    id = id
                });
                if (!resultJson.IsOk)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = new ShipperViewModel().ParseFromDBObject(resultJson.dataObj.FirstOrDefault()),
                    dataErr = null,
                    Msg = string.Empty,
                    totalrows = 1
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    dataErr = null,
                    Msg = ex.ToString(),
                    totalrows = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [CommonAuthen]
        [HttpPost]
        public JsonResult Delete(string id = "")
        {
            if (!string.IsNullOrEmpty(id))
            {
                //delete
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_SHIPPER>>>("shipper/getdetail", new
                {
                    id = id
                });
                if (!resultJson.IsOk)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                var Detail = resultJson.dataObj.First();
                if (Detail == null)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                return Json(APIHelper.CallAPI<JsonResultData>("shipper/delete", new
                {
                    data = Detail
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
        [CommonAuthen]
        public JsonResult Save(ShipperViewModel info)
        {
            //insert
            return Json(APIHelper.CallAPI<JsonResultData>("shipper/insert", new
            MD_SHIPPER
            {
                NOTE = info.SHIPPERNOTE,
                TELEPHONE = info.SHIPPERTEL,
                ADDRESS = info.SHIPPERADDR,
                FAX = info.SHIPPERFAX,
                SHIPPERNAME = info.SHIPPERNAME,
                SHIPPERPRIMARY = info.SHIPPERPRIMARY,
                CREATEDUSER = LoginUser.Current.USERNAME,
                CREATEDDATE = DateTime.Now
            }), JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        [CommonAuthen]
        public JsonResult Update(MD_SHIPPER info)
        {
            info.UPDATEDDATE = DateTime.Now;
            info.UPDATEDUSER = LoginUser.Current.USERNAME;
            return Json(APIHelper.CallAPI<JsonResultData>("shipper/update", new { data = info }), JsonRequestBehavior.AllowGet);

        }
    }
}