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
    public class ImportConController : BaseController
    {
        // GET: Selection
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

        [HttpPost]
        public JsonResult GetList(string pageindex, string pagesize, string filterquery = "", string orderby = "")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<ImportContractIndexPage>>>("importcontract/getlist", new
                {
                    PageIndex = PageIndex,
                    PageSize = PageSize,
                    FilterQuery = filterquery,
                    OrderBy = orderby
                });
                return Json(resultJson, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(ErrorHelper.Current.ErrorValidateData(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetListForCreateNew()
        {
            var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTCONTRACT>>>("importcontract/getlistforcreatenew");
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetListView(string pageindex, string pagesize, string filterquery = "", string orderby = "")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<ImportContractListView>>>("importcontract/getlistview", new
                {
                    PageIndex = PageIndex,
                    PageSize = PageSize,
                    FilterQuery = filterquery,
                    OrderBy = orderby
                });
                return Json(resultJson, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(ErrorHelper.Current.ErrorValidateData(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetListFull(string pageindex, string pagesize, string filterquery = "", string orderby = "")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<ImportItemContract>>>("importcontract/getlistfull", new
                {
                    PageIndex = PageIndex,
                    PageSize = PageSize,
                    FilterQuery = filterquery,
                    OrderBy = orderby
                });
                return Json(resultJson, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(ErrorHelper.Current.ErrorValidateData(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetFilter(List<string> list)
        {
            var result = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTCONTRACT>>>("importcontract/getfilter", new
            {
                list
            });
            return Json(result, JsonRequestBehavior.AllowGet);

        }

        [CommonAuthen]
        public ActionResult Detail(string id)
        {
            MD_IMPORTCONTRACT model = new MD_IMPORTCONTRACT();
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTCONTRACT>>>("importcontract/getdetail", new
                {
                    id = id
                });
                if (result.IsOk)
                {
                    model = result.dataObj.FirstOrDefault();
                }
            }
            var contractfulldetail = new ImpContractEditViewModel(model);
            return View(contractfulldetail);
        }

        [HttpPost]
        public JsonResult GetItemContractCode(string importContract, string materialid, string submaterialid)
        {
            var result = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTITEMDETAIL>>>("importcontract/getfullitemcontractcode", new
            {
                importContract,
                materialid,
                submaterialid
            });
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [CommonAuthen]
        public ActionResult CreateNew()
        {
            return View();
        }

        //[HttpPost]
        //[CommonAuthen]
        //public JsonResult GenerateCodeName()
        //{
        //    var resultJson = APIHelper.CallAPI<JsonResultData>("contract/generatecodename");
        //    return Json(resultJson, JsonRequestBehavior.AllowGet);
        //}

        [HttpPost]
        public JsonResult Save(ImpContractViewModel info)
        {
            info.CREATEDDATE = DateTime.Now;
            info.CREATEDUSER = LoginUser.Current.USERNAME;
            var resultJson = APIHelper.CallAPI<JsonResultData>("importcontract/Insert", new
            {
                data = info
            });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Save2(MD_IMPORTCONTRACT info)
        {
            info.CREATEDDATE = DateTime.Now;
            info.CREATEDUSER = LoginUser.Current.USERNAME;
            var resultJson = APIHelper.CallAPI<JsonResultObject<MD_IMPORTCONTRACT>>("importcontract/Insert", new
            {
                data = info
            });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(ImpContractViewModel info)
        {
            List<MD_IMPORTITEMDETAIL> detail = info.GetDetailList();
            string lstList = "";
            foreach (var item in detail)
                lstList += item.ID + ";";
            lstList = lstList.Substring(0, lstList.Length - 1);
            var resultDeleteNotInList = APIHelper.CallAPI<JsonResultData>("importitemdetail/deletenotinlist", new
            {
                lstListId = lstList,
                ItemListId = info.ID
            });
            if (!resultDeleteNotInList.IsOk)
            {
                return Json(resultDeleteNotInList, JsonRequestBehavior.AllowGet);
            }
            foreach (var item in detail)
            {
                if (item.ID != 0)
                {
                    var resultDetailList = APIHelper.CallAPI<JsonResultData>("importitemdetail/update", new
                    {
                        data = item
                    });
                    if (!resultDetailList.IsOk)
                    {
                        return Json(new JsonResultData
                        {
                            IsOk = false,
                            Msg = "item detail Update - " + resultDetailList.Msg,
                        }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    var resultDetailList = APIHelper.CallAPI<JsonResultData>("importitemdetail/insert", new
                    {
                        data = item
                    });
                    if (resultDetailList.IsOk)
                    {
                        info.ItemIDDetail.Add(Convert.ToInt64(resultDetailList.dataObj));
                    }
                    else
                    {
                        return Json(new JsonResultData
                        {
                            IsOk = false,
                            Msg = "item detail Insert - " + resultDetailList.Msg,
                        }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            MD_IMPORTCONTRACT contractdetail = info.GetContractDetail();
            if (contractdetail.ID != 0)
            {
                var result = APIHelper.CallAPI<JsonResultData>("importcontract/update", new
                {
                    data = contractdetail
                });
                return Json(new JsonResultData
                {
                    IsOk = result.IsOk,
                    dataErr = null,
                    dataObj = null,
                    Msg = "contractdetail Update - " + result.Msg,
                    totalrows = 0
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataErr = null,
                    dataObj = null,
                    Msg = "ID CAN NOT BE NULL IN UPDATE FUNCTION",
                    totalrows = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult UpdateDone(ImpContractViewModel info)
        {
            MD_IMPORTCONTRACT contractdetail = info.GetContractDetail();
            contractdetail.UPDATEDUSER = LoginUser.Current.USERNAME;
            var resultupdatedone = APIHelper.CallAPI<JsonResultData>("importcontract/updatedone", new
            {
                data = contractdetail
            });
            return Json(resultupdatedone, JsonRequestBehavior.AllowGet);
        }


        [CommonAuthen]
        [HttpPost]
        public JsonResult Delete(string id = "")
        {
            if (string.IsNullOrEmpty(id))
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
            var resultCheckValidDelete = APIHelper.CallAPI<JsonResultData>("importcontract/checkvaliddeletion", new
            {
                id = id
            });
            if (!resultCheckValidDelete.IsOk)
                return Json(resultCheckValidDelete, JsonRequestBehavior.AllowGet);
            var resultDelete = APIHelper.CallAPI<JsonResultData>("importcontract/delete", new
            {
                id = id
            });
            return Json(resultDelete, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update2(MD_IMPORTCONTRACT info)
        {
            if (info.ID != 0)
            {
                var result = APIHelper.CallAPI<JsonResultData>("importcontract/update", new
                {
                    data = info
                });
                return Json(new JsonResultData
                {
                    IsOk = result.IsOk,
                    dataErr = null,
                    dataObj = null,
                    Msg = "importcontractdetail Update - " + result.Msg,
                    totalrows = 0
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataErr = null,
                    dataObj = null,
                    Msg = "ID CAN NOT BE NULL IN UPDATE FUNCTION",
                    totalrows = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult DoneContract(string itemcode)
        {
            var resultJson = APIHelper.CallAPI<JsonResultObject<ImpContractViewModel>>("importcontract/donecontract", new
            {
                itemcode = itemcode,
                UPDATEDDATE = DateTime.Now,
                UPDATEDUSER = LoginUser.Current.USERNAME
            });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CommonAuthen]
        public JsonResult exportexcel(string pageindex, string pagesize, string filterquery = "", string listColumn = "")
        {
            try
            {
                var resultJson = APIHelper.CallAPI<JsonResultData>("importcontract/exportexcelfilter", new
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
    }
}