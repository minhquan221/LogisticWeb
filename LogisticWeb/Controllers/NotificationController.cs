using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LogisticWeb.Controllers
{
    public class NotificationController : BaseController
    {
        [ChildActionOnly]
        public ActionResult NotificationBar()
        {
            return PartialView();
        }

        [ChildActionOnly]
        public ActionResult InboxMail()
        {
            return PartialView();
        }

        [ChildActionOnly]
        public ActionResult ToDoNotification()
        {
            return PartialView();
        }
    }
}