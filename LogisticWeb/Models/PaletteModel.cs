using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace LogisticWeb.Models
{
    public class PaletteModel
    {
        public string PaletteID { get; set; }
        public string DVT { get; set; }
        public string Selection { get; set; }
        public string CreateDate { get; set; }
        public string FullPaletteCode { get; set; }
        public string Barcode { get; set; }
    }
}