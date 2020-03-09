namespace LogisticWeb
{
    using System.Reflection;
    //using System.Web.Mvc;
    using Autofac;
    using Autofac.Integration.Mvc;
    using Owin;
    using Microsoft.Owin.Security.Cookies;
    using Microsoft.AspNet.Identity;
    using Microsoft.Owin;
    using System.Web.Helpers;
    using System.Security.Claims;
    using ServiceProvider.Modules;
    using System.Web.Http;
    using Autofac.Integration.WebApi;
    using System.Web.Mvc;


    /// <summary>
    /// Register types into the Autofac Inversion of Control (IOC) container. Autofac makes it easy to register common
    /// MVC types like the <see cref="UrlHelper"/> using the <see cref="AutofacWebTypesModule"/>. Feel free to change
    /// this to another IoC container of your choice but ensure that common MVC types like <see cref="UrlHelper"/> are
    /// registered. See http://autofac.readthedocs.org/en/latest/integration/aspnet.html.
    /// </summary>
    public partial class Startup
    {
        private static IContainer CreateContainer()
        {
            ContainerBuilder builder = new ContainerBuilder();
            Assembly assembly = Assembly.GetExecutingAssembly();

            builder.RegisterModule(new DataModule());
            builder.RegisterModule(new ServiceModule());
            builder.RegisterModule(new WebModule());

            IContainer container = builder.Build();

            SetDependencyResolver(container);

            return container;
        }

        /// <summary>
        /// Sets the ASP.NET MVC dependency resolver.
        /// </summary>
        /// <param name="container">The container.</param>
        private static void SetDependencyResolver(IContainer container)
        {
            //var autofacresolve = new AutofacWebApiDependencyResolver(container);
            ////DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            //GlobalConfiguration.Configuration.DependencyResolver = autofacresolve;
            //DependencyResolver.SetResolver(autofacresolve);
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }

        public static void ConfigureContainer(IAppBuilder app)
        {
            IContainer container = CreateContainer();
            app.UseAutofacMiddleware(container);

            //HttpConfiguration config = GlobalConfiguration.Configuration;
            //app.UseWebApi(config);

            // Register MVC Types
            app.UseAutofacMvc();
        }

        //public static void ConfigureAuth(IAppBuilder app)
        //{
        //    // Enable the application to use a cookie to store information for the signed in user
        //    app.UseCookieAuthentication(new CookieAuthenticationOptions
        //    {
        //        AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
        //        LoginPath = new PathString("/Account/Login")
        //    });
        //    AntiForgeryConfig.UniqueClaimTypeIdentifier = ClaimTypes.NameIdentifier;
        //}
    }
}