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
using System.IO;
using DevExpress.Spreadsheet;
using System.ComponentModel;

namespace LogisticWeb.Controllers
{
    public class ImportFileController : BaseController
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
        //[CommonAction]
        public JsonResult GenerateName()
        {
            try
            {
                //GenerateName
                var resultJson = APIHelper.CallAPI<JsonResultData>("importdetail/generacodename");
                return Json(resultJson, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    Msg = ex.ToString(),
                    dataErr = ex,
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [CommonAuthen]
        public ActionResult Report()
        {
            var resultJson = APIHelper.CallAPI<JsonResultObject<List<ImportFileListView>>>("importdetail/getlistimpfile", new
            {
                PageIndex = 0,
                PageSize = -1,
                FilterQuery = " SHIPMENTSTATUS = 'ARRIVAL' ",
                OrderBy = string.Empty
            });
            if (resultJson.IsOk)
            {
                ViewBag.ListArrival = resultJson.dataObj;
            }
            //return Json(resultJson, JsonRequestBehavior.AllowGet);

            resultJson = APIHelper.CallAPI<JsonResultObject<List<ImportFileListView>>>("importdetail/getlistimpfile", new
            {
                PageIndex = 0,
                PageSize = -1,
                FilterQuery = " SHIPMENTSTATUS = 'ON THE WAY' ",
                OrderBy = string.Empty
            });
            if (resultJson.IsOk)
            {
                ViewBag.ListOntheWay = resultJson.dataObj;
            }
            //return Json(resultJson, JsonRequestBehavior.AllowGet);

            resultJson = APIHelper.CallAPI<JsonResultObject<List<ImportFileListView>>>("importdetail/getlistimpfile", new
            {
                PageIndex = 0,
                PageSize = -1,
                FilterQuery = " SHIPMENTSTATUS = 'PLANNED' ",
                OrderBy = string.Empty
            });
            if (resultJson.IsOk)
            {
                ViewBag.ListPlanned = resultJson.dataObj;
            }
            //return Json(resultJson, JsonRequestBehavior.AllowGet);
            return View();
        }

        [HttpPost]
        public JsonResult UpdateAccountRemark(long id, string remarkvalue) {
            var resultJson = APIHelper.CallAPI<JsonResultData>("importdetail/updateaccountremark", new
            {
                id = id,
                accountremark = remarkvalue,
                username = LoginUser.Current.USERNAME
            });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetList(string pageindex, string pagesize, string filterquery = "", string orderby = "")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<ImportFileListView>>>("importdetail/getlistimpfile", new
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
            var result = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTDETAIL>>>("importdetail/getfilter", new
            {
                list
            });
            return Json(result, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public JsonResult GetListFilter(string pageindex, string pagesize, string filterquery = "", string orderby = "")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTDETAIL>>>("importdetail/getlist", new
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
        public JsonResult GetListFilterWarehousing(string pageindex, string pagesize, string filterquery = "", string orderby = "")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTDETAIL>>>("importdetail/getlist", new
                {
                    PageIndex = PageIndex,
                    PageSize = PageSize,
                    FilterQuery = " DONEARRIVALDATE IS NULL ",
                    OrderBy = orderby
                });
                return Json(resultJson, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(ErrorHelper.Current.ErrorValidateData(), JsonRequestBehavior.AllowGet);
            }

        }

        [CommonAuthen]
        public ActionResult Detail(string id)
        {
            MD_IMPORTDETAIL model = new MD_IMPORTDETAIL();
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTDETAIL>>>("importdetail/getdetail", new
                {
                    id = id
                });
                if (result.IsOk)
                {
                    model = result.dataObj.FirstOrDefault();
                }
            }
            ImportFileDetailViewModel resultView = new ImportFileDetailViewModel();
            resultView = ModelHelper.ConvertHelper.Current.ConvertObjToObj<ImportFileDetailViewModel, MD_IMPORTDETAIL>(model);
            resultView.AutoInitLink();
            return View(resultView);
        }

        [CommonAuthen]
        public JsonResult GetPalletCode(string info)
        {
            ImportPalletPrint model = new ImportPalletPrint();
            if (!string.IsNullOrEmpty(info))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<ImportPalletPrint>>>("importpallet/getdetailbycode", new
                {
                    code = info
                });
                if (!result.IsOk)
                {
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var resultDB = result.dataObj.FirstOrDefault();
                    model = resultDB;
                    return Json(new JsonResultData
                    {
                        IsOk = true,
                        dataObj = model,
                        totalrows = 1,
                        Msg = string.Empty,
                        dataErr = null
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataErr = null,
                    Msg = "param null",
                    dataObj = null,
                    totalrows = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [CommonAuthen]
        public JsonResult GetPalletCodeByContainer(string code, string impfile)
        {
            MD_IMPPALLET model = new MD_IMPPALLET();

            var result = APIHelper.CallAPI<JsonResultObject<List<MD_IMPPALLET>>>("importpallet/getdetailbypkl", new
            {
                code = code,
                impfile = impfile
            });
            if (!result.IsOk)
            {
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                //model = result.dataObj.FirstOrDefault();
                List<string> modelList = new List<string>();
                if (result.dataObj == null)
                    return Json(result, JsonRequestBehavior.AllowGet);

                foreach (var item in result.dataObj)
                {
                    modelList.Add(item.SCANCODE);
                }
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = modelList,
                    totalrows = 1,
                    Msg = string.Empty,
                    dataErr = null
                }, JsonRequestBehavior.AllowGet);

            }

        }

        [CommonAuthen]
        public ActionResult CreateNew()
        {
            return View();
        }

        [HttpPost]
        [CommonAuthen]
        public JsonResult Save(ImportFileViewModel info)
        {
            info.CREATEDDATE = DateTime.Now;
            info.CREATEDUSER = LoginUser.Current.USERNAME;
            MD_IMPORTDETAIL detail = info.GetDetailImportFile();
            var resultJson = APIHelper.CallAPI<JsonResultData>("importdetail/Insert", new
            {
                data = detail
            });
            if (!resultJson.IsOk)
                return Json(resultJson, JsonRequestBehavior.AllowGet);
            var lstCnt = info.GetImportContainer();
            foreach (var cnt in lstCnt)
            {
                resultJson = APIHelper.CallAPI<JsonResultData>("importpkl/Insert", new
                {
                    data = cnt
                });
                if (!resultJson.IsOk)
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
            }
            var lstPallet = info.GetImportPallet();
            foreach (var pallet in lstPallet)
            {
                var searchcontract = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTCONTRACT>>>("importcontract/getdetailbycode", new
                {
                    code = detail.IMPORTCONTRACTCODE
                });
                if (!searchcontract.IsOk)
                    return Json(searchcontract, JsonRequestBehavior.AllowGet);
                var contract = searchcontract.dataObj.First();
                var fullcontract = new ImpContractEditViewModel(contract);
                var supplier = fullcontract.SupplierDetail.SUPPLIERNAME;
                var material = APIHelper.CallAPI<JsonResultObject<List<MD_MATERIAL>>>("material/getdetail", new
                {
                    id = pallet.MATERIALID
                });
                if (!material.IsOk)
                    return Json(material, JsonRequestBehavior.AllowGet);
                var materialName = material.dataObj != null ? material.dataObj.FirstOrDefault().NAME : string.Empty;
                var submaterialName = string.Empty;
                if (pallet.SUBMATERIALID.HasValue)
                {
                    var submaterial = APIHelper.CallAPI<JsonResultObject<List<MD_SUBMATERIAL>>>("submaterial/getdetail", new
                    {
                        id = pallet.SUBMATERIALID.Value
                    });
                    if (!submaterial.IsOk)
                        return Json(submaterial, JsonRequestBehavior.AllowGet);
                    submaterialName = submaterial.dataObj != null ? submaterial.dataObj.FirstOrDefault().NAME : string.Empty;
                }
                string Origin = string.Empty;
                var Sorigin = fullcontract.ItemList.Where(x => x.MATERIALID == pallet.MATERIALID && pallet.SUBMATERIALID.HasValue ? pallet.SUBMATERIALID.Value == x.SUBMATERIALID.Value : !x.SUBMATERIALID.HasValue);
                if (Sorigin.Count() > 0)
                {
                    Origin = Sorigin.First().ORIGIN;
                }
                var fullNameMaterial = materialName + (string.IsNullOrEmpty(submaterialName) ? "" : " " + submaterialName);
                string objectSerialize = string.Format("LAMIPEL ERP\nMaterial:{5}\nPallet No:{0}\nFile No:{1}\nSupplier:{2}\nContract No:{3}\nInvoice PKL:{4}\nContainer:{6}\nPCS:{7}\nNW:{8}\nSQFT:{9}\nSAVG:{10}\nWAVG:{11}", string.IsNullOrEmpty(pallet.PALLETDONECODE) ? "" : pallet.PALLETDONECODE, detail.IMPFILE, supplier, contract.IMPORTCODE, detail.INVOICE, fullNameMaterial, pallet.IMPORTPKL, pallet.PCS, pallet.NW, pallet.SQFT, pallet.SAVG, pallet.WAVG);
                pallet.SCANCODE = Barcode.Current.CreateQRString(objectSerialize);
                List<string> dataprint = new List<string>();
                dataprint.Add(string.IsNullOrEmpty(pallet.PALLETDONECODE) ? "" : pallet.PALLETDONECODE); //dataprint.Add(pallet.NAME);
                dataprint.Add(materialName);
                dataprint.Add(submaterialName);
                dataprint.Add(pallet.PCS.HasValue ? pallet.PCS.Value.ToString("#,##0") : "0");
                dataprint.Add(pallet.NW.HasValue ? pallet.NW.Value.ToString("#,##0") : "0");
                dataprint.Add(lstCnt.Where(x=>x.PKLNAME == pallet.IMPORTPKL).First().PKLIDENTITY);//dataprint.Add(pallet.WAVG.HasValue ? pallet.WAVG.Value.ToString("#,##0") : "0");
                dataprint.Add(pallet.SQFT.HasValue ? pallet.SQFT.Value.ToString("#,##0") : "0");
                dataprint.Add(Origin);//origin
                dataprint.Add(info.ISLWG ? "YES" : "NO");//lwg
                dataprint.Add(pallet.SCANCODE);
                var cnt = lstCnt.Where(x => x.PKLNAME == pallet.IMPORTPKL && x.IMPFILE == detail.IMPFILE);
                dataprint.Add(cnt != null && cnt.Count() > 0 ? cnt.First().PKLDONECODE : "");//dataprint.Add(pallet.IMPORTPKL);
                dataprint.Add(supplier.Length > 15 ? supplier.Substring(0, 15) : supplier);
                pallet.TEMPLATEPRINT = BarcodeHelper.XMLHelper.Current.BuilResouce("ImportLabelPrint", dataprint.ToArray());
                resultJson = APIHelper.CallAPI<JsonResultData>("importpallet/Insert", new
                {
                    data = pallet
                });
                if (!resultJson.IsOk)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CommonAuthen]
        public JsonResult Update(ImportFileDetailViewModel info)
        {
            info.UPDATEDDATE = DateTime.Now;
            info.UPDATEDUSER = LoginUser.Current.USERNAME;
            MD_IMPORTDETAIL detail = info.GetDetailImportFile();
            var resultJson = APIHelper.CallAPI<JsonResultData>("importdetail/Update", new
            {
                data = detail
            });
            if (!resultJson.IsOk)
                return Json(resultJson, JsonRequestBehavior.AllowGet);
            var lstCnt = info.GetImportContainer();
            foreach (var cnt in lstCnt)
            {
                if (cnt.ID != 0)
                {
                    resultJson = APIHelper.CallAPI<JsonResultData>("importpkl/Update", new
                    {
                        data = cnt
                    });
                    if (!resultJson.IsOk)
                        return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    resultJson = APIHelper.CallAPI<JsonResultData>("importpkl/Insert", new
                    {
                        data = cnt
                    });
                    if (!resultJson.IsOk)
                        return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
            }
            var lstPallet = info.GetImportPallet();
            foreach (var pallet in lstPallet)
            {
                var searchcontract = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTCONTRACT>>>("importcontract/getdetailbycode", new
                {
                    code = detail.IMPORTCONTRACTCODE
                });
                if (!searchcontract.IsOk)
                    return Json(searchcontract, JsonRequestBehavior.AllowGet);
                var contract = searchcontract.dataObj.First();
                var fullcontract = new ImpContractEditViewModel(contract);
                var supplier = fullcontract.SupplierDetail.SUPPLIERNAME;
                var material = APIHelper.CallAPI<JsonResultObject<List<MD_MATERIAL>>>("material/getdetail", new
                {
                    id = pallet.MATERIALID
                });
                if (!material.IsOk)
                    return Json(material, JsonRequestBehavior.AllowGet);
                var materialName = material.dataObj != null ? material.dataObj.FirstOrDefault().NAME : string.Empty;
                var submaterialName = string.Empty;
                if (pallet.SUBMATERIALID.HasValue)
                {
                    var submaterial = APIHelper.CallAPI<JsonResultObject<List<MD_SUBMATERIAL>>>("submaterial/getdetail", new
                    {
                        id = pallet.SUBMATERIALID.Value
                    });
                    if (!submaterial.IsOk)
                        return Json(submaterial, JsonRequestBehavior.AllowGet);
                    submaterialName = submaterial.dataObj != null ? submaterial.dataObj.FirstOrDefault().NAME : string.Empty;
                }
                string Origin = string.Empty;
                var Sorigin = fullcontract.ItemList.Where(x => x.MATERIALID == pallet.MATERIALID && pallet.SUBMATERIALID.HasValue ? pallet.SUBMATERIALID.Value == x.SUBMATERIALID.Value : !x.SUBMATERIALID.HasValue);
                if (Sorigin.Count() > 0)
                {
                    Origin = Sorigin.First().ORIGIN;
                }
                var fullNameMaterial = materialName + (string.IsNullOrEmpty(submaterialName) ? "" : " " + submaterialName);
                string objectSerialize = string.Format("LAMIPEL ERP\nMaterial:{5}\nPallet No:{0}\nFile No:{1}\nSupplier:{2}\nContract No:{3}\nInvoice PKL:{4}\nContainer:{6}\nPCS:{7}\nNW:{8}\nSQFT:{9}\nSAVG:{10}\nWAVG:{11}", string.IsNullOrEmpty(pallet.PALLETDONECODE) ? "" : pallet.PALLETDONECODE, detail.IMPFILE, supplier, contract.IMPORTCODE, detail.INVOICE, fullNameMaterial, pallet.IMPORTPKL, pallet.PCS, pallet.NW, pallet.SQFT, pallet.SAVG, pallet.WAVG);
                pallet.SCANCODE = Barcode.Current.CreateQRString(objectSerialize);
                List<string> dataprint = new List<string>();
                dataprint.Add(string.IsNullOrEmpty(pallet.PALLETDONECODE) ? "" : pallet.PALLETDONECODE);//dataprint.Add(pallet.NAME);
                dataprint.Add(materialName);
                dataprint.Add(submaterialName);
                dataprint.Add(pallet.PCS.HasValue ? pallet.PCS.Value.ToString("#,##0") : "0");
                dataprint.Add(pallet.NW.HasValue ? pallet.NW.Value.ToString("#,##0") : "0");
                dataprint.Add(lstCnt.Where(x => x.PKLNAME == pallet.IMPORTPKL).First().PKLIDENTITY);//dataprint.Add(pallet.WAVG.HasValue ? pallet.WAVG.Value.ToString("#,##0") : "0");
                dataprint.Add(pallet.SQFT.HasValue ? pallet.SQFT.Value.ToString("#,##0") : "0");
                dataprint.Add(Origin);//origin
                dataprint.Add(info.ISLWG ? "YES" : "NO");//lwg
                dataprint.Add(pallet.SCANCODE);
                var cnt = lstCnt.Where(x => x.PKLNAME == pallet.IMPORTPKL && x.IMPFILE == detail.IMPFILE);
                dataprint.Add(cnt != null && cnt.Count() > 0 ? cnt.First().PKLDONECODE : ""); //dataprint.Add(pallet.IMPORTPKL);
                dataprint.Add(supplier.Length > 15 ? supplier.Substring(0, 15) : supplier);
                pallet.TEMPLATEPRINT = BarcodeHelper.XMLHelper.Current.BuilResouce("ImportLabelPrint", dataprint.ToArray());
                if (pallet.ID == 0)
                {
                    pallet.CREATEDDATE = DateTime.Now;
                    pallet.CREATEDUSER = LoginUser.Current.USERNAME;
                    resultJson = APIHelper.CallAPI<JsonResultData>("importpallet/Insert", new
                    {
                        data = pallet
                    });
                    if (!resultJson.IsOk)
                        return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    pallet.UPDATEDDATE = DateTime.Now;
                    pallet.UPDATEDUSER = LoginUser.Current.USERNAME;
                    resultJson = APIHelper.CallAPI<JsonResultData>("importpallet/Update", new
                    {
                        data = pallet
                    });
                    if (!resultJson.IsOk)
                        return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [CommonAuthen]
        [HttpPost]
        public JsonResult Delete(string id = "")
        {
            if (!string.IsNullOrEmpty(id))
            {
                return Json(APIHelper.CallAPI<JsonResultData>("importdetail/delete", new
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
        public JsonResult UploadFilePallet(HttpPostedFileBase file)
        {
            List<PalletImportExcel> lst = new List<PalletImportExcel>();
            try
            {
                MemoryStream stream = new MemoryStream();
                using (var workBook = new Workbook())
                {
                    //var directory = Directory.GetCurrentDirectory();
                    //string fullPath = filePath + "\\templateReport.xlsx";
                    workBook.LoadDocument(file.InputStream);
                    Worksheet sheet = workBook.Worksheets[0];
                    int beginrow = 1;
                    string palletmerge = "";
                    palletmerge = sheet.Cells[beginrow, 0].Value.ToString();
                    while (!string.IsNullOrEmpty(palletmerge))
                    {
                        Cell dataName = sheet.Cells[beginrow, 0];
                        Cell dataPCS = sheet.Cells[beginrow, 1];
                        Cell dataNW = sheet.Cells[beginrow, 2];
                        Cell dataSQFT = sheet.Cells[beginrow, 3];
                        PalletImportExcel pallet = new PalletImportExcel();
                        pallet.SELECTIONNAME = dataName.Value.ToString();
                        pallet.PCS = dataPCS.Value.ToString();
                        pallet.NW = dataNW.Value.ToString();
                        pallet.SQFT = dataSQFT.Value.ToString();
                        lst.Add(pallet);
                        beginrow++;
                        palletmerge = sheet.Cells[beginrow, 0].Value.ToString();
                    }

                }
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = lst,
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    Msg = ex.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult UploadFilePalletAll(HttpPostedFileBase file)
        {
            List<PalletImportExcel> lst = new List<PalletImportExcel>();
            try
            {
                MemoryStream stream = new MemoryStream();
                using (var workBook = new Workbook())
                {
                    //var directory = Directory.GetCurrentDirectory();
                    //string fullPath = filePath + "\\templateReport.xlsx";
                    workBook.LoadDocument(file.InputStream);
                    Worksheet sheet = workBook.Worksheets[0];
                    int beginrow = 1;
                    string palletmerge = "";
                    palletmerge = sheet.Cells[beginrow, 0].Value.ToString();
                    while (!string.IsNullOrEmpty(palletmerge))
                    {
                        Cell dataName = sheet.Cells[beginrow, 0];
                        Cell dataPCS = sheet.Cells[beginrow, 1];
                        Cell dataNW = sheet.Cells[beginrow, 2];
                        Cell dataSQFT = sheet.Cells[beginrow, 3];
                        Cell dataPKL = sheet.Cells[beginrow, 4];
                        PalletImportExcel pallet = new PalletImportExcel();
                        pallet.SELECTIONNAME = dataName.Value.ToString();
                        pallet.PCS = dataPCS.Value.ToString();
                        pallet.NW = dataNW.Value.ToString();
                        pallet.SQFT = dataSQFT.Value.ToString();
                        pallet.PKLIDENTITY = dataPKL.Value.ToString();
                        lst.Add(pallet);
                        beginrow++;
                        palletmerge = sheet.Cells[beginrow, 0].Value.ToString();
                    }

                }
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = lst,
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    Msg = ex.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [CommonAuthen]
        public JsonResult exportexcel(string pageindex, string pagesize, string filterquery = "", string listColumn = "")
        {
            try
            {
                var resultJson = APIHelper.CallAPI<JsonResultData>("importdetail/exportexcelfilter", new
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