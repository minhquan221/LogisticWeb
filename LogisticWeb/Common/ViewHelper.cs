using ModelHelper;
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

namespace LogisticWeb.Common
{
    public static class ViewHelperExtension
    {
        public static string FormatDecimal(this decimal data, int numdecimal = 2)
        {
            string deci = string.Empty;
            for(int i = 1; i <= numdecimal; i++)
            {
                deci += "0";
            }
            return data.ToString("0." + deci);
        }
        public static string FormatDecimal(this decimal? data, int numdecimal = 2)
        {
            string deci = string.Empty;
            for (int i = 1; i <= numdecimal; i++)
            {
                deci += "0";
            }
            return data.HasValue && data.Value != 0 ? data.Value.ToString("0." + deci) : "0." + deci;
        }

        public static string FormatDate(this DateTime? data)
        {
            return data.HasValue ? data.Value.ToString("MM/dd/yyyy") : "";
        }
        public static string FormatDate(this DateTime data)
        {
            return data.ToString("MM/dd/yyyy");
        }

        
    }
}