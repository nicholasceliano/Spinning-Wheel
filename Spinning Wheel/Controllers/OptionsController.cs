using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Spinning_Wheel.Controllers
{
    public class OptionsController : Controller
    {
        private string jsonDataFile = ConfigurationManager.AppSettings.Get("JSONFilePath");

        public ActionResult Edit()
        {
            //collect data from data.json and send to client side
            try
            {
                using (StreamReader sr = new StreamReader(jsonDataFile))
                {
                    ViewBag.JSON = sr.ReadToEnd();
                    sr.Close();
                }
                ViewBag.PageTitle = "Edit";
                return View();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public ActionResult EditIdeasData(string ideasJSON)
        {
            //save file
            try
            {
                using (StreamWriter sw = new StreamWriter(jsonDataFile))
                {
                    sw.Write(ideasJSON);
                    sw.Close();
                }
                return View();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}