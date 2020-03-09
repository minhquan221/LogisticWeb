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
using BarcodeHelper;

namespace LogisticWeb.Controllers
{
    public class PalletController : BaseController
    {
        // GET: Selection
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

        //[CommonAction]
        [HttpPost]
        public JsonResult getlistbyContainer(string container)
        {
            return Json(APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("pallet/GetListPKL", new
            {
                containerId = container
            }), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult getlistSemiImported(string resacode)
        {
            return Json(APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("pallet/getlistSemiImported", new
            {
                resacode = resacode
            }), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult getlistSemiProduct(string resacode="")
        {
            var result = APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("pallet/GetListSemiProduct", new { resacode });
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //[CommonAction]
        [HttpPost]
        public JsonResult getlistbyFullSelection(string selection, string subselection)
        {
            return Json(APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("pallet/getlistunpackcnt", new
            {
                selection = selection,
                subselection = subselection
            }), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetList(string pageindex, string pagesize, string filterquery = "", string orderby="")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("pallet/getlist", new
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
                    return Json(new JsonResultObject<List<MD_PALETTE>>
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

        [HttpPost]
        public JsonResult GetChartHome()
        {
            var resultJson = APIHelper.CallAPI<JsonResultObject<List<PalletHomeChart>>>("pallet/ChartHome");
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [CommonAuthen]
        public ActionResult Detail(string id = "")
        {
            MD_PALETTE model = new MD_PALETTE();
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("pallet/getdetail", new
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
        [HttpPost]
        public JsonResult LoadPrint(string id = "")
        {
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("pallet/getdetail", new
                {
                    id = id
                });
                if (result.IsOk)
                {
                    if (result.dataObj != null)
                    {
                        var model = result.dataObj.FirstOrDefault();
                        model.UPDATEDUSER = LoginUser.Current.USERNAME;
                        model.UPDATEDDATE = DateTime.Now;
                        //update
                        model.BARCODE = Barcode.Current.CreateQRCodeRawString(new QRCodeViewModel
                        {
                            GROSSWEIGHT = model.GROSSWEIGHT,
                            HIDE = model.HIDE,
                            NAME = model.NAME,
                            NETWEIGHT = model.NETWEIGHT,
                            PALLETWEIGHT = model.PALLETWEIGHT,
                            RESACODE = model.RESACODE,
                            SELECTION = model.SELECTION,
                            SQUAREFOOT = model.SQUAREFOOT,
                            SUBSELECTION = model.SUBSELECTION,
                            CONTAINERID = model.CONTAINERID
                        });
                        List<string> array = new List<string>();
                        array.Add(model.NAME);
                        array.Add(model.SELECTION);
                        array.Add(model.SUBSELECTION);
                        array.Add(model.HIDE);
                        array.Add(model.NETWEIGHT);
                        array.Add(model.GROSSWEIGHT);
                        array.Add(model.SQUAREFOOT);
                        array.Add(DateTime.Now.ToString("yyyy-MM-dd"));
                        array.Add(model.RESACODE);
                        array.Add(model.BARCODE);
                        array.Add(model.CONTAINERID);
                        model.CONTENTPRINT = BarcodeHelper.XMLHelper.Current.BuilResouce("ShippingMarkPrint", array.ToArray());
                        var resultUpdate = APIHelper.CallAPI<JsonResultData>("pallet/update", new
                        {
                            model.ID,
                            model.NAME,
                            model.BARCODE,
                            model.CONTENTPREVIEW,
                            model.CONTENTPRINT,
                            model.DVT,
                            model.GROSSWEIGHT,
                            model.HIDE,
                            model.NETWEIGHT,
                            model.PALLETWEIGHT,
                            model.SELECTION,
                            model.SUBSELECTION,
                            model.RESACODE,
                            model.UPDATEDUSER,
                            model.SQUAREFOOT,
                            model.WAVG,
                            model.SAVG,
                            model.UPDATEDDATE,
                            model.NAVIGATORNAME
                        });
                        if (!resultUpdate.IsOk)
                        {
                            return Json(resultUpdate, JsonRequestBehavior.AllowGet);
                        }

                        return Json(new JsonResultData
                        {
                            IsOk = true,
                            dataObj = model.CONTENTPRINT,
                            dataErr = null,
                            Msg = string.Empty,
                            totalrows = 1
                        }, JsonRequestBehavior.AllowGet);

                    }
                    else
                    {
                        return Json(new JsonResultData
                        {
                            IsOk = false,
                            dataObj = null,
                            dataErr = null,
                            Msg = "Data null",
                            totalrows = 0
                        }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    dataErr = null,
                    Msg = "Id null",
                    totalrows = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        [CommonAuthen]
        public JsonResult exportexcel(string pageindex, string pagesize, string filterquery = "", string listColumn = "")
        {
            try
            {
                var resultJson = APIHelper.CallAPI<JsonResultData>("pallet/ExportExcelFilter", new
                {
                    data = new SearchViewModel
                    {
                        PageIndex = pageindex,
                        PageSize = pagesize,
                        FilterQuery = filterquery
                    },
                    listColumn = listColumn,
                    path = Server.MapPath("~/export")
                });
                if (!resultJson.IsOk)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                string urlWeb = Barcode.Current.SaveFileFromLinkAPI(ConfigurationManager.AppSettings["hostApiSetting"] + "export/" + resultJson.dataObj);
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = urlWeb,
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
        public ActionResult Edit(string id = "")
        {
            MD_PALETTE model = new MD_PALETTE();
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("pallet/getdetail", new
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
        [HttpPost]
        public JsonResult Delete(string id = "")
        {
            if (!string.IsNullOrEmpty(id))
            {
                //delete
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("pallet/getdetail", new
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
                return Json(APIHelper.CallAPI<JsonResultData>("pallet/delete", new
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
    }
}