using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Xml;

namespace LogisticWeb.Common
{
    public class XMLHelper
    {
        private static XMLHelper _current = new XMLHelper();

        public static XMLHelper Current
        {
            get
            {
                return _current != null ? _current : new XMLHelper();
            }
        }

        public string BuilResouce(string NameTemplate, string[] arrayData = null)
        {
            if (arrayData != null)
            {
                return new StringBuilder().AppendFormat(GetXmlResource(NameTemplate), arrayData).ToString();
            }
            else
            {
                return new StringBuilder().Append(GetXmlResource(NameTemplate)).ToString();
            }
        }

        public string GetXmlResource(string name)
        {
            StringBuilder obj = new StringBuilder();
            string pathMapXML = ConfigurationManager.AppSettings["mapFile:Template"];
            using (XmlTextReader reader = new XmlTextReader(HttpContext.Current.Server.MapPath(pathMapXML)))
            {
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.Load(reader);

                var nodes = xmlDoc.DocumentElement.SelectSingleNode("//templateSrc");
                for (int i = 0; i < nodes.ChildNodes.Count; i++)
                {
                    string ItemName = nodes.ChildNodes.Item(i).Attributes.Item(0).InnerText;
                    if (ItemName.ToLower() == name.ToLower())
                    {
                        string ItemValue = nodes.ChildNodes.Item(i).InnerText;
                        if (!string.IsNullOrEmpty(ItemValue))
                        {
                            var templateFileUrl = HttpContext.Current.Server.MapPath(ItemValue);
                            obj.Append(File.ReadAllText(templateFileUrl));
                        }
                    }
                    
                }
            }
            return obj.ToString();
        }
    }
}