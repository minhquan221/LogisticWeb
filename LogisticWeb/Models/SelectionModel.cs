using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LogisticWeb.Models
{
    [DisplayName("Selection")]
    public class SelectionModel
    {
        [DisplayName("SelectionName")]
        public string SelectionName { get; set; }
        
    }
}