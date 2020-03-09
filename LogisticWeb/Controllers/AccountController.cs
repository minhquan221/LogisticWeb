using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.NetworkInformation;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using ModelDatabase;
using ModelHelper;
using Newtonsoft.Json;
using LogisticWeb.Common;
using LogisticWeb.Models;
using LogisticWeb.Models.ViewModel;
using EncryptLibrary;
using ModelHelper.ViewModel;

namespace LogisticWeb.Controllers
{
    public class AccountController : BaseController
    {
        // GET: Account
        public ActionResult Login(string ReturnUrl = "")
        {
            if (!string.IsNullOrEmpty(ReturnUrl))
                Session[Constants.CurrentLoginUrl] = ReturnUrl;
            return View();
        }

        [HttpPost]
        public JsonResult Login(User info)
        {
            var result = APIHelper.CallAPI<JsonResultObject<SYS_USER>>("user/login", new
            {
                UserName = info.UserName,
                Password = info.Password
            });
            if (result.IsOk)
            {
                result.dataObj.SESSIONID = Guid.NewGuid().ToString();
                var updateSS = APIHelper.CallAPI<JsonResultObject<SYS_USER>>("user/updatesession", result.dataObj);
                if (updateSS.IsOk)
                {
                    UserLogin loginU = ModelHelper.ConvertHelper.Current.ConvertObjToObj<UserLogin, SYS_USER>(result.dataObj);
                    Session[Constants.SessionLogin] = loginU;
                    //Session[Constants.SessionLogin] = (SYS_USER)result.dataObj;
                    return Json(new
                    {
                        IsOk = result.IsOk,
                        dataObj = result.dataObj,
                        Msg = result.Msg,
                        dataErr = result.dataErr,
                        Url = CurrentUrl.Current.ToString()
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new
                    {
                        IsOk = false,
                        Msg = "Error session update",
                        dataObj = string.Empty,
                        dataErr = string.Empty,
                        Url = CurrentUrl.Current.ToString()
                    }, JsonRequestBehavior.AllowGet);
                }
                //Session[Constants.SessionLogin] = (SYS_USER)result.dataObj;
            }
            else
            {
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult Register(UserRegister info)
        {
            if (string.IsNullOrEmpty(info.UserName) || string.IsNullOrEmpty(info.Password) || string.IsNullOrEmpty(info.ConfirmPassword))
            {
                return Json(new
                {
                    IsOk = false,
                    Msg = "Please input all field before submit",
                    dataObj = string.Empty,
                    dataErr = string.Empty,
                    Url = CurrentUrl.Current.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
            if (info.Password != info.ConfirmPassword)
            {
                return Json(new
                {
                    IsOk = false,
                    Msg = "Confirm Password do not match",
                    dataObj = string.Empty,
                    dataErr = string.Empty,
                    Url = CurrentUrl.Current.ToString()
                }, JsonRequestBehavior.AllowGet);
            }

            UserDataModel model = new UserDataModel {
                USERNAME = info.UserName,
                ISADMIN = info.ISADMIN,
                PASSWORD = Cryptography.Current.HashPassword(info.Password),
                USERTYPE = info.USERTYPE,
                NAMETYPE = info.NAMETYPE
            };

            var resultJson = APIHelper.CallAPI<JsonResultObject<SYS_USER>>("user/insert", model);
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [CommonAuthen]
        public ActionResult ChangePassword(string ReturnUrl = "")
        {
            if (!LoginUser.Current.ISADMIN)
            {
                return Redirect("/");
            }
            if (!string.IsNullOrEmpty(ReturnUrl))
                Session[Constants.CurrentLoginUrl] = ReturnUrl;
            return View();
        }

        [HttpPost]
        [CommonAction]
        public JsonResult ChangePass(UserChangePass info)
        {
            if (string.IsNullOrEmpty(info.UserName) || string.IsNullOrEmpty(info.OldPassword) || string.IsNullOrEmpty(info.NewPassword) || string.IsNullOrEmpty(info.ConfirmNewPassword))
            {
                return Json(new
                {
                    IsOk = false,
                    Msg = "Please input all field before submit",
                    dataObj = string.Empty,
                    dataErr = string.Empty,
                    Url = CurrentUrl.Current.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
            if (info.NewPassword != info.ConfirmNewPassword)
            {
                return Json(new
                {
                    IsOk = false,
                    Msg = "Confirm Password do not match",
                    dataObj = string.Empty,
                    dataErr = string.Empty,
                    Url = CurrentUrl.Current.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
            var result = APIHelper.CallAPI<JsonResultObject<SYS_USER>>("user/login", new
            {
                UserName = info.UserName,
                Password = info.OldPassword
            });
            if (!result.IsOk)
            {
                return Json(new
                {
                    IsOk = false,
                    Msg = "Old Password do not match or User is not exists",
                    dataObj = string.Empty,
                    dataErr = string.Empty,
                    Url = CurrentUrl.Current.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
            if (result.IsOk && result.dataObj != null)
            {
                var usData = (SYS_USER)result.dataObj;
                usData.PASSWORD = Cryptography.Current.HashPassword(info.NewPassword);
                var resultUpdate = APIHelper.CallAPI<JsonResultData>("user/updatepassword", new
                {
                    model = usData
                });
                if (resultUpdate.IsOk)
                {
                    return Json(new JsonResultData
                    {
                        IsOk = true,
                        Msg = "Update password Successful"
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new
                    {
                        IsOk = false,
                        Msg = resultUpdate.dataErr
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Register()
        {
            return View();
        }

        //[HttpPost]
        //public JsonResult Register(User info)
        //{
        //    if (!string.IsNullOrEmpty(info.Password))
        //    {
        //        info.Password = CommonCryptography.MD5Hash(info.Password);
        //    }
        //    return Json(Services.UserService.Current.RegisterUser(info), JsonRequestBehavior.AllowGet);
        //}
        public ActionResult LogOut()
        {
            Session.Remove(Constants.SessionLogin);
            Session.Abandon();
            if (Request.Cookies["SessionId_LoginUser"] != null)
            {
                Response.Cookies["SessionId_LoginUser"].Expires = DateTime.Now.AddDays(-1);
            }



            return RedirectToAction("Index", "Home");
        }
    }
}