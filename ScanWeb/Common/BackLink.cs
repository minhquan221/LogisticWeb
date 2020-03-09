using ModelDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ScanWeb.Common
{
    public class BackLink
    {
        public static string _current = string.Empty;

        public static string Current
        {
            get
            {
                return !string.IsNullOrEmpty(_current) ? _current : string.Empty;
            }
        }
    }
}