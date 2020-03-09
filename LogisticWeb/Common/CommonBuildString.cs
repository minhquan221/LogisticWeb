using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.ComponentModel;

namespace LogisticWeb.Common
{
    public class CommonBuildString<T> where T : class
    {
        private static CommonBuildString<T> _current = new CommonBuildString<T>();

        public static CommonBuildString<T> Current
        {
            get
            {
                return _current != null ? _current : new CommonBuildString<T>();
            }
        }

        public string TableViewRender(List<T> data, string[] header = null, string[] dataName = null, Dictionary<string, string> action = null)
        {
            StringBuilder obj = new StringBuilder();

            obj.Append("<table class='table table-striped table-bordered table-hover' id='tbList'>");
            obj.Append("<thead>");
            obj.Append("<tr>");
            obj.Append("<th style='width:8px;'><input type='checkbox' class='group-checkable' data-set='#sample_1 .checkboxes' /></th>");
            Type t = typeof(T);
            PropertyDescriptorCollection propHeader = TypeDescriptor.GetProperties(t);
            if (header == null)
            {
                foreach (PropertyDescriptor field in propHeader)
                {
                    obj.AppendFormat("<th class='hidden-480'>{0}</th>", field.Name.ToString());
                }
            }
            else
            {
                foreach (var colHeader in header)
                {
                    obj.AppendFormat("<th class='hidden-480'>{0}</th>", colHeader);
                }
            }
            if (action != null)
            {
                foreach (var act in action)
                {
                    obj.Append("<th class='hidden-480'></th>");
                }
            }
            obj.Append("</tr>");
            obj.Append("</thead>");
            obj.Append("<tbody>");
            foreach (var item in data)
            {
                obj.Append("<tr class='odd gradeX'>");
                obj.Append("<td><input type='checkbox' class='checkboxes' /></td>");
                if (dataName == null)
                {
                    foreach (PropertyDescriptor field in propHeader)
                    {
                        obj.AppendFormat("<td class='center hidden-480'>{0}</td>", field.GetValue(item).ToString());
                    }
                }
                else
                {
                    foreach (var itemData in dataName)
                    {
                        foreach (PropertyDescriptor field in propHeader)
                        {
                            if (field.Name.ToLower() == itemData.ToLower())
                            {
                                object Value = field.GetValue(item);
                                if (field.PropertyType.FullName.ToLower().Contains("date"))
                                {
                                    if (field.GetValue(item) != null)
                                    {
                                        obj.AppendFormat("<td class='center hidden-480'>{0}</td>", field.GetValue(item).ToString());
                                    }
                                    else
                                    {
                                        obj.Append("<td class='center hidden-480'></td>");
                                    }
                                }
                                else if (field.PropertyType.FullName.ToLower().Contains("byte"))
                                {
                                    //byte[] byteValue = (byte[])Value;
                                    //DateTime date = Convert.ToDateTime((byte[])Value);
                                    //obj.AppendFormat("<td class='center hidden-480'>{0}</td>", date.ToString());
                                }
                                else
                                {
                                    if (field.GetValue(item) != null)
                                    {
                                        obj.AppendFormat("<td class='center hidden-480'>{0}</td>", field.GetValue(item).ToString());
                                    }
                                    else
                                    {
                                        obj.Append("<td class='center hidden-480'></td>");
                                    }
                                }
                                break;
                            }
                        }
                    }
                    if (action != null)
                    {
                        foreach (var act in action)
                        {
                            var id = typeof(T).GetProperty("ID");
                            var strId = id.GetValue(item);
                            obj.AppendFormat("<td class='center hidden-480'><button id='sample_editable_1_new' url='/{2}/detail?id={0}' onclick='GotoUrl(this)' class='btn'>{1}</button></td>", strId, act.Value, act.Key);
                        }
                    }
                }
                obj.Append("</tr>");
            }
            obj.Append("</tbody>");
            obj.Append("</table>");
            return obj.ToString();
        }

        public string BuildCombobox(List<T> obj, string AttributeId, string AttributeName, string FieldValue, string FieldDisplay, List<string[]> attribute = null, string selectValue = "")
        {
            StringBuilder objBuild = new StringBuilder();
            objBuild.AppendFormat("<select id=\"{0}\" name=\"{1}\"", AttributeId, AttributeName);
            if (attribute != null)
            {
                foreach (var item in attribute)
                {
                    objBuild.AppendFormat(" {0}=\"{1}\"", item[0], item[1]);
                }
            }
            objBuild.Append(">");
            foreach (var item in obj)
            {
                PropertyDescriptorCollection fieldObject = TypeDescriptor.GetProperties(item);
                PropertyDescriptor objValue = fieldObject.Find(FieldValue, false);
                PropertyDescriptor objDisplay = fieldObject.Find(FieldDisplay, false);
                objBuild.AppendFormat("<option value=\"{0}\" {2}>{1}</option>", objValue.GetValue(item), objDisplay.GetValue(item), objValue.GetValue(item).ToString() == selectValue ? "selected" : "");
            }
            objBuild.AppendFormat("</select>");
            return objBuild.ToString();
        }
        public string BuildTextbox(string AttributeId, string AttributeName, string valuetext = "", List<string[]> attribute = null)
        {
            StringBuilder objBuild = new StringBuilder();
            objBuild.AppendFormat("<input type=\"text\" id=\"{0}\" name=\"{1}\" value=\"{2}\"", AttributeId, AttributeName, valuetext);
            if (attribute != null)
            {
                foreach (var item in attribute)
                {
                    objBuild.AppendFormat(" {0}=\"{1}\"", item[0], item[1]);
                }
            }
            objBuild.Append(" />");
            return objBuild.ToString();
        }
    }
}