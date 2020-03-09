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
    public class ImportPKLController : BaseController
    {
        [CommonAuthen]
        [HttpPost]
        public JsonResult Delete(string id = "")
        {
            if (!string.IsNullOrEmpty(id))
            {
                //delete
                var resultJson = APIHelper.CallAPI<JsonResultData>("importpkl/delete", new
                {
                    id = id
                });
                return Json(resultJson, JsonRequestBehavior.AllowGet);
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

        [CommonAuthen]
        [HttpPost]
        public JsonResult DeletePallet(string id = "")
        {
            if (!string.IsNullOrEmpty(id))
            {
                //delete
                var resultJson = APIHelper.CallAPI<JsonResultData>("importpallet/delete", new
                {
                    id = id
                });
                return Json(resultJson, JsonRequestBehavior.AllowGet);
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
        public JsonResult GetList(string pageindex, string pagesize, string filterquery = "", string orderby = "")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTPKL>>>("importpkl/getlist", new
                {
                    PageIndex = PageIndex,
                    PageSize = PageSize,
                    FilterQuery = (string.IsNullOrEmpty(filterquery) ? " DONESCANDATE IS NULL " : filterquery + " AND DONESCANDATE IS NULL "),
                    OrderBy = orderby
                });
                if (!resultJson.IsOk)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                var listData = resultJson.dataObj;
                if (listData != null)
                {
                    return Json(new JsonResultObject<List<MD_IMPORTPKL>>
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
        public JsonResult GetDetailWarehousing(string id)
        {
            var resultJson = APIHelper.CallAPI<JsonResultObject<List<ImportPklForWarehousing>>>("importpkl/getdetailwarehousing", new
            {
                id = id
            });
            if (!resultJson.IsOk)
            {
                return Json(resultJson, JsonRequestBehavior.AllowGet);
            }
            var Data = resultJson.dataObj?.First();
            if (Data != null)
            {
                return Json(new JsonResultObject<ImportPklForWarehousing>
                {
                    IsOk = true,
                    dataObj = Data,
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
        public JsonResult BeginWarehousing(long id)
        {
            var resultJson = APIHelper.CallAPI<JsonResultData>("importpkl/beginwarehousing", new
            {
                id = id
            });
            return Json(resultJson, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public string GetAllPalletPrint(long id)
        {
            var resultJsonPKL = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTPKL>>>("importpkl/getlist", new
            {
                PageIndex = 0,
                PageSize = 1,
                FilterQuery = string.Format(" ID = {0} ", id),
                OrderBy = " ID ASC "
            });
            if (!resultJsonPKL.IsOk)
            {
                return string.Empty;
            }
            var importpkldetail = resultJsonPKL.dataObj.First();

            var resultJsonImpFile = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTDETAIL>>>("importdetail/getlist", new
            {
                PageIndex = 0,
                PageSize = 1,
                FilterQuery = string.Format(" IMPFILE = '{0}' ", importpkldetail.IMPFILE),
                OrderBy = " ID ASC "
            });
            if (!resultJsonImpFile.IsOk)
            {
                return string.Empty;
            }
            var impfiledetail = resultJsonImpFile.dataObj.First();

            var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_IMPPALLET>>>("importpallet/getlist", new
            {
                PageIndex = 0,
                PageSize = -1,
                FilterQuery = string.Format(" IMPORTPKL = '{0}' AND IMPFILEID = '{1}' ", importpkldetail.PKLNAME, importpkldetail.IMPFILE),
                OrderBy = " INDEXPKL ASC "
            });
            if (!resultJson.IsOk)
            {
                return string.Empty;
            }
            var lstPallet = resultJson.dataObj;
            string palletPrint = string.Empty;
            for (int i = 0; i < lstPallet.Count; i++)
            {
                var item = lstPallet[i];

                var searchcontract = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTCONTRACT>>>("importcontract/getdetailbycode", new
                {
                    code = impfiledetail.IMPORTCONTRACTCODE
                });
                if (!searchcontract.IsOk)
                    return string.Empty;
                var contract = searchcontract.dataObj.First();
                var fullcontract = new ImpContractEditViewModel(contract);
                var supplier = fullcontract.SupplierDetail.SUPPLIERNAME;
                var material = APIHelper.CallAPI<JsonResultObject<List<MD_MATERIAL>>>("material/getdetail", new
                {
                    id = item.MATERIALID
                });
                if (!material.IsOk)
                    return string.Empty;
                var materialName = material.dataObj != null ? material.dataObj.FirstOrDefault().NAME : string.Empty;
                var submaterialName = string.Empty;
                if (item.SUBMATERIALID.HasValue)
                {
                    var submaterial = APIHelper.CallAPI<JsonResultObject<List<MD_SUBMATERIAL>>>("submaterial/getdetail", new
                    {
                        id = item.SUBMATERIALID.Value
                    });
                    if (!submaterial.IsOk)
                        return string.Empty;
                    submaterialName = submaterial.dataObj != null ? submaterial.dataObj.FirstOrDefault().NAME : string.Empty;
                }
                string Origin = string.Empty;
                var Sorigin = fullcontract.ItemList.Where(x => x.MATERIALID == item.MATERIALID && item.SUBMATERIALID.HasValue ? item.SUBMATERIALID.Value == x.SUBMATERIALID.Value : !x.SUBMATERIALID.HasValue);
                if (Sorigin.Count() > 0)
                {
                    Origin = Sorigin.First().ORIGIN;
                }
                var fullNameMaterial = materialName + (string.IsNullOrEmpty(submaterialName) ? "" : " " + submaterialName);
                //string objectSerialize = string.Format("LAMIPEL ERP\nMaterial:{5}\nPallet No:{0}\nFile No:{1}\nSupplier:{2}\nContract No:{3}\nInvoice PKL:{4}\nContainer:{6}\nPCS:{7}\nNW:{8}\nSQFT:{9}\nSAVG:{10}\nWAVG:{11}", item.NAME, impfiledetail.IMPFILE, supplier, contract.IMPORTCODE, impfiledetail.INVOICE, fullNameMaterial, item.IMPORTPKL, item.PCS, item.NW, item.SQFT, item.SAVG, item.WAVG);
                string objectSerialize = string.Format("LAMIPEL ERP\nMaterial:{5}\nPallet No:{0}\nFile No:{1}\nSupplier:{2}\nContract No:{3}\nInvoice PKL:{4}\nContainer:{6}\nPCS:{7}\nNW:{8}\nSQFT:{9}\nSAVG:{10}\nWAVG:{11}", item.PALLETDONECODE, impfiledetail.IMPDONEFILEID, supplier, contract.IMPORTCODE, impfiledetail.INVOICE, fullNameMaterial, importpkldetail.PKLDONECODE, item.PCS, item.NW, item.SQFT, item.SAVG, item.WAVG);
                item.SCANCODE = Barcode.Current.CreateQRString(objectSerialize);
                List<string> dataprint = new List<string>();
                dataprint.Add(item.PALLETDONECODE);//dataprint.Add(item.NAME);
                dataprint.Add(materialName);
                dataprint.Add(submaterialName);
                dataprint.Add(item.PCS.HasValue ? item.PCS.Value.ToString("#,##0") : "0");
                dataprint.Add(item.NW.HasValue ? item.NW.Value.ToString("#,##0") : "0");
                dataprint.Add(importpkldetail.PKLIDENTITY);//dataprint.Add(item.WAVG.HasValue ? item.WAVG.Value.ToString("#,##0") : "0");
                dataprint.Add(item.SQFT.HasValue ? item.SQFT.Value.ToString("#,##0") : "0");
                dataprint.Add(Origin);//origin
                dataprint.Add(impfiledetail.ISLWG ? "YES" : "NO");//lwg
                dataprint.Add(item.SCANCODE);
                dataprint.Add(importpkldetail.PKLDONECODE);//dataprint.Add(item.IMPORTPKL);
                dataprint.Add(supplier.Length > 15 ? supplier.Substring(0, 15) : supplier);
                item.TEMPLATEPRINT = BarcodeHelper.XMLHelper.Current.BuilResouce("ImportLabelPrint", dataprint.ToArray());
                var resultJsonUpdate = APIHelper.CallAPI<JsonResultData>("importpallet/Update", new
                {
                    data = item
                });
                //var resultJsonUpdate = new JsonResultData
                //{
                //    IsOk = true
                //};
                if (!resultJsonUpdate.IsOk)
                    return string.Empty;

                palletPrint += item.TEMPLATEPRINT;
                if (i < lstPallet.Count - 1)
                {
                    palletPrint += "<div style='clear: both; height: 36.5mm; '></div>";
                }
            }
            return palletPrint;
        }
    }
}