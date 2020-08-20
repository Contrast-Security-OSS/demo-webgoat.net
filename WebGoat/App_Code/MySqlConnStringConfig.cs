using MySql.Data.MySqlClient;
using OWASP.WebGoat.NET.App_Code.DB;
using System;
using System.Collections.Generic;

namespace OWASP.WebGoat.NET.App_Code
{
    //This is just used to read the mysql env var for hosting in Azure
    public class MySqlConnStringConfig : IConfig
    {
        private string _value;

        private IDictionary<string, string> _settings = new Dictionary<string, string>();

        public MySqlConnStringConfig(string value)
        {
            _value = value;
        }

        public void Load()
        {
            var builder = new MySqlConnectionStringBuilder(_value);
            _settings[DbConstants.KEY_DB_TYPE] = DbConstants.DB_TYPE_MYSQL;
            _settings[DbConstants.KEY_HOST] = builder.Server.Split(':')[0];
            _settings[DbConstants.KEY_PORT] = builder.Server.Split(':')[1];
            _settings[DbConstants.KEY_DATABASE] = builder.Database;
            _settings[DbConstants.KEY_UID] = builder.UserID;
            _settings[DbConstants.KEY_PWD] = builder.Password;
            _settings[DbConstants.KEY_CLIENT_EXEC] = "D:\\Program Files\\MySQL\\MySQL Server 5.1\\bin\\mysql.exe";
        }

        public void Save()
        {
            //Runtime config only
        }

        public string Get(string key)
        {
            key = key.ToLower();

            if (_settings.ContainsKey(key))
                return _settings[key];

            return string.Empty;
        }

        public void Set(string key, string value)
        {
            //Runtime config only
            _settings[key] = value;
        }

        public void Remove(string key)
        {
            //Runtime config only
            _settings.Remove(key);
        }
    }
}