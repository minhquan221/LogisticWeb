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
using System.IO;
using DevExpress.Spreadsheet;
using System.ComponentModel;

namespace LogisticWeb.Controllers
{
    public class ResaController : BaseController
    {
        [HttpPost]
        //[CommonAction]
        public JsonResult SearchResa(string inputstring)
        {
            try
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<SYS_RESA>>>("resa/searchsuggestion",
                    new { inputstring });
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
        public JsonResult GetPalletCode(string resacode, string mergeselectionid)
        {
            try
            {
                string[] splitselectionid = mergeselectionid.Split('_');
                string selectionid = splitselectionid[0];
                string subselectionid = splitselectionid[1];
                var result = APIHelper.CallAPI<JsonResultData>("uncompletepallet/getprintcode", new
                {
                    resacode = resacode,
                    selectionid = selectionid,
                    subselectionid = subselectionid
                });
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
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

        [HttpPost]
        public JsonResult GetNavigator(string resacode = "")
        {
            try
            {
                ResaView model = new ResaView();
                var result = APIHelper.CallAPI<JsonResultObject<List<ResaView>>>("resa/getdetailbyresacode", new
                {
                    resa = resacode
                });
                if (result.IsOk)
                {
                    model = result.dataObj.FirstOrDefault();
                }
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = model.NAVIGATOR
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    Msg = ex.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }


        [CommonAuthen]
        public ActionResult Detail(string id = "")
        {
            ResaView model = new ResaView();
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<ResaView>>>("resa/getdetailbyresacode", new
                {
                    resa = id
                });
                if (result.IsOk)
                {
                    model = result.dataObj.FirstOrDefault();
                }

                //var resaproductiontableresult = APIHelper.CallAPI<JsonResultObject<List<ResaProductionTable>>>("resa/GetListProductionTable", new
                //{
                //    Resacode = id
                //});
                //if (resaproductiontableresult.IsOk)
                //{
                //    ViewBag.ProductionTable = resaproductiontableresult.dataObj;
                //}
                List<MD_PALETTE> importedSelect = new List<MD_PALETTE>();
                List<ImpPalletReport> importedMaterial = new List<ImpPalletReport>();
                var requestselectionimported = APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("pallet/getlistSemiImported", new
                {
                    resacode = id
                });

                if (requestselectionimported.IsOk)
                {
                    if (requestselectionimported.dataObj != null)
                    {
                        importedSelect = requestselectionimported.dataObj;
                    }
                    ViewBag.ListSemiImported = importedSelect;
                }
                //var requestmaterialimported = APIHelper.CallAPI<JsonResultObject<List<ImpPalletView>>>("importpallet/getlistpalletresaimported", new
                //{
                //    resacode = id
                //});

                var requestmaterialimported = APIHelper.CallAPI<JsonResultObject<List<ImpPalletReport>>>("importpallet/getlistpalletresaimportedforreport", new
                {
                    resacode = id
                });

                if (requestmaterialimported.IsOk)
                {
                    if (requestmaterialimported.dataObj != null)
                    {
                        importedMaterial = requestmaterialimported.dataObj;
                        string pkl = importedMaterial.Count > 0 ? importedMaterial.First().IMPORTPKL : "";
                        if (!string.IsNullOrEmpty(pkl))
                        {
                            var getpklid = APIHelper.CallAPI<JsonResultObject<List<MD_IMPORTPKL>>>("importpkl/getlist", new
                            {
                                PageIndex = 0,
                                PageSize = -1,
                                FilterQuery = string.Format(" PKLNAME ='{0}' ", pkl),
                                Order = " ID ASC "
                            });
                            if (getpklid.IsOk)
                            {
                                var pklid = getpklid.dataObj.First().ID;
                                ViewBag.Cnt = pklid;
                            }
                        }
                    }
                    ViewBag.ListMaterialImported = importedMaterial;
                }
                int TypeShow = 0;
                if (importedSelect.Count > 0)
                {
                    TypeShow = 1;
                }
                else if (importedMaterial.Count > 0)
                {
                    TypeShow = 2;
                }
                ViewBag.ShowType = TypeShow;

                //List<ImportPklUndone> pklUndone = new List<ImportPklUndone>();
                //var getlistcntundone = APIHelper.CallAPI<JsonResultObject<List<ImportPklUndone>>>("importpkl/getlistcntundone");
                //if (getlistcntundone.IsOk)
                //{
                //    if (getlistcntundone.dataObj != null)
                //    {
                //        pklUndone = getlistcntundone.dataObj;
                //    }
                //    ViewBag.listcontainerUndone = pklUndone;
                //}

                var resultResaTableNotUse = APIHelper.CallAPI<JsonResultObject<List<SYS_UNCOMPLETEPALLET>>>("resa/getlistresatablenotuse");
                if (resultResaTableNotUse.IsOk)
                {
                    ViewBag.ResaStartList = resultResaTableNotUse.dataObj;
                }
            }
            return View(model);
        }

        [HttpPost]
        //[CommonAction]
        public JsonResult SearchFilterResaStart(string lstStartResacode)
        {
            try
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<ResaTableNotUse>>>("resa/getlistresatablenotuse",
                    new { lstStartResacode });
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
        public ActionResult CreateNew()
        {
            return View();
        }

        [HttpGet]
        public PartialViewResult ResaTable(List<ResaProductionTable> model = null, List<string> filter = null)
        {
            if (filter == null || filter.Count == 0)
            {
                filter = new List<string> { "PCS", "KGS", "SQFT" };
            }
            ViewBag.Filter = filter;
            return PartialView(model == null ? new List<ResaProductionTable>() : model);
        }

        [HttpPost]
        public JsonResult ResaTableBuildJS(string resacode, string listfilter = "")
        {
            if (string.IsNullOrEmpty(listfilter))
            {
                var lst = new List<string> { "PCS", "KGS", "SQFT" };
                ViewBag.Filter = lst;
            }
            else
            {
                var lst = listfilter.Split(',');

                ViewBag.Filter = lst.ToList();
            }

            var resaproductiontableresult = APIHelper.CallAPI<JsonResultObject<List<ResaProductionTable>>>("resa/GetListProductionTable", new
            {
                Resacode = resacode
            });
            //if (resaproductiontableresult.IsOk)
            //{
            //    ViewBag.ProductionTable = resaproductiontableresult.dataObj;
            //}

            var resultSelectInOne = APIHelper.CallAPI<JsonResultObject<List<SelectionOneList>>>("selection/getselectionfull");
            //if (resultSelectInOne.IsOk)
            //{
            //    ViewBag.SelectInOne = resultSelectInOne.dataObj;
            //}
            return Json(new
            {
                IsOk = true,
                ProductionTable = resaproductiontableresult.dataObj,
                SelectInOne = resultSelectInOne.dataObj,
                listfilter = listfilter
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public PartialViewResult ResaTableFilterJS(string resacode, string listfilter = "")
        {
            if (string.IsNullOrEmpty(listfilter))
            {
                var lst = new List<string> { "PCS", "KGS", "SQFT" };
                ViewBag.Filter = lst;
            }
            else
            {
                var lst = listfilter.Split(',');

                ViewBag.Filter = lst.ToList();
            }

            var resaproductiontableresult = APIHelper.CallAPI<JsonResultObject<List<ResaProductionTable>>>("resa/GetListProductionTable", new
            {
                Resacode = resacode
            });
            if (resaproductiontableresult.IsOk)
            {
                ViewBag.ProductionTable = resaproductiontableresult.dataObj;
            }

            var resultSelectInOne = APIHelper.CallAPI<JsonResultObject<List<SelectionOneList>>>("selection/getselectionfull");
            if (resultSelectInOne.IsOk)
            {
                ViewBag.SelectInOne = resultSelectInOne.dataObj;
            }
            return PartialView();
        }

        [HttpPost]
        [CommonAuthen]
        public JsonResult Save(SYS_RESA info, List<string> listimp = null, List<string> listsemi = null, List<ResaTableView> resatable = null)
        {
            try
            {
                if (info.ID != 0)
                {
                    //update
                    info.UPDATEDDATE = DateTime.Now;
                    info.UPDATEDUSER = LoginUser.Current.USERNAME;
                    var result = APIHelper.CallAPI<JsonResultData>("resa/update", new
                    {
                        data = info,
                        listimp = listimp,
                        listsemi = listsemi,
                        resatable = resatable
                    });
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    //insert
                    info.CREATEDDATE = DateTime.Now;
                    info.CREATEDUSER = LoginUser.Current.USERNAME;
                    var result = APIHelper.CallAPI<JsonResultData>("resa/insert", new
                    {
                        data = info
                    });
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    Msg = ex.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [CommonAuthen]
        public JsonResult DoneResa(SYS_RESA info, List<string> listimp = null, List<string> listsemi = null, List<ResaTableView> resatable = null)
        {
            if (info.ID != 0)
            {
                //update
                info.UPDATEDDATE = DateTime.Now;
                info.UPDATEDUSER = LoginUser.Current.USERNAME;
                return Json(APIHelper.CallAPI<JsonResultData>("resa/doneresa", new
                {
                    data = info,
                    listimp = listimp,
                    listsemi = listsemi,
                    resatable = resatable
                }), JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(ErrorHelper.Current.ErrorValidateData(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetList(string pageindex, string pagesize, string filterquery = "", string orderby = "")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<ResaListView>>>("resa/getlist", new
                {
                    PageIndex = PageIndex,
                    PageSize = PageSize,
                    FilterQuery = filterquery,
                    OrderBy = orderby
                });
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(ErrorHelper.Current.ErrorValidateData(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetListResa()
        {
            long PageIndex = 0;
            long PageSize = -1;
            return Json(APIHelper.CallAPI<JsonResultObject<List<SYS_RESA>>>("resa/getlist", new
            {
                PageIndex = PageIndex,
                PageSize = PageSize,
                FilterQuery = "",
                OrderBy = " ID ASC "
            }), JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult GetListResaUndone()
        {
            long PageIndex = 0;
            long PageSize = -1;
            return Json(APIHelper.CallAPI<JsonResultObject<List<SYS_RESA>>>("resa/getlistundone", new
            {
                PageIndex = PageIndex,
                PageSize = PageSize,
                FilterQuery = "",
                OrderBy = " ID ASC "
            }), JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult CheckValidTrimTable(string trimname, string resacode = "")
        {
            var resultJson = APIHelper.CallAPI<JsonResultData>("resa/checkvalidtrimtable", new { trimtablename = trimname, resacode = resacode });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CheckValidSelectTable(string selectname, string resacode = "")
        {
            var resultJson = APIHelper.CallAPI<JsonResultData>("resa/checkvalidselecttable", new { selecttable = selectname, resacode = resacode });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult CheckValidShoulderTable(string shouldertable, string resacode = "")
        {
            var resultJson = APIHelper.CallAPI<JsonResultData>("resa/checkvalidshouldertable", new { shouldertable = shouldertable, resacode = resacode });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CommonAuthen]
        public JsonResult GenerateName(string prefix = "")
        {
            var resultJson = APIHelper.CallAPI<JsonResultData>("resa/generatecodename", new { prefix = prefix });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetListTableTrim()
        {
            var result = APIHelper.CallAPI<JsonResultObject<List<SYS_USER>>>("user/getlisttreamtable");
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetListTableSelect()
        {
            var result = APIHelper.CallAPI<JsonResultObject<List<SYS_USER>>>("user/getlistselecttable");
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetListShoulderSelect()
        {
            var result = APIHelper.CallAPI<JsonResultObject<List<SYS_USER>>>("user/getlistshouldertable");
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        //[HttpPost]
        //public JsonResult GetListPalletUnsignContainer(string cnt, string importFile)
        //{
        //    var resultJson = APIHelper.CallAPI<JsonResultData>("importpallet/getlistpalletunsign", new { pklname = cnt, impFile = importFile });
        //    return Json(resultJson, JsonRequestBehavior.AllowGet);
        //}

        [HttpPost]
        public JsonResult GetListPalletUnsignContainer(string cnt)
        {
            var resultJson = APIHelper.CallAPI<JsonResultObject<List<ImpPalletView>>>("importpallet/getlistpalletunsignbyid", new { pklId = cnt });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetListImportFileUndone()
        {
            var resultJson = APIHelper.CallAPI<JsonResultData>("importfile/getlistundone");
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetListCntUndone()
        {
            var resultJson = APIHelper.CallAPI<JsonResultObject<List<ImportPklUndone>>>("importpkl/getlistcntundone");
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult getlistPalletResaImported(string resacode)
        {
            var resultJson = APIHelper.CallAPI<JsonResultObject<List<ImpPalletView>>>("importpallet/getlistpalletresaimported", new
            {
                resacode
            });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(string id = "")
        {
            try
            {
                ResaView model = new ResaView();
                if (!string.IsNullOrEmpty(id))
                {
                    var result = APIHelper.CallAPI<JsonResultObject<List<ResaView>>>("resa/getdetailbyresacode", new
                    {
                        resa = id
                    });
                    if (result.IsOk && result.dataObj != null)
                    {
                        model = result.dataObj.FirstOrDefault();
                        if (model == null)
                        {
                            return Json(new JsonResultData
                            {
                                IsOk = false,
                                Msg = "Data is not exists"
                            }, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            return Json(APIHelper.CallAPI<JsonResultData>("resa/delete", new
                            {
                                resacode = model.RESACODE,
                                username = LoginUser.Current.USERNAME
                            }), JsonRequestBehavior.AllowGet);
                        }
                    }
                    else
                    {
                        return Json(new JsonResultData
                        {
                            IsOk = false,
                            Msg = "Data is not exists"
                        }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(new JsonResultData
                    {
                        IsOk = false,
                        Msg = "ID NULL"
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    Msg = ex.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}