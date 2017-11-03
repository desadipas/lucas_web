using System.Web;
using System.Web.Optimization;

namespace LucasOnline
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundles/SoyLucasStyles")
                .IncludeDirectory("~/Content", "*.css", true));

            bundles.Add(new ScriptBundle("~/Scripts/SoyLucasScripts")
                .Include("~/Scripts/jquery.js")
                .Include("~/Scripts/utils.js")
                .Include("~/Scripts/bootstrap.js")                
                .Include("~/Scripts/jquery.mask.js")
                .Include("~/Scripts/jquery-ui.js")
                .Include("~/Scripts/download.js")
                .Include("~/Scripts/log.js")
                .Include("~/Scripts/datepicker-es.js")
                .Include("~/Scripts/bootbox.js"));

            bundles.Add(new ScriptBundle("~/bundles/SoyLucasAngular")
                .Include("~/Scripts/angular.js")
                .IncludeDirectory("~/Scripts/modules", "*.js", true));

            bundles.Add(new ScriptBundle("~/bundles/SoyLucasApp")
                .Include("~/App/app.js")
                .Include("~/App/app.routes.js")
                .Include("~/App/app.config.js")
                .Include("~/App/app.load.js")
                .Include("~/App/app.controller.js")
                .IncludeDirectory("~/App/shared", "*.js", true)                
                .IncludeDirectory("~/App/public", "*.js", true)
                .IncludeDirectory("~/App/private", "*.js", true));

            bundles.Add(new DynamicFolderBundle("js", "*.js", false, new JsMinify()));
            bundles.Add(new DynamicFolderBundle("css", "*.css", false, new CssMinify()));

#if DEBUG
         BundleTable.EnableOptimizations = false;   
#else
            BundleTable.EnableOptimizations = true;
#endif


        }
    }
}
