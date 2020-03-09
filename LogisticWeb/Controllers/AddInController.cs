using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using BarcodeHelper;

namespace LogisticWeb.Controllers
{
    
    public class AddInController : BaseController
    {
        public ActionResult ConvertToQR()
        {
            return View();
        }

        public ActionResult CreateHash()
        {
            return View();
        }

        public ActionResult MiniGame()
        {
            return View();
        }


        [HttpPost]
        public JsonResult QRCode(string stringinput)
        {
            var qrCode = Barcode.Current.CreateQRString(stringinput);
            return Json(new { data = qrCode }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult HashString(string stringinput)
        {
            var stringHash = EncryptLibrary.Cryptography.Current.HashPassword(stringinput);
            return Json(new { data = stringHash }, JsonRequestBehavior.AllowGet);
        }
    }
}