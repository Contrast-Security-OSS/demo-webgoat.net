using System;
using System.Collections.Generic;
using System.Text;

/// <summary>
/// comment added by PVK
/// </summary>
namespace OWASP.WebGoat.NET.App_Code
{
    public interface IConfig
    {
        void Load();

        void Save();

        string Get(string key);

        void Set(string key, string value);

        void Remove(string key);
    }
}
