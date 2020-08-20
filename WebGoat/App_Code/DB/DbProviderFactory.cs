using System;
using System.Collections.Generic;
using System.Diagnostics;
using log4net;
using System.Reflection;

namespace OWASP.WebGoat.NET.App_Code.DB
{
    //NOT THREAD SAFE!
    public class DbProviderFactory
    {
        private static ILog log = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        
        public static IDbProvider Create(IConfig config)
        {
            config.Load();

            string dbType = config.Get(DbConstants.KEY_DB_TYPE);

            log.Info("Creating provider for" + dbType);

            switch (dbType)
            {
                case DbConstants.DB_TYPE_MYSQL:
                    return new MySqlDbProvider(config);
                case DbConstants.DB_TYPE_SQLITE:
                    return new SqliteDbProvider(config);
                default:
                    throw new Exception(string.Format("Don't know Data Provider type {0}", dbType));
            }
        }
    }
}