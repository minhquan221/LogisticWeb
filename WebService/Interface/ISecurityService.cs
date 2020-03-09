using ModelDatabase;
using ModelHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebRepositories.Interface
{
    public interface ISecurityService : IService
    {
        bool CheckValid(ref RegisterCertificate dataMachine, string privateKey, string header);
        AttributeActionResult UpdateIP(RegisterCertificate model);
        SYS_SECURITY GetDataPrivate(string privateKey);
        SYS_SECURITY GetDataFromIP(string Ip);
    }
}
