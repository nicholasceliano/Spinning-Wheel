using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Spinning_Wheel.Controllers
{
    public class SpinningWheelController : Controller
    {
        // GET: SpinningWheel
        public ActionResult Index()
        {
            //collect data from data.json and send to client side
            StreamReader sr = new StreamReader(ConfigurationManager.AppSettings.Get("JSONFilePath"));
            ViewBag.JSON = sr.ReadToEnd();

            ViewBag.PageTitle = "Index";

            return View();
        }
    }
}