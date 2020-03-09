using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Web;
using LogisticWeb.Models;
using Zen.Barcode;
using System.Drawing;
using System.Drawing.Imaging;
using ModelHelper;
using ZXing;
using ZXing.QrCode;
using ZXing.QrCode.Internal;
using System.Windows.Media.Imaging;
using ModelHelper.ViewModel;

namespace LogisticWeb.Common
{
    public class BarcodeHelper
    {
        private static BarcodeHelper _current = new BarcodeHelper();

        public static BarcodeHelper Current
        {
            get
            {
                return _current != null ? _current : new BarcodeHelper();
            }
        }
        //public JsonResultData CreateBarcode(string str)
        //{
        //    try
        //    {
        


        //        Code128BarcodeDraw barcode = BarcodeDrawFactory.Code128WithChecksum;
        //        var image = barcode.Draw(str, 50);

        //        using (var graphics = Graphics.FromImage(image))
        //        using (var font = new Font("Consolas", 12)) // Any font you want
        //        using (var brush = new SolidBrush(Color.White))
        //        using (var format = new StringFormat() { LineAlignment = StringAlignment.Center }) // To align text above the specified point
        //        {
        //            // Print a string at the left bottom corner of image
        //            graphics.DrawString(str, font, brush, 0, image.Height, format);
        //        }
        //        byte[] arr;
        //        using (var memStream = new MemoryStream())
        //        {
        //            image.Save(memStream, ImageFormat.Png);
        //            arr = memStream.ToArray();
        //        }
        //        return new JsonResultData
        //        {
        //            IsOk = true,
        //            dataObj = Convert.ToBase64String(arr),
        //            dataErr = null,
        //            Msg = string.Empty
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        return new JsonResultData
        //        {
        //            IsOk = false,
        //            dataObj = null,
        //            dataErr = ex,
        //            Msg = ex.ToString()
        //        };
        //    }
        //}

        //public JsonResultData CreateQRCode(QRCodeViewModel paramsdata)
        //{
        //    try
        //    {
        //        string UrlPath = HttpContext.Current.Server.MapPath("/BarcodeImg");
        //        string FullPath = UrlPath + "\\" + paramsdata.NAME + ".jpg";
        //        string DomainPath = ConfigurationManager.AppSettings["hostSetting"] + "BarcodeImg/" + paramsdata.NAME + ".jpg";
        //        string objectSerialize = JsonConvert.SerializeObject(paramsdata);
        //        var qrCodeWriter = new BarcodeWriter
        //        {
        //            Format = BarcodeFormat.QR_CODE,
        //            Options = new QrCodeEncodingOptions
        //            {
        //                Margin = 1,
        //                Height = 200,
        //                Width = 200,
        //                ErrorCorrection = ErrorCorrectionLevel.Q,
        //            },
        //        };
        //        var writeableBitmap = qrCodeWriter.Write(objectSerialize);
        //        var memoryStream = new MemoryStream();
        //        writeableBitmap.Save(FullPath);
        //        //string stringRawImg = string.Empty;
        //        //using (Image image = Image.FromFile(FullPath))
        //        //{
        //        //    using (MemoryStream m = new MemoryStream())
        //        //    {
        //        //        image.Save(m, image.RawFormat);
        //        //        byte[] imageBytes = m.ToArray();
        //        //        stringRawImg = Convert.ToBase64String(imageBytes);
        //        //    }
        //        //}
        //        return new JsonResultData
        //        {
        //            IsOk = true,
        //            dataObj = DomainPath,
        //            dataErr = null,
        //            Msg = string.Empty
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        return new JsonResultData
        //        {
        //            IsOk = false,
        //            dataObj = string.Empty,
        //            dataErr = ex,
        //            Msg = ex.ToString()
        //        };
        //    }
        //}

        public string CreateQRCodeRawString(QRCodeViewModel paramsdata)
        {
            try
            {
                string UrlPath = HttpContext.Current.Server.MapPath("/BarcodeImg");
                string FullPath = UrlPath + "\\" + paramsdata.NAME + ".jpg";
                string DomainPath = ConfigurationManager.AppSettings["hostSetting"] + "BarcodeImg/" + paramsdata.NAME + ".jpg";
                string objectSerialize = string.Format("LAMIPEL ERP\nSelection: {4} {5} \nPallet No: {0} \nLayer: {6} \nNet Weight: {1} KGS \nGross Weight: {2} KGS \nSquare Foot: {7} \nRESA: {3} \nProd.PKL: {8}", paramsdata.NAME, paramsdata.NETWEIGHT, paramsdata.GROSSWEIGHT, paramsdata.RESACODE, paramsdata.SELECTION, paramsdata.SUBSELECTION, paramsdata.HIDE, paramsdata.SQUAREFOOT, paramsdata.CONTAINERID);
                var qrCodeWriter = new BarcodeWriter
                {
                    Format = BarcodeFormat.QR_CODE,
                    Options = new QrCodeEncodingOptions
                    {
                        Margin = 1,
                        Height = 200,
                        Width = 200,
                        ErrorCorrection = ErrorCorrectionLevel.Q,
                    },
                };
                var writeableBitmap = qrCodeWriter.Write(objectSerialize);
                var memoryStream = new MemoryStream();
                writeableBitmap.Save(FullPath);
                string stringRawImgSave = "data:image/*;base64,";
                string stringRawImg = string.Empty;
                using (Image image = Image.FromFile(FullPath))
                {
                    using (MemoryStream m = new MemoryStream())
                    {
                        image.Save(m, image.RawFormat);
                        byte[] imageBytes = m.ToArray();
                        stringRawImg = Convert.ToBase64String(imageBytes);
                    }
                }
                stringRawImgSave += stringRawImg;
                File.Delete(FullPath);
                return stringRawImgSave;
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
        }
        public JsonResultData CreateQRCodeRaw(QRCodeViewModel paramsdata)
        {
            try
            {
                string UrlPath = HttpContext.Current.Server.MapPath("/BarcodeImg");
                string FullPath = UrlPath + "\\" + paramsdata.NAME + ".jpg";
                string DomainPath = ConfigurationManager.AppSettings["hostSetting"] + "BarcodeImg/" + paramsdata.NAME + ".jpg";
                string objectSerialize = string.Format("LAMIPEL ERP\nSelection: {4} {5} \nPallet No: {0} \nLayer: {6} \nNet Weight: {1} KGS \nGross Weight: {2} KGS \nSquare Foot: {7} \nRESA: {3} \nProd.PKL: {8}", paramsdata.NAME, paramsdata.NETWEIGHT, paramsdata.GROSSWEIGHT, paramsdata.RESACODE, paramsdata.SELECTION, paramsdata.SUBSELECTION, paramsdata.HIDE, paramsdata.SQUAREFOOT, paramsdata.CONTAINERID);
                var qrCodeWriter = new BarcodeWriter
                {
                    Format = BarcodeFormat.QR_CODE,
                    Options = new QrCodeEncodingOptions
                    {
                        Margin = 1,
                        Height = 200,
                        Width = 200,
                        ErrorCorrection = ErrorCorrectionLevel.Q,
                    },
                };
                var writeableBitmap = qrCodeWriter.Write(objectSerialize);
                var memoryStream = new MemoryStream();
                writeableBitmap.Save(FullPath);
                string stringRawImgSave = "data:image/*;base64,";
                string stringRawImg = string.Empty;
                using (Image image = Image.FromFile(FullPath))
                {
                    using (MemoryStream m = new MemoryStream())
                    {
                        image.Save(m, image.RawFormat);
                        byte[] imageBytes = m.ToArray();
                        stringRawImg = Convert.ToBase64String(imageBytes);
                    }
                }
                stringRawImgSave += stringRawImg;
                File.Delete(FullPath);
                return new JsonResultData
                {
                    IsOk = true,
                    dataObj = stringRawImgSave,
                    dataErr = null,
                    Msg = string.Empty
                };
            }
            catch (Exception ex)
            {
                return new JsonResultData
                {
                    IsOk = false,
                    dataObj = string.Empty,
                    dataErr = ex,
                    Msg = ex.ToString()
                };
            }
        }

        public string CreateQRString(string input)
        {
            try
            {
                string UrlPath = HttpContext.Current.Server.MapPath("/BarcodeImg");
                string FullPath = UrlPath + "\\QRString.jpg";
                string DomainPath = ConfigurationManager.AppSettings["hostSetting"] + "BarcodeImg/QRString.jpg";
                var qrCodeWriter = new BarcodeWriter
                {
                    Format = BarcodeFormat.QR_CODE,
                    Options = new QrCodeEncodingOptions
                    {
                        Margin = 1,
                        Height = 200,
                        Width = 200,
                        ErrorCorrection = ErrorCorrectionLevel.Q,
                    },
                };
                var writeableBitmap = qrCodeWriter.Write(input);
                var memoryStream = new MemoryStream();
                writeableBitmap.Save(FullPath);
                string stringRawImgSave = "data:image/*;base64,";
                string stringRawImg = string.Empty;
                using (Image image = Image.FromFile(FullPath))
                {
                    using (MemoryStream m = new MemoryStream())
                    {
                        image.Save(m, image.RawFormat);
                        byte[] imageBytes = m.ToArray();
                        stringRawImg = Convert.ToBase64String(imageBytes);
                    }
                }
                stringRawImgSave += stringRawImg;
                return stringRawImgSave;
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
        }
    }
}