using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LogisticWeb.Models
{
    public class templateLoadModel
    {
        string Name { get; set; }
        [AllowHtml]
        List<string> array { get; set; }
    }
}