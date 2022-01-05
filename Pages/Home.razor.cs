using Rug.Osc;
using System.Net;

namespace SoundTor.Pages
{
    public partial class Home
    {


        public void SendMessageTest()
        {

            IPAddress address = IPAddress.Parse("127.0.0.1");
            using (OscSender sender = new OscSender(address, 9001))
            {
                sender.Connect();
                sender.Send(new OscMessage("/test", 1));
            }
        }
    }
}
