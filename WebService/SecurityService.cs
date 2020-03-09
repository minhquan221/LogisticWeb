using BusinessObject.Interface;
using ModelDatabase;
using ModelHelper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebRepositories.Interface;

namespace WebService
{
    public class SecurityService : BaseService, ISecurityService
    {
        private string Store_UpdateIP = "dbo.SYS_SECURITY_UpdateIP";
        private string Store_GetByPrivateKey = "dbo.SYS_SECURITY_GetByPrivateKey";
        private string Store_GetByIp = "dbo.SYS_SECURITY_GetByIp";
        private readonly IRepositoryUnitOfWork _uow;
        private readonly ISecurityRepository _Repository;
        public SecurityService(IRepositoryUnitOfWork unitOfWork, ISecurityRepository Repository) : base(unitOfWork)
        {
            _uow = unitOfWork;
            _Repository = Repository;
        }

        public AttributeActionResult UpdateIP(RegisterCertificate model)
        {
            var result = _Repository.CallStoreProcedureAction(Store_UpdateIP, model.IPInternet, model.MachineName, model.macAddress, model.PrivateKey);
            return result;
        }

        public bool CheckValid(ref RegisterCertificate dataMachine, string privateKey, string header)
        {
            dataMachine = new RegisterCertificate();
            var result = _Repository.ExecWithStoreProcedure(Store_GetByPrivateKey, privateKey);
            if (result != null && result.Count > 0)
            {
                var data = result.First();
                var publicKey = data.PUBLICKEY;
                string decode = JoseLibrary.CommonJoseHelper.Current.Decode(header, publicKey, false);
                if (!string.IsNullOrEmpty(decode))
                {
                    dataMachine = JsonConvert.DeserializeObject<RegisterCertificate>(decode);
                    if (dataMachine.MachineName != data.MACHINENAME || data.PRIVATEKEY != dataMachine.PrivateKey)
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                }
                else
                {
                    return false;
                }
            }
            return false;
        }
        public SYS_SECURITY GetDataPrivate(string privateKey)
        {
            var result = _Repository.ExecWithStoreProcedure(Store_GetByPrivateKey, privateKey);
            if (result != null && result.Count > 0)
            {
                var data = result.First();
                return data;
            }
            return null;
        }

        public SYS_SECURITY GetDataFromIP(string Ip)
        {
            var result = _Repository.ExecWithStoreProcedure(Store_GetByIp, Ip);
            if (result != null && result.Count > 0)
            {
                var data = result.First();
                return data;
            }
            return null;
        }
    }
}
